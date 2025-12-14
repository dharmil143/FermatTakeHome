import { Product, Order } from '@/types/product';

export interface FilterParams {
    search?: string;
    categories?: string[];
    brands?: string[];
    tags?: string[];
    availability?: string[];
    minPrice?: number;
    maxPrice?: number;
}

export function calculatePurchaseCounts(orders: Order[]): Map<string, number> {
    const purchaseCounts = new Map<string, number>();
    orders.forEach(order => {
        order.items.forEach(item => {
            const currentCount = purchaseCounts.get(item.productId) || 0;
            purchaseCounts.set(item.productId, currentCount + item.quantity);
        });
    });
    return purchaseCounts;
}

export function enrichProductsWithCounts(products: Product[], purchaseCounts: Map<string, number>): Product[] {
    return products.map(product => ({
        ...product,
        purchaseCount: purchaseCounts.get(product.id) || 0,
    }));
}

export function filterProducts(products: Product[], filters: FilterParams): Product[] {
    const {
        search = '',
        categories = [],
        brands = [],
        tags = [],
        availability = [],
        minPrice = 0,
        maxPrice = 999999
    } = filters;

    return products.filter(product => {
        // Search filter - case insensitive
        const matchesSearch = !search ||
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase()) ||
            product.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

        // Category filter
        const matchesCategory = categories.length === 0 || categories.includes(product.category);

        // Brand filter
        const matchesBrand = brands.length === 0 || brands.includes(product.brand);

        // Tag filter
        const matchesTags = tags.length === 0 ||
            tags.some(tag => product.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()));

        // Stock filter
        const matchesStock = availability.length === 0 ||
            (availability.includes('in-stock') && product.inStock) ||
            (availability.includes('out-of-stock') && !product.inStock);

        // Price filter
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesBrand && matchesTags && matchesStock && matchesPrice;
    });
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
    const sortedProducts = [...products];
    switch (sortBy) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'popular':
            sortedProducts.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
            break;
        default:
            // Default order
            break;
    }
    return sortedProducts;
}

export function calculateFacets(products: Product[]) {
    const facetCounts = {
        categories: {} as Record<string, number>,
        brands: {} as Record<string, number>,
        tags: {} as Record<string, number>,
        availability: {
            'in-stock': 0,
            'out-of-stock': 0,
        } as Record<string, number>,
    };

    products.forEach(product => {
        // Count by category
        facetCounts.categories[product.category] = (facetCounts.categories[product.category] || 0) + 1;

        // Count by brand
        facetCounts.brands[product.brand] = (facetCounts.brands[product.brand] || 0) + 1;

        // Count by tags
        product.tags.forEach(tag => {
            facetCounts.tags[tag] = (facetCounts.tags[tag] || 0) + 1;
        });

        // Count by stock status
        if (product.inStock) {
            facetCounts.availability['in-stock']++;
        } else {
            facetCounts.availability['out-of-stock']++;
        }
    });

    return facetCounts;
}

export function paginateProducts(products: Product[], page: number, limit: number) {
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
        paginatedProducts,
        pagination: {
            page,
            limit,
            total: totalProducts,
            totalPages,
            hasMore: endIndex < totalProducts,
            hasPrevious: page > 1,
        }
    };
}
