/**
 * Product Service
 * Handles all product-related data fetching operations
 * Requirements: 6.2, 6.3
 */

import type { Product, ProductFilters, ProductsResponse, APIProduct, PaginationMeta } from '@/types/product';
import { transformAPIProduct, transformAPIProducts } from '@/lib/utils/transformers';
import { apiGet, buildQueryString, handleAPIError } from './api';

// Import mock data for development/fallback
import mockProductsData from '@/data/mock/products.json';

/**
 * Configuration for using mock data vs real API
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || true;

/**
 * Response type for paginated products
 */
export interface ProductsResult {
  products: Product[];
  meta: PaginationMeta;
}

/**
 * Fetches products with optional filters and pagination
 */
export async function getProducts(
  filters?: ProductFilters,
  page: number = 1,
  perPage: number = 10
): Promise<ProductsResult> {
  if (USE_MOCK_DATA) {
    return getMockProducts(filters, page, perPage);
  }

  try {
    const queryParams = buildQueryString({
      page,
      per_page: perPage,
      category_id: filters?.categoryId,
      min_price: filters?.minPrice,
      max_price: filters?.maxPrice,
      brand: filters?.brand,
      in_stock: filters?.inStock,
      sort_by: filters?.sortBy,
      search: filters?.search,
    });

    const response = await apiGet<ProductsResponse>(`/products${queryParams}`);
    
    return {
      products: transformAPIProducts(response.data),
      meta: response.meta,
    };
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error('Failed to fetch products:', apiError);
    // Fallback to mock data on error
    return getMockProducts(filters, page, perPage);
  }
}

/**
 * Fetches a single product by its slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (USE_MOCK_DATA) {
    return getMockProductBySlug(slug);
  }

  try {
    const response = await apiGet<{ data: APIProduct }>(`/products/${slug}`);
    return transformAPIProduct(response.data);
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error(`Failed to fetch product with slug "${slug}":`, apiError);
    // Fallback to mock data on error
    return getMockProductBySlug(slug);
  }
}

/**
 * Fetches a single product by its ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (USE_MOCK_DATA) {
    return getMockProductById(id);
  }

  try {
    const response = await apiGet<{ data: APIProduct }>(`/products/id/${id}`);
    return transformAPIProduct(response.data);
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error(`Failed to fetch product with id "${id}":`, apiError);
    // Fallback to mock data on error
    return getMockProductById(id);
  }
}

/**
 * Fetches featured products for the home page
 */
export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    return getMockFeaturedProducts(limit);
  }

  try {
    const queryParams = buildQueryString({
      featured: true,
      per_page: limit,
    });

    const response = await apiGet<ProductsResponse>(`/products${queryParams}`);
    return transformAPIProducts(response.data);
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error('Failed to fetch featured products:', apiError);
    return getMockFeaturedProducts(limit);
  }
}

// ============================================
// Mock Data Functions
// ============================================

/**
 * Gets products from mock data with filtering and pagination
 */
function getMockProducts(
  filters?: ProductFilters,
  page: number = 1,
  perPage: number = 10
): ProductsResult {
  let filteredProducts = [...mockProductsData.data] as APIProduct[];

  // Apply filters
  if (filters) {
    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.category_id === filters.categoryId);
    }
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(
        p => p.brand.toLowerCase() === filters.brand!.toLowerCase()
      );
    }
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.in_stock === filters.inStock);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredProducts.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          break;
      }
    }
  }

  // Apply pagination
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage);

  return {
    products: transformAPIProducts(paginatedProducts),
    meta: {
      total,
      page,
      perPage,
      totalPages,
    },
  };
}

/**
 * Gets a single product by slug from mock data
 */
function getMockProductBySlug(slug: string): Product | null {
  const apiProduct = (mockProductsData.data as APIProduct[]).find(p => p.slug === slug);
  return apiProduct ? transformAPIProduct(apiProduct) : null;
}

/**
 * Gets a single product by ID from mock data
 */
function getMockProductById(id: string): Product | null {
  const apiProduct = (mockProductsData.data as APIProduct[]).find(p => p.id === id);
  return apiProduct ? transformAPIProduct(apiProduct) : null;
}

/**
 * Gets featured products from mock data
 */
function getMockFeaturedProducts(limit: number): Product[] {
  // For mock data, return products sorted by rating as "featured"
  const sortedProducts = [...mockProductsData.data].sort(
    (a, b) => b.rating - a.rating
  ) as APIProduct[];
  return transformAPIProducts(sortedProducts.slice(0, limit));
}
