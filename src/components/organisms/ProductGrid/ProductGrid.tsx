'use client';

import React from 'react';
import ProductCard from '@/components/molecules/ProductCard/ProductCard';
import type { Product } from '@/types/product';
import type { Locale } from '@/lib/i18n/config';

export interface ProductGridProps {
  products: Product[];
  lang?: Locale;
  columns?: 2 | 3 | 4;
  loading?: boolean;
  emptyMessage?: string;
  dictionary?: {
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
  };
}

const ProductGridSkeleton: React.FC<{ count: number; columns: number }> = ({
  count,
  columns,
}) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse"
          aria-hidden="true"
        >
          <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
    <p className="text-gray-500 dark:text-gray-400 text-center">{message}</p>
  </div>
);

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  lang = 'tr',
  columns = 4,
  loading = false,
  emptyMessage,
  dictionary = {
    product: {
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
    },
    common: {
      loading: 'Loading...',
      noResults: 'No products found',
    },
  },
}) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (loading) {
    return (
      <div aria-busy="true" aria-label={dictionary.common.loading}>
        <ProductGridSkeleton count={columns * 2} columns={columns} />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState message={emptyMessage || dictionary.common.noResults} />;
  }

  return (
    <div
      className={`grid ${gridCols[columns]} gap-6`}
      role="list"
      aria-label="Product list"
    >
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard
            product={product}
            lang={lang}
            dictionary={dictionary.product}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
