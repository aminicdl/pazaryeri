'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid';
import FilterSidebar from '@/components/organisms/FilterSidebar/FilterSidebar';
import Pagination from '@/components/molecules/Pagination/Pagination';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import type { Product, ProductFilters } from '@/types/product';
import type { Category } from '@/types/category';
import type { Locale } from '@/lib/i18n/config';

interface ProductsPageClientProps {
  lang: Locale;
  dictionary: {
    navigation: { products: string };
    product: {
      addToFavorites: string;
      removeFromFavorites: string;
      inStock: string;
      outOfStock: string;
    };
    common: {
      loading: string;
      noResults: string;
    };
    filters: {
      title: string;
      category: string;
      priceRange: string;
      minPrice: string;
      maxPrice: string;
      sortBy: string;
      sortOptions: {
        newest: string;
        priceAsc: string;
        priceDesc: string;
        rating: string;
      };
      clearAll: string;
      apply: string;
    };
    pagination: {
      previous: string;
      next: string;
      page: string;
      of: string;
    };
  };
}

export default function ProductsPageClient({ lang, dictionary }: ProductsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ProductFilters>({});

  // Parse URL params on mount
  useEffect(() => {
    const categoryId = searchParams.get('category') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const sortBy = searchParams.get('sortBy') as ProductFilters['sortBy'] || undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const search = searchParams.get('search') || undefined;

    setFilters({ categoryId, minPrice, maxPrice, sortBy, search });
    setCurrentPage(page);
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Fetch products when filters or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getProducts(filters, currentPage, 12);
        setProducts(result.products);
        setTotalPages(result.meta.totalPages);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage]);

  // Update URL when filters change
  const updateURL = useCallback((newFilters: ProductFilters, page: number) => {
    const params = new URLSearchParams();
    
    if (newFilters.categoryId) params.set('category', newFilters.categoryId);
    if (newFilters.minPrice) params.set('minPrice', String(newFilters.minPrice));
    if (newFilters.maxPrice) params.set('maxPrice', String(newFilters.maxPrice));
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
    if (newFilters.search) params.set('search', newFilters.search);
    if (page > 1) params.set('page', String(page));

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  }, [pathname, router]);

  const handleFilterChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters, 1);
  }, [updateURL]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    updateURL(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, updateURL]);

  const handleReset = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
    router.push(pathname);
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {dictionary.navigation.products}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              dictionary={{
                categories: dictionary.filters.category,
                allCategories: lang === 'tr' ? 'Tüm Kategoriler' : 'All Categories',
                priceRange: dictionary.filters.priceRange,
                minPrice: dictionary.filters.minPrice,
                maxPrice: dictionary.filters.maxPrice,
                sortBy: dictionary.filters.sortBy,
                sortOptions: dictionary.filters.sortOptions,
                inStockOnly: lang === 'tr' ? 'Sadece Stokta Olanlar' : 'In Stock Only',
                applyFilters: dictionary.filters.apply,
                resetFilters: dictionary.filters.clearAll,
              }}
            />
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <ProductGrid
              products={products}
              lang={lang}
              columns={3}
              loading={loading}
              dictionary={{
                product: dictionary.product,
                common: dictionary.common,
              }}
            />

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  dictionary={{
                    previous: dictionary.pagination.previous,
                    next: dictionary.pagination.next,
                    page: dictionary.pagination.page,
                    of: dictionary.pagination.of,
                    first: lang === 'tr' ? 'İlk sayfa' : 'First page',
                    last: lang === 'tr' ? 'Son sayfa' : 'Last page',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
