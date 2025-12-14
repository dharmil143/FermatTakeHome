interface EmptyStateProps {
    onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
    return (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn&apos;t find any products matching your filters. Try adjusting your search criteria or clearing filters.
            </p>
            <button
                onClick={onClearFilters}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 active:scale-95"
            >
                Clear All Filters
            </button>
        </div>
    );
}
