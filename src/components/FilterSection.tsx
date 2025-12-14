import { useState } from 'react';

interface FilterSectionProps {
    title: string;
    items: string[];
    selectedItems: string[];
    counts: Record<string, number>;
    onToggle: (item: string) => void;
    searchable?: boolean;
    searchPlaceholder?: string;
    icon?: React.ReactNode;
}

export default function FilterSection({
    title,
    items,
    selectedItems,
    counts,
    onToggle,
    searchable = false,
    searchPlaceholder = 'Search...',
    icon
}: FilterSectionProps) {
    const [search, setSearch] = useState('');

    // Filter items based on search
    const filteredItems = search
        ? items.filter(item => item.toLowerCase().includes(search.toLowerCase()))
        : items;

    if (items.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    {icon && <span className="mr-2 text-indigo-600">{icon}</span>}
                    {title}
                </div>
                {selectedItems.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">
                        {selectedItems.length}
                    </span>
                )}
            </h3>

            {/* Search Input */}
            {searchable && items.length > 5 && (
                <div className="mb-3 relative">
                    <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {/* Items List */}
            <div className="space-y-2 max-h-60 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                {filteredItems.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No results found
                    </p>
                ) : (
                    <>
                        {filteredItems.map((item) => (
                            <label
                                key={item}
                                className="flex items-center justify-between cursor-pointer group"
                            >
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item)}
                                        onChange={() => onToggle(item)}
                                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                                    />
                                    <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                                        {item}
                                    </span>
                                </div>
                                {counts[item] !== undefined && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {counts[item]}
                                    </span>
                                )}
                            </label>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
