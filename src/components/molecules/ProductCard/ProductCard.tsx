'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useFavoritesStore, useIsFavorite } from '@/stores/useFavoritesStore';
import OptimizedImage from '@/components/atoms/OptimizedImage/OptimizedImage';
import Button from '@/components/atoms/Button/Button';

export interface ProductCardProps {
  product: Product;
  lang?: string;
  dictionary?: {
    addToFavorites: string;
    removeFromFavorites: string;
    inStock: string;
    outOfStock: string;
  };
}

const HeartIcon: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang = 'tr',
  dictionary = {
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
  },
}) => {
  const isFavorite = useIsFavorite(product.id);
  const { addFavorite, removeFavorite } = useFavoritesStore();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const primaryImage = product.images[0];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <article className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link
        href={`/${lang}/products/${product.slug}`}
        className="flex flex-col h-full"
        aria-label={product.name}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          {primaryImage ? (
            <OptimizedImage
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              width={primaryImage.width || 300}
              height={primaryImage.height || 300}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}

          {/* Stock Status */}
          {!product.inStock && (
            <span className="absolute bottom-2 left-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded">
              {dictionary.outOfStock}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-4">
          {/* Brand */}
          {product.brand && (
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {product.brand}
            </span>
          )}

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex" aria-label={`Rating: ${product.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= product.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-auto flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(product.price, product.currency)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(product.originalPrice!, product.currency)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleFavoriteClick}
        className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 ${
          isFavorite ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
        }`}
        aria-label={isFavorite ? dictionary.removeFromFavorites : dictionary.addToFavorites}
        aria-pressed={isFavorite}
      >
        <HeartIcon filled={isFavorite} />
      </Button>
    </article>
  );
};

export default ProductCard;
