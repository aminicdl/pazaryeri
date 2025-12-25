/**
 * Product-related type definitions
 * Based on API structure from api.meshur.co/docs
 */

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: ProductImage[];
  category: import('./category').Category;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  attributes: ProductAttribute[];
  createdAt: string;
  updatedAt: string;
}

/**
 * API Response types for product endpoints
 */
export interface APIProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  currency: string;
  images: Array<{
    id: string;
    url: string;
    alt: string;
    width: number;
    height: number;
  }>;
  category_id: string;
  category_name: string;
  category_slug: string;
  brand: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  attributes: Array<{
    name: string;
    value: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  data: APIProduct[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  search?: string;
}
