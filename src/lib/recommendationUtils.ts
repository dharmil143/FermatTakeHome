import { Order, Product } from '@/types/product';

export interface RecommendationResult extends Product {
    coPurchaseCount: number;
}

export function getRecommendations(
    orders: Order[],
    products: Product[],
    targetProductId: string,
    limit: number = 4
): RecommendationResult[] {
    // Find orders containing the specified product
    const ordersWithProduct = orders.filter(order =>
        order.items.some(item => item.productId === targetProductId)
    );

    // Count co-purchased products
    const coPurchaseCounts = new Map<string, number>();

    ordersWithProduct.forEach(order => {
        order.items.forEach(item => {
            // Don't count the product itself
            if (item.productId !== targetProductId) {
                const currentCount = coPurchaseCounts.get(item.productId) || 0;
                coPurchaseCounts.set(item.productId, currentCount + item.quantity);
            }
        });
    });

    // Sort by frequency and get top recommendations
    const topRecommendations = Array.from(coPurchaseCounts.entries())
        .map(([id, count]) => ({ productId: id, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

    // Map product IDs to full product objects
    return topRecommendations
        .map(rec => {
            const product = products.find(p => p.id === rec.productId);
            return product ? { ...product, coPurchaseCount: rec.count } : null;
        })
        .filter((item): item is RecommendationResult => item !== null);
}
