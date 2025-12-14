'use client';

import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
    onProductClick?: (product: Product) => void;
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onClick={onProductClick ? () => onProductClick(product) : undefined}
                />
            ))}
        </div>
    );
}
