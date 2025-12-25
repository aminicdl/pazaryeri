'use client';

import Link from 'next/link';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid';
import Button from '@/components/atoms/Button/Button';
import type { Locale } from '@/lib/i18n/config';

interface FavoritesPageClientProps {
  lang: Locale;
  dictionary: {
    favorites: {
      title: string;
      empty: string;
      emptyDescription: string;
      browseProducts: string;
      itemCount: string;
    };
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
    navigation: {
      products: string;
    };
  };
}

const HeartIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-16 h-16"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

export default function FavoritesPageClient({ lang, dictionary }: FavoritesPageClientProps) {
  const favorites = useFavoritesStore((state) => state.getFavoritesArray());
  const favoritesCount = useFavoritesStore((state) => state.getFavoritesCount());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {dictionary.favorites.title}
          </h1>
          {favoritesCount > 0 && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {favoritesCount} {dictionary.favorites.itemCount}
            </p>
          )}
        </div>

        {/* Content */}
        {favoritesCount === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-gray-300 dark:text-gray-600 mb-6">
              <HeartIcon />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {dictionary.favorites.empty}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              {dictionary.favorites.emptyDescription}
            </p>
            <Link href={`/${lang}/products`}>
              <Button variant="primary" size="lg">
                {dictionary.favorites.browseProducts}
              </Button>
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <ProductGrid
            products={favorites}
            lang={lang}
            columns={4}
            dictionary={{
              product: dictionary.product,
              common: dictionary.common,
            }}
          />
        )}
      </div>
    </div>
  );
}
