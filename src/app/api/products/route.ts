import { NextRequest, NextResponse } from 'next/server';
import { Product, Order } from '@/types/product';
import { promises as fs } from 'fs';
import path from 'path';
import {
    calculatePurchaseCounts,
    enrichProductsWithCounts,
    filterProducts,
    sortProducts,
    calculateFacets,
    paginateProducts
} from '@/lib/productUtils';

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300;

// Internal cache
let cachedData: { products: Product[], orders: Order[], timestamp: number } | null = null;
const INTERNAL_CACHE_TTL = 60 * 1000; // 1 minute

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse and validate query parameters
        const search = searchParams.get('search')?.trim() || '';
        const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
        const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
        const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
        const availability = searchParams.get('availability')?.split(',').filter(Boolean) || [];

        // Validate price parameters
        const minPrice = Math.max(0, parseFloat(searchParams.get('minPrice') || '0'));
        const maxPrice = Math.max(minPrice, parseFloat(searchParams.get('maxPrice') || '999999'));
        const sortBy = searchParams.get('sortBy') || '';

        // Pagination parameters
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));

        // Validate sortBy parameter
        const validSortOptions = ['price-asc', 'price-desc', 'rating', 'popular', ''];
        if (!validSortOptions.includes(sortBy)) {
            return NextResponse.json(
                { error: 'Invalid sort option' },
                { status: 400 }
            );
        }

        // Get data (from cache or file system)
        let products: Product[];
        let orders: Order[];

        const now = Date.now();
        if (cachedData && (now - cachedData.timestamp < INTERNAL_CACHE_TTL)) {
            products = cachedData.products;
            orders = cachedData.orders;
        } else {
            const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
            const ordersPath = path.join(process.cwd(), 'public', 'data', 'orders.json');

            const [productsData, ordersData] = await Promise.all([
                fs.readFile(productsPath, 'utf-8'),
                fs.readFile(ordersPath, 'utf-8'),
            ]);

            products = JSON.parse(productsData);
            orders = JSON.parse(ordersData);

            cachedData = {
                products,
                orders,
                timestamp: now
            };
        }

        // Calculate purchase counts and enrich products
        const purchaseCounts = calculatePurchaseCounts(orders);
        const productsWithCounts = enrichProductsWithCounts(products, purchaseCounts);

        // Apply filters
        const filteredProducts = filterProducts(productsWithCounts, {
            search,
            categories,
            brands,
            tags,
            availability,
            minPrice,
            maxPrice
        });

        // Apply sorting
        const sortedProducts = sortProducts(filteredProducts, sortBy);

        // Calculate faceted counts (before pagination)
        const facetCounts = calculateFacets(sortedProducts);

        // Apply pagination
        const { paginatedProducts, pagination } = paginateProducts(sortedProducts, page, limit);

        // Get unique categories, brands, and tags for filter options
        const allCategories = [...new Set(products.map(p => p.category))].sort();
        const allBrands = [...new Set(products.map(p => p.brand))].sort();
        const allTags = [...new Set(products.flatMap(p => p.tags))].sort();

        const response = NextResponse.json({
            products: paginatedProducts,
            pagination,
            metadata: {
                total: filteredProducts.length,
                categories: allCategories,
                brands: allBrands,
                tags: allTags,
            },
            facets: facetCounts,
        });

        // Add cache headers for better performance
        response.headers.set('Cache-Control', `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate`);

        return response;
    } catch (error) {
        console.error('Error fetching products:', error);

        // Provide more specific error messages in development
        const errorMessage = process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : 'Failed to fetch products';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
