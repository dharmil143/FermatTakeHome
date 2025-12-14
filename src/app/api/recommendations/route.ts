import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/types/product';
import { promises as fs } from 'fs';
import path from 'path';

import { getRecommendations } from '@/lib/recommendationUtils';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('productId');
        const limit = parseInt(searchParams.get('limit') || '4');

        if (!productId) {
            return NextResponse.json(
                { error: 'productId is required' },
                { status: 400 }
            );
        }

        // Read orders data
        const ordersPath = path.join(process.cwd(), 'public', 'data', 'orders.json');
        const ordersData = await fs.readFile(ordersPath, 'utf-8');
        const orders: Order[] = JSON.parse(ordersData);

        // Read products data to get full product details
        const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
        const productsData = await fs.readFile(productsPath, 'utf-8');
        const products = JSON.parse(productsData);

        // Get recommendations
        const recommendedProducts = getRecommendations(orders, products, productId, limit);

        return NextResponse.json({
            productId,
            recommendations: recommendedProducts,
            total: recommendedProducts.length,
        });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recommendations' },
            { status: 500 }
        );
    }
}
