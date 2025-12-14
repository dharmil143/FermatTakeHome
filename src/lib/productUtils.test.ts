import {
    calculatePurchaseCounts,
    enrichProductsWithCounts,
    filterProducts,
    sortProducts,
    calculateFacets,
    paginateProducts
} from './productUtils';
import { Product, Order } from '@/types/product';

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Product A',
        description: 'Description A',
        price: 100,
        category: 'Electronics',
        brand: 'BrandX',
        inStock: true,
        rating: 4.5,
        imageUrl: 'url1',
        tags: ['tag1', 'tag2']
    },
    {
        id: '2',
        name: 'Product B',
        description: 'Description B',
        price: 200,
        category: 'Clothing',
        brand: 'BrandY',
        inStock: false,
        rating: 3.5,
        imageUrl: 'url2',
        tags: ['tag2', 'tag3']
    },
    {
        id: '3',
        name: 'Product C',
        description: 'Description C',
        price: 50,
        category: 'Electronics',
        brand: 'BrandX',
        inStock: true,
        rating: 5.0,
        imageUrl: 'url3',
        tags: ['tag1']
    }
];

const mockOrders: Order[] = [
    {
        orderId: 'o1',
        customerId: 'u1',
        items: [
            { productId: '1', quantity: 2, price: 100 },
            { productId: '2', quantity: 1, price: 200 }
        ],
        total: 400,
        date: '2023-01-01'
    },
    {
        orderId: 'o2',
        customerId: 'u2',
        items: [
            { productId: '1', quantity: 1, price: 100 }
        ],
        total: 100,
        date: '2023-01-02'
    }
];

describe('productUtils', () => {
    describe('calculatePurchaseCounts', () => {
        it('should correctly calculate purchase counts from orders', () => {
            const counts = calculatePurchaseCounts(mockOrders);
            expect(counts.get('1')).toBe(3); // 2 + 1
            expect(counts.get('2')).toBe(1);
            expect(counts.get('3')).toBeUndefined();
        });
    });

    describe('enrichProductsWithCounts', () => {
        it('should add purchaseCount to products', () => {
            const counts = new Map([['1', 3], ['2', 1]]);
            const enriched = enrichProductsWithCounts(mockProducts, counts);

            expect(enriched[0].purchaseCount).toBe(3);
            expect(enriched[1].purchaseCount).toBe(1);
            expect(enriched[2].purchaseCount).toBe(0);
        });
    });

    describe('filterProducts', () => {
        it('should filter by search term', () => {
            const result = filterProducts(mockProducts, { search: 'Product A' });
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('1');
        });

        it('should filter by category', () => {
            const result = filterProducts(mockProducts, { categories: ['Electronics'] });
            expect(result).toHaveLength(2);
            expect(result.map(p => p.id)).toContain('1');
            expect(result.map(p => p.id)).toContain('3');
        });

        it('should filter by brand', () => {
            const result = filterProducts(mockProducts, { brands: ['BrandY'] });
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('2');
        });

        it('should filter by tags', () => {
            const result = filterProducts(mockProducts, { tags: ['tag1'] });
            expect(result).toHaveLength(2);
            expect(result.map(p => p.id)).toContain('1');
            expect(result.map(p => p.id)).toContain('3');
        });

        it('should filter by availability', () => {
            const result = filterProducts(mockProducts, { availability: ['in-stock'] });
            expect(result).toHaveLength(2);
            expect(result.map(p => p.id)).toContain('1');
            expect(result.map(p => p.id)).toContain('3');
        });

        it('should filter by price range', () => {
            const result = filterProducts(mockProducts, { minPrice: 100, maxPrice: 150 });
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('1');
        });

        it('should combine multiple filters', () => {
            const result = filterProducts(mockProducts, {
                categories: ['Electronics'],
                minPrice: 80
            });
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('1');
        });
    });

    describe('sortProducts', () => {
        it('should sort by price ascending', () => {
            const result = sortProducts(mockProducts, 'price-asc');
            expect(result[0].id).toBe('3'); // 50
            expect(result[1].id).toBe('1'); // 100
            expect(result[2].id).toBe('2'); // 200
        });

        it('should sort by price descending', () => {
            const result = sortProducts(mockProducts, 'price-desc');
            expect(result[0].id).toBe('2'); // 200
            expect(result[1].id).toBe('1'); // 100
            expect(result[2].id).toBe('3'); // 50
        });

        it('should sort by rating', () => {
            const result = sortProducts(mockProducts, 'rating');
            expect(result[0].id).toBe('3'); // 5.0
            expect(result[1].id).toBe('1'); // 4.5
            expect(result[2].id).toBe('2'); // 3.5
        });
    });

    describe('calculateFacets', () => {
        it('should correctly calculate facets', () => {
            const facets = calculateFacets(mockProducts);

            expect(facets.categories['Electronics']).toBe(2);
            expect(facets.categories['Clothing']).toBe(1);

            expect(facets.brands['BrandX']).toBe(2);
            expect(facets.brands['BrandY']).toBe(1);

            expect(facets.tags['tag1']).toBe(2);
            expect(facets.tags['tag2']).toBe(2);
            expect(facets.tags['tag3']).toBe(1);

            expect(facets.availability['in-stock']).toBe(2);
            expect(facets.availability['out-of-stock']).toBe(1);
        });
    });

    describe('paginateProducts', () => {
        it('should paginate correctly', () => {
            const { paginatedProducts, pagination } = paginateProducts(mockProducts, 1, 2);

            expect(paginatedProducts).toHaveLength(2);
            expect(pagination.total).toBe(3);
            expect(pagination.totalPages).toBe(2);
            expect(pagination.hasMore).toBe(true);
            expect(pagination.hasPrevious).toBe(false);
        });

        it('should handle last page', () => {
            const { paginatedProducts, pagination } = paginateProducts(mockProducts, 2, 2);

            expect(paginatedProducts).toHaveLength(1);
            expect(pagination.hasMore).toBe(false);
            expect(pagination.hasPrevious).toBe(true);
        });
    });
});
