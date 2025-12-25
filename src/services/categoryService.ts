/**
 * Category Service
 * Handles all category-related data fetching operations
 * Requirements: 6.2, 6.3
 */

import type { Category, CategoriesResponse, APICategory, CategoryTree } from '@/types/category';
import { transformAPICategory, transformAPICategories } from '@/lib/utils/transformers';
import { apiGet, handleAPIError } from './api';

// Import mock data for development/fallback
import mockCategoriesData from '@/data/mock/categories.json';

/**
 * Configuration for using mock data vs real API
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || true;

/**
 * Fetches all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK_DATA) {
    return getMockCategories();
  }

  try {
    const response = await apiGet<CategoriesResponse>('/categories');
    return transformAPICategories(response.data);
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error('Failed to fetch categories:', apiError);
    // Fallback to mock data on error
    return getMockCategories();
  }
}

/**
 * Fetches a single category by its slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (USE_MOCK_DATA) {
    return getMockCategoryBySlug(slug);
  }

  try {
    const response = await apiGet<{ data: APICategory }>(`/categories/${slug}`);
    return transformAPICategory(response.data);
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error(`Failed to fetch category with slug "${slug}":`, apiError);
    // Fallback to mock data on error
    return getMockCategoryBySlug(slug);
  }
}

/**
 * Fetches a single category by its ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  if (USE_MOCK_DATA) {
    return getMockCategoryById(id);
  }

  try {
    const response = await apiGet<{ data: APICategory }>(`/categories/id/${id}`);
    return transformAPICategory(response.data);
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error(`Failed to fetch category with id "${id}":`, apiError);
    // Fallback to mock data on error
    return getMockCategoryById(id);
  }
}

/**
 * Fetches root categories (categories without a parent)
 */
export async function getRootCategories(): Promise<Category[]> {
  if (USE_MOCK_DATA) {
    return getMockRootCategories();
  }

  try {
    const response = await apiGet<CategoriesResponse>('/categories?root=true');
    return transformAPICategories(response.data);
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error('Failed to fetch root categories:', apiError);
    return getMockRootCategories();
  }
}

/**
 * Fetches child categories for a given parent category ID
 */
export async function getChildCategories(parentId: string): Promise<Category[]> {
  if (USE_MOCK_DATA) {
    return getMockChildCategories(parentId);
  }

  try {
    const response = await apiGet<CategoriesResponse>(`/categories?parent_id=${parentId}`);
    return transformAPICategories(response.data);
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error(`Failed to fetch child categories for parent "${parentId}":`, apiError);
    return getMockChildCategories(parentId);
  }
}

/**
 * Builds a category tree structure from flat categories
 */
export function buildCategoryTree(categories: Category[]): CategoryTree[] {
  const categoryMap = new Map<string, CategoryTree>();
  const roots: CategoryTree[] = [];

  // First pass: create CategoryTree objects
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Second pass: build tree structure
  categories.forEach(category => {
    const treeNode = categoryMap.get(category.id)!;
    
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children.push(treeNode);
      } else {
        // Parent not found, treat as root
        roots.push(treeNode);
      }
    } else {
      roots.push(treeNode);
    }
  });

  return roots;
}

/**
 * Gets the category tree structure
 */
export async function getCategoryTree(): Promise<CategoryTree[]> {
  const categories = await getCategories();
  return buildCategoryTree(categories);
}

// ============================================
// Mock Data Functions
// ============================================

/**
 * Gets all categories from mock data
 */
function getMockCategories(): Category[] {
  return transformAPICategories(mockCategoriesData.data as APICategory[]);
}

/**
 * Gets a single category by slug from mock data
 */
function getMockCategoryBySlug(slug: string): Category | null {
  const apiCategory = (mockCategoriesData.data as APICategory[]).find(c => c.slug === slug);
  return apiCategory ? transformAPICategory(apiCategory) : null;
}

/**
 * Gets a single category by ID from mock data
 */
function getMockCategoryById(id: string): Category | null {
  const apiCategory = (mockCategoriesData.data as APICategory[]).find(c => c.id === id);
  return apiCategory ? transformAPICategory(apiCategory) : null;
}

/**
 * Gets root categories from mock data
 */
function getMockRootCategories(): Category[] {
  const rootCategories = (mockCategoriesData.data as APICategory[]).filter(
    c => !c.parent_id
  );
  return transformAPICategories(rootCategories);
}

/**
 * Gets child categories for a parent from mock data
 */
function getMockChildCategories(parentId: string): Category[] {
  const childCategories = (mockCategoriesData.data as APICategory[]).filter(
    c => c.parent_id === parentId
  );
  return transformAPICategories(childCategories);
}
