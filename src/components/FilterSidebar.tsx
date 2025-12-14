'use client';

import { useState } from 'react';

import FilterSection from './FilterSection';

interface FilterSidebarProps {
    categories: string[];
    brands: string[];
    tags: string[];
    selectedCategories: string[];
    selectedBrands: string[];
    selectedTags: string[];
    selectedAvailability: string[];
    minPrice: number;
    maxPrice: number;
    facets: {
        categories: Record<string, number>;
        brands: Record<string, number>;
        tags: Record<string, number>;
        availability: Record<string, number>;
    };
    onCategoryToggle: (category: string) => void;
    onBrandToggle: (brand: string) => void;
    onTagToggle: (tag: string) => void;
    onAvailabilityToggle: (option: string) => void;
    onPriceChange: (min: number, max: number) => void;
    onClearFilters: () => void;
    onClose: () => void;
}

export default function FilterSidebar({
    categories,
    brands,
    tags,
    selectedCategories,
    selectedBrands,
    selectedTags,
    selectedAvailability,
    minPrice,
    maxPrice,
    facets,
    onCategoryToggle,
    onBrandToggle,
    onTagToggle,
    onAvailabilityToggle,
    onPriceChange,
    onClearFilters,
    onClose,
}: FilterSidebarProps) {
    const [localMinPrice, setLocalMinPrice] = useState(minPrice.toString());
    const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice === 999999 ? '' : maxPrice.toString());

    const handlePriceSubmit = () => {
        const min = parseFloat(localMinPrice) || 0;
        const max = parseFloat(localMaxPrice) || 999999;
        onPriceChange(min, max);
    };

    const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || selectedTags.length > 0 || selectedAvailability.length > 0 || minPrice > 0 || maxPrice < 999999;

    return (
        <div className="h-full flex flex-col bg-white lg:bg-transparent">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:border-0">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Categories */}
                <FilterSection
                    title="Categories"
                    items={categories}
                    selectedItems={selectedCategories}
                    counts={facets.categories}
                    onToggle={onCategoryToggle}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    }
                />

                {/* Brands */}
                <FilterSection
                    title="Brands"
                    items={brands}
                    selectedItems={selectedBrands}
                    counts={facets.brands}
                    onToggle={onBrandToggle}
                    searchable={true}
                    searchPlaceholder="Search brands..."
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    }
                />

                {/* Tags */}
                <FilterSection
                    title="Tags"
                    items={tags}
                    selectedItems={selectedTags}
                    counts={facets.tags}
                    onToggle={onTagToggle}
                    searchable={true}
                    searchPlaceholder="Search tags..."
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    }
                />

                {/* Availability */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Availability
                    </h3>
                    <div className="space-y-2">
                        {/* In Stock */}
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={selectedAvailability.includes('in-stock')}
                                    onChange={() => onAvailabilityToggle('in-stock')}
                                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                                />
                                <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                                    In Stock
                                </span>
                            </div>
                            {facets.availability['in-stock'] !== undefined && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {facets.availability['in-stock']}
                                </span>
                            )}
                        </label>

                        {/* Out of Stock */}
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={selectedAvailability.includes('out-of-stock')}
                                    onChange={() => onAvailabilityToggle('out-of-stock')}
                                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                                />
                                <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                                    Out of Stock
                                </span>
                            </div>
                            {facets.availability['out-of-stock'] !== undefined && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {facets.availability['out-of-stock']}
                                </span>
                            )}
                        </label>
                    </div>
                </div>

                {/* Price Range */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Price Range
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">Min Price</label>
                            <input
                                type="number"
                                value={localMinPrice}
                                onChange={(e) => setLocalMinPrice(e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">Max Price</label>
                            <input
                                type="number"
                                value={localMaxPrice}
                                onChange={(e) => setLocalMaxPrice(e.target.value)}
                                placeholder="No limit"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <button
                            onClick={handlePriceSubmit}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                            Apply Price Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            {hasActiveFilters && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClearFilters}
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Clear All Filters</span>
                    </button>
                </div>
            )}
        </div>
    );
}
