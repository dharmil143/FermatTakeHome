import { getRecommendations } from './recommendationUtils';
import { Order, Product } from '@/types/product';

const mockProducts: Product[] = [
    { id: '1', name: 'P1', description: 'D1', price: 10, category: 'C1', brand: 'B1', inStock: true, rating: 4, imageUrl: 'url1', tags: [] },
    { id: '2', name: 'P2', description: 'D2', price: 20, category: 'C1', brand: 'B1', inStock: true, rating: 4, imageUrl: 'url2', tags: [] },
    { id: '3', name: 'P3', description: 'D3', price: 30, category: 'C2', brand: 'B2', inStock: true, rating: 4, imageUrl: 'url3', tags: [] },
    { id: '4', name: 'P4', description: 'D4', price: 40, category: 'C2', brand: 'B2', inStock: true, rating: 4, imageUrl: 'url4', tags: [] },
];

const mockOrders: Order[] = [
    {
        orderId: 'o1',
        customerId: 'c1',
        date: '2023-01-01',
        total: 100,
        items: [
            { productId: '1', quantity: 1, price: 10 },
            { productId: '2', quantity: 1, price: 20 },
        ]
    },
    {
        orderId: 'o2',
        customerId: 'c2',
        date: '2023-01-02',
        total: 100,
        items: [
            { productId: '1', quantity: 1, price: 10 },
            { productId: '2', quantity: 2, price: 20 }, // Bought P2 twice with P1
            { productId: '3', quantity: 1, price: 30 },
        ]
    },
    {
        orderId: 'o3',
        customerId: 'c3',
        date: '2023-01-03',
        total: 100,
        items: [
            { productId: '1', quantity: 1, price: 10 },
            // Only P1
        ]
    },
    {
        orderId: 'o4',
        customerId: 'c4',
        date: '2023-01-04',
        total: 100,
        items: [
            { productId: '4', quantity: 1, price: 40 },
            // No P1
        ]
    }
];

describe('getRecommendations', () => {
    it('should return correct recommendations for a product', () => {
        const recommendations = getRecommendations(mockOrders, mockProducts, '1');

        // P1 was bought with P2 (twice: 1+2=3) and P3 (once: 1)
        expect(recommendations).toHaveLength(2);

        // P2 should be first (count 3)
        expect(recommendations[0].id).toBe('2');
        expect(recommendations[0].coPurchaseCount).toBe(3);

        // P3 should be second (count 1)
        expect(recommendations[1].id).toBe('3');
        expect(recommendations[1].coPurchaseCount).toBe(1);
    });

    it('should respect the limit', () => {
        const recommendations = getRecommendations(mockOrders, mockProducts, '1', 1);
        expect(recommendations).toHaveLength(1);
        expect(recommendations[0].id).toBe('2');
    });

    it('should return empty array if no co-purchases found', () => {
        const recommendations = getRecommendations(mockOrders, mockProducts, '4');
        expect(recommendations).toHaveLength(0);
    });

    it('should return empty array if product not found in orders', () => {
        const recommendations = getRecommendations(mockOrders, mockProducts, '999');
        expect(recommendations).toHaveLength(0);
    });
});
