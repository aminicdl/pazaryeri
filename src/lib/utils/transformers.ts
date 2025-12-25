/**
 * Data transformation utilities
 * Transforms API response data to domain objects
 * Requirements: 6.3
 */

import type { Product, ProductImage, ProductAttribute, APIProduct } from '@/types/product';
import type { Category, APICategory } from '@/types/category';
import type { NormalizedState } from '@/types/common';

/**
 * Transforms an API product response to a domain Product object
 */
export function transformAPIProduct(apiProduct: APIProduct): Product {
  return {
    id: apiProduct.id,
    slug: apiProduct.slug,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    originalPrice: apiProduct.original_price ?? undefined,
    currency: apiProduct.currency,
    images: apiProduct.images.map(transformProductImage),
    category: {
      id: apiProduct.category_id,
      slug: apiProduct.category_slug,
      name: apiProduct.category_name,
      productCount: 0,
    },
    brand: apiProduct.brand,
    rating: apiProduct.rating,
    reviewCount: apiProduct.review_count,
    inStock: apiProduct.in_stock,
    attributes: apiProduct.attributes.map(transformProductAttribute),
    createdAt: apiProduct.created_at,
    updatedAt: apiProduct.updated_at,
  };
}

/**
 * Transforms a product image from API format
 */
function transformProductImage(image: APIProduct['images'][0]): ProductImage {
  return {
    id: image.id,
    url: image.url,
    alt: image.alt,
    width: image.width,
    height: image.height,
  };
}

/**
 * Transforms a product attribute from API format
 */
function transformProductAttribute(attr: APIProduct['attributes'][0]): ProductAttribute {
  return {
    name: attr.name,
    value: attr.value,
  };
}

/**
 * Transforms an API category response to a domain Category object
 */
export function transformAPICategory(apiCategory: APICategory): Category {
  return {
    id: apiCategory.id,
    slug: apiCategory.slug,
    name: apiCategory.name,
    description: apiCategory.description ?? undefined,
    parentId: apiCategory.parent_id ?? undefined,
    image: apiCategory.image ?? undefined,
    productCount: apiCategory.product_count,
  };
}

/**
 * Transforms an array of API products
 */
export function transformAPIProducts(apiProducts: APIProduct[]): Product[] {
  return apiProducts.map(transformAPIProduct);
}

/**
 * Transforms an array of API categories
 */
export function transformAPICategories(apiCategories: APICategory[]): Category[] {
  return apiCategories.map(transformAPICategory);
}

// ============================================
// Normalization Utilities
// ============================================

/**
 * Normalizes an array of products into a normalized state structure
 */
export function normalizeProducts(products: Product[]): NormalizedState<Product> {
  const byId: Record<string, Product> = {};
  const allIds: string[] = [];

  products.forEach(product => {
    byId[product.id] = product;
    allIds.push(product.id);
  });

  return { byId, allIds };
}

/**
 * Normalizes an array of categories into a normalized state structure
 */
export function normalizeCategories(categories: Category[]): NormalizedState<Category> {
  const byId: Record<string, Category> = {};
  const allIds: string[] = [];

  categories.forEach(category => {
    byId[category.id] = category;
    allIds.push(category.id);
  });

  return { byId, allIds };
}

/**
 * Denormalizes a normalized state back to an array
 */
export function denormalize<T>(normalizedState: NormalizedState<T>): T[] {
  return normalizedState.allIds.map(id => normalizedState.byId[id]);
}

// ============================================
// Formatting Utilities
// ============================================

/**
 * Formats a price with currency symbol
 */
export function formatPrice(price: number, currency: string = 'TRY'): string {
  const formatter = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(price);
}

/**
 * Calculates discount percentage
 */
export function calculateDiscountPercentage(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) {
    return null;
  }
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Formats a date string to localized format
 */
export function formatDate(dateString: string, locale: string = 'tr-TR'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generates a product URL path
 */
export function getProductUrl(slug: string, lang: string = 'tr'): string {
  return `/${lang}/products/${slug}`;
}

/**
 * Generates a category URL path
 */
export function getCategoryUrl(slug: string, lang: string = 'tr'): string {
  return `/${lang}/products?category=${slug}`;
}
