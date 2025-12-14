'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductRecommendationsProps {
    productId: string;
    productName: string;
    onClose: () => void;
}

export default function ProductRecommendations({
    productId,
    productName,
    onClose
}: ProductRecommendationsProps) {
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                const response = await fetch(
                    `/api/recommendations?productId=${productId}&limit=6`
                );
                const data = await response.json();
                setRecommendations(data.recommendations);
            } catch (error) {
                console.error('Failed to fetch recommendations:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendations();
    }, [productId]);

    return (
        <div className="fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto animate-slide-in-right">
            {/* Header */}
            <div className="sticky top-0 bg-indigo-600 text-white p-6 shadow-lg z-10">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold">Frequently Bought Together</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Close recommendations"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-sm text-white/90">
                    Customers who bought <span className="font-semibold">{productName}</span> also purchased:
                </p>
            </div>

            {/* Content */}
            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                        <p className="text-gray-500 text-sm">Finding recommendations...</p>
                    </div>
                ) : recommendations.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-gray-600 font-medium">No recommendations yet</p>
                        <p className="text-gray-500 text-sm mt-1">This product hasn't been purchased with others</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recommendations.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex space-x-4">
                                    {/* Image */}
                                    <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            sizes="96px"
                                        />
                                        {product.coPurchaseCount && product.coPurchaseCount > 0 && (
                                            <div className="absolute top-1 right-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                                                {product.coPurchaseCount}x
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-1">
                                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                                {product.category}
                                            </span>
                                            {!product.inStock && (
                                                <span className="text-xs text-red-600 font-semibold">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {product.name}
                                        </h4>

                                        <div className="flex items-center mb-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-3 h-3 ${i < Math.floor(product.rating)
                                                            ? 'text-amber-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                                <span className="ml-1 text-xs text-gray-600">{product.rating}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-indigo-600">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            <button
                                                disabled={!product.inStock}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${product.inStock
                                                    ? 'bg-indigo-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                {product.inStock ? 'Add to Cart' : 'Unavailable'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                {!loading && recommendations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="bg-indigo-50 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-700">
                                💡 <span className="font-semibold">{recommendations.length}</span> products frequently purchased together
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Based on order history analysis
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
