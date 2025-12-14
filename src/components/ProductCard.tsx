'use client';

import { Product } from '@/types/product';
import Image from 'next/image';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <div
            onClick={onClick}
            className={`group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* Image Container */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {!imageError ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                        <div className="text-center">
                            <svg
                                className="w-20 h-20 mx-auto text-indigo-300 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <p className="text-sm text-indigo-400 font-medium">{product.category}</p>
                        </div>
                    </div>
                )}

                {/* Stock Badge */}
                {!product.inStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Out of Stock
                    </div>
                )}

                {/* Popularity Badge */}
                {product.purchaseCount && product.purchaseCount > 0 && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{product.purchaseCount} sold</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Category & Brand */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        {product.category}
                    </span>
                    <span className="text-xs text-gray-500">{product.brand}</span>
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors min-h-[3rem]">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                    ? 'text-amber-400'
                                    : i < product.rating
                                        ? 'text-amber-400'
                                        : 'text-gray-300'
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 font-medium">{product.rating.toFixed(1)}</span>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-2xl font-bold text-indigo-600">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>
                    <button
                        disabled={!product.inStock}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${product.inStock
                            ? 'bg-indigo-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {product.inStock ? 'Add to Cart' : 'Unavailable'}
                    </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                    {product.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
