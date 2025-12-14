'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, FilterOptions } from '@/types/product';
import ProductGrid from '@/components/ProductGrid';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import SortDropdown from '@/components/SortDropdown';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ProductRecommendations from '@/components/ProductRecommendations';
import Pagination from '@/components/Pagination';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [facets, setFacets] = useState<{
    categories: Record<string, number>;
    brands: Record<string, number>;
    tags: Record<string, number>;
    availability: Record<string, number>;
  }>({ categories: {}, brands: {}, tags: {}, availability: { 'in-stock': 0, 'out-of-stock': 0 } });

  // Initialize filters from URL
  const [filters, setFilters] = useState<FilterOptions>(() => ({
    search: searchParams.get('search') || '',
    categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
    brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    availability: searchParams.get('availability')?.split(',').filter(Boolean) || [],
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 999999,
    sortBy: (searchParams.get('sortBy') as FilterOptions['sortBy']) || '',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  }));

  // Update URL when filters change
  useEffect(() => {
    // Skip URL update on initial mount to prevent overwriting URL params
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));
    if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));
    if (filters.availability.length > 0) params.set('availability', filters.availability.join(','));
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice < 999999) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.page > 1) params.set('page', filters.page.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : '/';
    router.replace(newUrl, { scroll: false });
  }, [
    filters.search,
    filters.categories.join(','),
    filters.brands.join(','),
    filters.tags.join(','),
    filters.availability.join(','),
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy,
    filters.page,
    router,
  ]);

  // Use a fetch trigger to handle manual retries
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.categories.length > 0) params.append('categories', filters.categories.join(','));
        if (filters.brands.length > 0) params.append('brands', filters.brands.join(','));
        if (filters.tags.length > 0) params.append('tags', filters.tags.join(','));
        if (filters.availability.length > 0) params.append('availability', filters.availability.join(','));
        if (filters.minPrice > 0) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice < 999999) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        params.append('page', filters.page.toString());
        params.append('limit', filters.limit.toString());

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data.products);
        setCategories(data.metadata.categories);
        setBrands(data.metadata.brands);
        setTags(data.metadata.tags || []);
        setTotalPages(data.pagination.totalPages);
        setTotalProducts(data.pagination.total);
        setFacets(data.facets || { categories: {}, brands: {}, tags: {}, availability: { 'in-stock': 0, 'out-of-stock': 0 } });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    filters.search,
    filters.categories.join(','),
    filters.brands.join(','),
    filters.tags.join(','),
    filters.availability.join(','),
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy,
    filters.page,
    filters.limit,
    fetchTrigger,
  ]);

  const handleRetry = useCallback(() => {
    setFetchTrigger(prev => prev + 1);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  }, []);

  const handleCategoryToggle = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const handleBrandToggle = useCallback((brand: string) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand],
    }));
  }, []);

  const handlePriceChange = useCallback((minPrice: number, maxPrice: number) => {
    setFilters(prev => ({ ...prev, minPrice, maxPrice, page: 1 }));
  }, []);

  const handleSortChange = useCallback((sortBy: FilterOptions['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy, page: 1 }));
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const handleAvailabilityToggle = useCallback((option: string) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(a => a !== option)
        : [...prev.availability, option],
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      categories: [],
      brands: [],
      tags: [],
      availability: [],
      minPrice: 0,
      maxPrice: 999999,
      sortBy: '',
      page: 1,
      limit: 12,
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice < 999999 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-indigo-600">
                Fermàt
              </h1>
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Sort Bar */}
        <div className="mb-8 space-y-4">
          <SearchBar value={filters.search} onChange={handleSearchChange} />

          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {loading ? (
                <span className="animate-pulse">Loading products...</span>
              ) : (
                <>
                  <span className="font-semibold text-gray-900">{totalProducts}</span> products found
                  {totalPages > 1 && (
                    <span className="text-gray-500"> • Page {filters.page} of {totalPages}</span>
                  )}
                </>
              )}
            </p>
            <SortDropdown value={filters.sortBy} onChange={handleSortChange} />
          </div>
        </div>

        {/* Content Grid */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out 
            lg:relative lg:transform-none lg:shadow-none lg:col-span-1 lg:bg-transparent lg:w-auto lg:z-30
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <FilterSidebar
              categories={categories}
              brands={brands}
              tags={tags}
              selectedCategories={filters.categories}
              selectedBrands={filters.brands}
              selectedTags={filters.tags}
              selectedAvailability={filters.availability}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              facets={facets}
              onCategoryToggle={handleCategoryToggle}
              onBrandToggle={handleBrandToggle}
              onTagToggle={handleTagToggle}
              onAvailabilityToggle={handleAvailabilityToggle}
              onPriceChange={handlePriceChange}
              onClearFilters={handleClearFilters}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <EmptyState onClearFilters={handleClearFilters} />
            ) : (
              <>
                <ProductGrid
                  products={products}
                  onProductClick={(product) => setSelectedProduct(product)}
                />
                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </main>
        </div>
      </div>

      {/* Recommendations Sidebar */}
      {selectedProduct && (
        <ProductRecommendations
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
