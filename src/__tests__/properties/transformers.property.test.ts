/**
 * Property-Based Tests for Data Transformation
 * 
 * **Feature: pazaryeri-frontend, Property 5: Data Transformation Integrity**
 * **Validates: Requirements 6.3**
 * 
 * For any API response data, the transformation functions should produce
 * valid domain objects that conform to the TypeScript interfaces without data loss.
 */

import * as fc from 'fast-check';
import {
  transformAPIProduct,
  transformAPICategory,
  transformAPIProducts,
  transformAPICategories,
} from '@/lib/utils/transformers';
import type { APIProduct } from '@/types/product';
import type { APICategory } from '@/types/category';

// Arbitrary generators for API data structures

const apiProductImageArb = fc.record({
  id: fc.string({ minLength: 1 }),
  url: fc.string({ minLength: 1 }),
  alt: fc.string(),
  width: fc.integer({ min: 1, max: 4000 }),
  height: fc.integer({ min: 1, max: 4000 }),
});

const apiProductAttributeArb = fc.record({
  name: fc.string({ minLength: 1 }),
  value: fc.string(),
});

// Valid ISO date string generator using integer timestamps
const isoDateStringArb = fc.integer({
  min: new Date('2020-01-01T00:00:00Z').getTime(),
  max: new Date('2030-12-31T23:59:59Z').getTime(),
}).map(timestamp => new Date(timestamp).toISOString());

const apiProductArb: fc.Arbitrary<APIProduct> = fc.record({
  id: fc.string({ minLength: 1 }),
  slug: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1 }),
  description: fc.string(),
  price: fc.float({ min: 0, max: 1000000, noNaN: true }),
  original_price: fc.option(fc.float({ min: 0, max: 1000000, noNaN: true }), { nil: null }),
  currency: fc.constantFrom('TRY', 'USD', 'EUR'),
  images: fc.array(apiProductImageArb, { minLength: 0, maxLength: 10 }),
  category_id: fc.string({ minLength: 1 }),
  category_name: fc.string({ minLength: 1 }),
  category_slug: fc.string({ minLength: 1 }),
  brand: fc.string({ minLength: 1 }),
  rating: fc.float({ min: 0, max: 5, noNaN: true }),
  review_count: fc.integer({ min: 0, max: 100000 }),
  in_stock: fc.boolean(),
  attributes: fc.array(apiProductAttributeArb, { minLength: 0, maxLength: 20 }),
  created_at: isoDateStringArb,
  updated_at: isoDateStringArb,
});

const apiCategoryArb: fc.Arbitrary<APICategory> = fc.record({
  id: fc.string({ minLength: 1 }),
  slug: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1 }),
  description: fc.option(fc.string(), { nil: undefined }),
  parent_id: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
  image: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
  product_count: fc.integer({ min: 0, max: 100000 }),
});

describe('Data Transformation Integrity - Property 5', () => {
  describe('transformAPIProduct', () => {
    it('should preserve all required fields without data loss', () => {
      fc.assert(
        fc.property(apiProductArb, (apiProduct) => {
          const product = transformAPIProduct(apiProduct);

          // Core fields must be preserved
          expect(product.id).toBe(apiProduct.id);
          expect(product.slug).toBe(apiProduct.slug);
          expect(product.name).toBe(apiProduct.name);
          expect(product.description).toBe(apiProduct.description);
          expect(product.price).toBe(apiProduct.price);
          expect(product.currency).toBe(apiProduct.currency);
          expect(product.brand).toBe(apiProduct.brand);
          expect(product.rating).toBe(apiProduct.rating);
          expect(product.reviewCount).toBe(apiProduct.review_count);
          expect(product.inStock).toBe(apiProduct.in_stock);
          expect(product.createdAt).toBe(apiProduct.created_at);
          expect(product.updatedAt).toBe(apiProduct.updated_at);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly transform optional original_price field', () => {
      fc.assert(
        fc.property(apiProductArb, (apiProduct) => {
          const product = transformAPIProduct(apiProduct);

          if (apiProduct.original_price === null) {
            expect(product.originalPrice).toBeUndefined();
          } else {
            expect(product.originalPrice).toBe(apiProduct.original_price);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve image array length and content', () => {
      fc.assert(
        fc.property(apiProductArb, (apiProduct) => {
          const product = transformAPIProduct(apiProduct);

          expect(product.images.length).toBe(apiProduct.images.length);

          product.images.forEach((image, index) => {
            const apiImage = apiProduct.images[index];
            expect(image.id).toBe(apiImage.id);
            expect(image.url).toBe(apiImage.url);
            expect(image.alt).toBe(apiImage.alt);
            expect(image.width).toBe(apiImage.width);
            expect(image.height).toBe(apiImage.height);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve attributes array length and content', () => {
      fc.assert(
        fc.property(apiProductArb, (apiProduct) => {
          const product = transformAPIProduct(apiProduct);

          expect(product.attributes.length).toBe(apiProduct.attributes.length);

          product.attributes.forEach((attr, index) => {
            const apiAttr = apiProduct.attributes[index];
            expect(attr.name).toBe(apiAttr.name);
            expect(attr.value).toBe(apiAttr.value);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly construct category from flat fields', () => {
      fc.assert(
        fc.property(apiProductArb, (apiProduct) => {
          const product = transformAPIProduct(apiProduct);

          expect(product.category.id).toBe(apiProduct.category_id);
          expect(product.category.slug).toBe(apiProduct.category_slug);
          expect(product.category.name).toBe(apiProduct.category_name);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('transformAPICategory', () => {
    it('should preserve all required fields without data loss', () => {
      fc.assert(
        fc.property(apiCategoryArb, (apiCategory) => {
          const category = transformAPICategory(apiCategory);

          expect(category.id).toBe(apiCategory.id);
          expect(category.slug).toBe(apiCategory.slug);
          expect(category.name).toBe(apiCategory.name);
          expect(category.productCount).toBe(apiCategory.product_count);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly transform optional fields', () => {
      fc.assert(
        fc.property(apiCategoryArb, (apiCategory) => {
          const category = transformAPICategory(apiCategory);

          if (apiCategory.description === undefined) {
            expect(category.description).toBeUndefined();
          } else {
            expect(category.description).toBe(apiCategory.description);
          }

          if (apiCategory.parent_id === undefined) {
            expect(category.parentId).toBeUndefined();
          } else {
            expect(category.parentId).toBe(apiCategory.parent_id);
          }

          if (apiCategory.image === undefined) {
            expect(category.image).toBeUndefined();
          } else {
            expect(category.image).toBe(apiCategory.image);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('transformAPIProducts (batch)', () => {
    it('should preserve array length when transforming multiple products', () => {
      fc.assert(
        fc.property(fc.array(apiProductArb, { minLength: 0, maxLength: 50 }), (apiProducts) => {
          const products = transformAPIProducts(apiProducts);
          expect(products.length).toBe(apiProducts.length);
        }),
        { numRuns: 100 }
      );
    });

    it('should maintain order when transforming multiple products', () => {
      fc.assert(
        fc.property(fc.array(apiProductArb, { minLength: 1, maxLength: 20 }), (apiProducts) => {
          const products = transformAPIProducts(apiProducts);

          products.forEach((product, index) => {
            expect(product.id).toBe(apiProducts[index].id);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('transformAPICategories (batch)', () => {
    it('should preserve array length when transforming multiple categories', () => {
      fc.assert(
        fc.property(fc.array(apiCategoryArb, { minLength: 0, maxLength: 50 }), (apiCategories) => {
          const categories = transformAPICategories(apiCategories);
          expect(categories.length).toBe(apiCategories.length);
        }),
        { numRuns: 100 }
      );
    });

    it('should maintain order when transforming multiple categories', () => {
      fc.assert(
        fc.property(fc.array(apiCategoryArb, { minLength: 1, maxLength: 20 }), (apiCategories) => {
          const categories = transformAPICategories(apiCategories);

          categories.forEach((category, index) => {
            expect(category.id).toBe(apiCategories[index].id);
          });
        }),
        { numRuns: 100 }
      );
    });
  });
});
