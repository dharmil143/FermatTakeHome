'use client';

import { FilterOptions } from '@/types/product';

interface SortDropdownProps {
    value: FilterOptions['sortBy'];
    onChange: (value: FilterOptions['sortBy']) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as FilterOptions['sortBy'])}
                className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-gray-700 font-medium cursor-pointer shadow-sm hover:border-gray-300"
            >
                <option value="">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}
