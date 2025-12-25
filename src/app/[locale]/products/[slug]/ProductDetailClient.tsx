'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFavoritesStore, useIsFavorite } from '@/stores/useFavoritesStore';
import OptimizedImage from '@/components/atoms/OptimizedImage/OptimizedImage';
import Button from '@/components/atoms/Button/Button';
import Badge from '@/components/atoms/Badge/Badge';
import type { Product } from '@/types/product';
import type { Locale } from '@/lib/i18n/config';

interface ProductDetailClientProps {
  product: Product;
  lang: Locale;
  dictionary: {
    product: {
      addToFavorites: string;
      removeFromFavorites: string;
      inStock: string;
      outOfStock: string;
      description: string;
      specifications: string;
      reviews: string;
    };
    common: {
      loading: string;
    };
    navigation: {
      products: string;
    };
  };
}

const HeartIcon: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={2}
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

export default function ProductDetailClient({
  product,
  lang,
  dictionary,
}: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isFavorite = useIsFavorite(product.id);
  const { addFavorite, removeFavorite } = useFavoritesStore();

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const selectedImage = product.images[selectedImageIndex] || product.images[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href={`/${lang}`}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {lang === 'tr' ? 'Ana Sayfa' : 'Home'}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href={`/${lang}/products`}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {dictionary.navigation.products}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 dark:text-white font-medium truncate max-w-xs">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              {selectedImage ? (
                <OptimizedImage
                  src={selectedImage.url}
                  alt={selectedImage.alt || product.name}
                  width={selectedImage.width || 800}
                  height={selectedImage.height || 800}
                  className="object-contain w-full h-full"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Discount Badge */}
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
                  -{discountPercentage}%
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <OptimizedImage
                      src={image.url}
                      alt={image.alt || `${product.name} - ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {product.brand}
              </p>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex" aria-label={`Rating: ${product.rating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
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
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({product.reviewCount} {dictionary.product.reviews})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price, product.currency)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(product.originalPrice!, product.currency)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              <Badge variant={product.inStock ? 'success' : 'error'}>
                {product.inStock ? dictionary.product.inStock : dictionary.product.outOfStock}
              </Badge>
            </div>

            {/* Add to Favorites Button */}
            <Button
              variant={isFavorite ? 'secondary' : 'primary'}
              size="lg"
              onClick={handleFavoriteClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              aria-pressed={isFavorite}
            >
              <HeartIcon filled={isFavorite} />
              {isFavorite ? dictionary.product.removeFromFavorites : dictionary.product.addToFavorites}
            </Button>

            {/* Description */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {dictionary.product.description}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.attributes.length > 0 && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {dictionary.product.specifications}
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.attributes.map((attr, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <dt className="text-gray-500 dark:text-gray-400">{attr.name}</dt>
                      <dd className="text-gray-900 dark:text-white font-medium">{attr.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Category */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {lang === 'tr' ? 'Kategori' : 'Category'}:{' '}
                <Link
                  href={`/${lang}/products?category=${product.category.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {product.category.name}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
