/**
 * Property-Based Tests for Favorites State Consistency
 *
 * **Feature: pazaryeri-frontend, Property 1: Favorites State Consistency**
 * **Validates: Requirements 4.2, 4.3, 4.4**
 *
 * For any product and any sequence of add/remove operations, the favorites state
 * should accurately reflect the current set of favorited products.
 */

import * as fc from 'fast-check';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

// Helper to reset store state between tests
const resetStore = () => {
  useFavoritesStore.setState({ favorites: new Map() });
};

// Arbitrary generators for Product data

const categoryArb: fc.Arbitrary<Category> = fc.record({
  id: fc.string({ minLength: 1 }),
  slug: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1 }),
  description: fc.option(fc.string(), { nil: undefined }),
  parentId: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
  image: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
  productCount: fc.integer({ min: 0, max: 100000 }),
});

const productImageArb = fc.record({
  id: fc.string({ minLength: 1 }),
  url: fc.string({ minLength: 1 }),
  alt: fc.string(),
  width: fc.integer({ min: 1, max: 4000 }),
  height: fc.integer({ min: 1, max: 4000 }),
});

const productAttributeArb = fc.record({
  name: fc.string({ minLength: 1 }),
  value: fc.string(),
});

const isoDateStringArb = fc
  .integer({
    min: new Date('2020-01-01T00:00:00Z').getTime(),
    max: new Date('2030-12-31T23:59:59Z').getTime(),
  })
  .map((timestamp) => new Date(timestamp).toISOString());

const productArb: fc.Arbitrary<Product> = fc.record({
  id: fc.string({ minLength: 1 }),
  slug: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1 }),
  description: fc.string(),
  price: fc.float({ min: 0, max: 1000000, noNaN: true }),
  originalPrice: fc.option(fc.float({ min: 0, max: 1000000, noNaN: true }), {
    nil: undefined,
  }),
  currency: fc.constantFrom('TRY', 'USD', 'EUR'),
  images: fc.array(productImageArb, { minLength: 0, maxLength: 5 }),
  category: categoryArb,
  brand: fc.string({ minLength: 1 }),
  rating: fc.float({ min: 0, max: 5, noNaN: true }),
  reviewCount: fc.integer({ min: 0, max: 100000 }),
  inStock: fc.boolean(),
  attributes: fc.array(productAttributeArb, { minLength: 0, maxLength: 10 }),
  createdAt: isoDateStringArb,
  updatedAt: isoDateStringArb,
});

// Generate products with unique IDs
const uniqueProductsArb = (count: number): fc.Arbitrary<Product[]> =>
  fc
    .array(productArb, { minLength: count, maxLength: count })
    .map((products) =>
      products.map((p, i) => ({ ...p, id: `product-${i}-${p.id}` }))
    );

describe('Favorites State Consistency - Property 1', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('addFavorite operation', () => {
    it('should add product to favorites and be retrievable via isFavorite', () => {
      fc.assert(
        fc.property(productArb, (product) => {
          resetStore();
          const store = useFavoritesStore.getState();

          // Initially not a favorite
          expect(store.isFavorite(product.id)).toBe(false);

          // Add to favorites
          store.addFavorite(product);

          // Now should be a favorite
          const updatedStore = useFavoritesStore.getState();
          expect(updatedStore.isFavorite(product.id)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should increase favorites count by 1 when adding a new product', () => {
      fc.assert(
        fc.property(productArb, (product) => {
          resetStore();
          const store = useFavoritesStore.getState();

          const countBefore = store.getFavoritesCount();
          store.addFavorite(product);

          const updatedStore = useFavoritesStore.getState();
          expect(updatedStore.getFavoritesCount()).toBe(countBefore + 1);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve product data when added to favorites', () => {
      fc.assert(
        fc.property(productArb, (product) => {
          resetStore();
          const store = useFavoritesStore.getState();

          store.addFavorite(product);

          const updatedStore = useFavoritesStore.getState();
          const storedProduct = updatedStore.favorites.get(product.id);

          expect(storedProduct).toEqual(product);
        }),
        { numRuns: 100 }
      );
    });

    it('should be idempotent - adding same product twice should not duplicate', () => {
      fc.assert(
        fc.property(productArb, (product) => {
          resetStore();
          const store = useFavoritesStore.getState();

          store.addFavorite(product);
          const countAfterFirst = useFavoritesStore.getState().getFavoritesCount();

          store.addFavorite(product);
          const countAfterSecond = useFavoritesStore.getState().getFavoritesCount();

          expect(countAfterSecond).toBe(countAfterFirst);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('removeFavorite operation', () => {
    it('should remove product from favorites', () => {
      fc.assert(
        fc.property(productArb, (product) => {
          resetStore();
          const store = useFavoritesStore.getState();

          // Add then remove
          store.addFavorite(product);
          expect(useFavoritesStore.getState().isFavorite(product.id)).toBe(true);

          store.removeFavorite(product.id);
          expect(useFavoritesStore.getState().isFavorite(product.id)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should decrease favorites count by 1 when removing an existing product', () => {
      fc.assert(
        fc.property(productArb, (product) => {
          resetStore();
          const store = useFavoritesStore.getState();

          store.addFavorite(product);
          const countBefore = useFavoritesStore.getState().getFavoritesCount();

          store.removeFavorite(product.id);
          const countAfter = useFavoritesStore.getState().getFavoritesCount();

          expect(countAfter).toBe(countBefore - 1);
        }),
        { numRuns: 100 }
      );
    });

    it('should be safe to remove non-existent product', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (productId) => {
          resetStore();
          const store = useFavoritesStore.getState();

          const countBefore = store.getFavoritesCount();

          // Should not throw
          store.removeFavorite(productId);

          const countAfter = useFavoritesStore.getState().getFavoritesCount();
          expect(countAfter).toBe(countBefore);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('add/remove sequence consistency', () => {
    it('should maintain consistency after add-remove-add sequence', () => {
      fc.assert(
        fc.property(productArb, (product) => {
          resetStore();
          const store = useFavoritesStore.getState();

          // Add
          store.addFavorite(product);
          expect(useFavoritesStore.getState().isFavorite(product.id)).toBe(true);

          // Remove
          store.removeFavorite(product.id);
          expect(useFavoritesStore.getState().isFavorite(product.id)).toBe(false);

          // Add again
          store.addFavorite(product);
          expect(useFavoritesStore.getState().isFavorite(product.id)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly track multiple products independently', () => {
      fc.assert(
        fc.property(uniqueProductsArb(5), (products) => {
          resetStore();
          const store = useFavoritesStore.getState();

          // Add all products
          products.forEach((p) => store.addFavorite(p));

          // All should be favorites
          products.forEach((p) => {
            expect(useFavoritesStore.getState().isFavorite(p.id)).toBe(true);
          });

          // Remove first product
          store.removeFavorite(products[0].id);

          // First should not be favorite, rest should be
          expect(useFavoritesStore.getState().isFavorite(products[0].id)).toBe(false);
          products.slice(1).forEach((p) => {
            expect(useFavoritesStore.getState().isFavorite(p.id)).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('clearFavorites operation', () => {
    it('should remove all favorites', () => {
      fc.assert(
        fc.property(uniqueProductsArb(3), (products) => {
          resetStore();
          const store = useFavoritesStore.getState();

          // Add multiple products
          products.forEach((p) => store.addFavorite(p));
          expect(useFavoritesStore.getState().getFavoritesCount()).toBe(products.length);

          // Clear all
          store.clearFavorites();

          // All should be removed
          expect(useFavoritesStore.getState().getFavoritesCount()).toBe(0);
          products.forEach((p) => {
            expect(useFavoritesStore.getState().isFavorite(p.id)).toBe(false);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('getFavoritesArray consistency', () => {
    it('should return array with same length as favorites count', () => {
      fc.assert(
        fc.property(uniqueProductsArb(5), (products) => {
          resetStore();
          const store = useFavoritesStore.getState();

          products.forEach((p) => store.addFavorite(p));

          const updatedStore = useFavoritesStore.getState();
          const array = updatedStore.getFavoritesArray();
          const count = updatedStore.getFavoritesCount();

          expect(array.length).toBe(count);
        }),
        { numRuns: 100 }
      );
    });

    it('should contain all favorited products', () => {
      fc.assert(
        fc.property(uniqueProductsArb(5), (products) => {
          resetStore();
          const store = useFavoritesStore.getState();

          products.forEach((p) => store.addFavorite(p));

          const updatedStore = useFavoritesStore.getState();
          const array = updatedStore.getFavoritesArray();
          const arrayIds = array.map((p) => p.id);

          products.forEach((p) => {
            expect(arrayIds).toContain(p.id);
          });
        }),
        { numRuns: 100 }
      );
    });
  });
});
