/**
 * Category-related type definitions
 * Based on API structure from api.meshur.co/docs
 */

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  parentId?: string;
  image?: string;
  productCount: number;
}

/**
 * API Response types for category endpoints
 */
export interface APICategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  parent_id?: string;
  image?: string;
  product_count: number;
}

export interface CategoriesResponse {
  data: APICategory[];
  meta: {
    total: number;
  };
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}
