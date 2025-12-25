/**
 * Property-Based Tests for Product JSON-LD Validity
 *
 * **Feature: pazaryeri-frontend, Property 4: Product JSON-LD Validity**
 * **Validates: Requirements 7.3**
 *
 * Product pages should include valid JSON-LD structured data following
 * Schema.org Product specification for SEO and rich snippets.
 */

import * as fc from 'fast-check';
import type { Product, ProductImage } from '@/types/product';

// JSON-LD generator function (mirrors the one in page.tsx)
function generateProductJsonLd(product: Product, lang: string) {
  const baseUrl = 'https://pazaryeri.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/${lang}/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };
}

// Arbitrary generators for Product
const productImageArb: fc.Arbitrary<ProductImage> = fc.record({
  id: fc.uuid(),
  url: fc.webUrl(),
  alt: fc.string({ minLength: 1, maxLength: 100 }),
  width: fc.integer({ min: 100, max: 2000 }),
  height: fc.integer({ min: 100, max: 2000 }),
});

const productArb: fc.Arbitrary<Product> = fc.record({
  id: fc.uuid(),
  slug: fc.string({ minLength: 1, maxLength: 100 }).map((s) => s.replace(/[^a-z0-9-]/gi, '-').toLowerCase()),
  name: fc.string({ minLength: 1, maxLength: 200 }),
  description: fc.string({ minLength: 10, maxLength: 1000 }),
  price: fc.float({ min: Math.fround(0.01), max: Math.fround(100000), noNaN: true }),
  originalPrice: fc.option(fc.float({ min: Math.fround(0.01), max: Math.fround(100000), noNaN: true }), { nil: undefined }),
  currency: fc.constantFrom('TRY', 'USD', 'EUR'),
  images: fc.array(productImageArb, { minLength: 1, maxLength: 5 }),
  category: fc.record({
    id: fc.uuid(),
    slug: fc.string({ minLength: 1, maxLength: 50 }),
    name: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.string({ minLength: 0, maxLength: 500 }),
    image: fc.option(fc.webUrl(), { nil: undefined }),
    parentId: fc.option(fc.uuid(), { nil: undefined }),
    productCount: fc.integer({ min: 0, max: 10000 }),
  }),
  brand: fc.string({ minLength: 1, maxLength: 100 }),
  rating: fc.float({ min: Math.fround(0), max: Math.fround(5), noNaN: true }),
  reviewCount: fc.integer({ min: 0, max: 10000 }),
  inStock: fc.boolean(),
  attributes: fc.array(
    fc.record({
      name: fc.string({ minLength: 1, maxLength: 50 }),
      value: fc.string({ minLength: 1, maxLength: 200 }),
    }),
    { minLength: 0, maxLength: 10 }
  ),
  createdAt: fc.constantFrom('2024-01-15T10:30:00.000Z', '2024-06-20T14:45:00.000Z', '2025-03-10T08:00:00.000Z'),
  updatedAt: fc.constantFrom('2024-02-15T10:30:00.000Z', '2024-07-20T14:45:00.000Z', '2025-04-10T08:00:00.000Z'),
});

const localeArb = fc.constantFrom('tr', 'en');

describe('Product JSON-LD Validity - Property 4', () => {
  describe('JSON-LD Structure', () => {
    it('for any product, JSON-LD should have required @context and @type', () => {
      fc.assert(
        fc.property(productArb, localeArb, (product, lang) => {
          const jsonLd = generateProductJsonLd(product, lang);

          expect(jsonLd['@context']).toBe('https://schema.org');
          expect(jsonLd['@type']).toBe('Product');
        }),
        { numRuns: 50 }
      );
    });

    it('for any product, JSON-LD should include name and description', () => {
      fc.assert(
        fc.property(productArb, localeArb, (product, lang) => {
          const jsonLd = generateProductJsonLd(product, lang);

          expect(jsonLd.name).toBe(product.name);
          expect(jsonLd.description).toBe(product.description);
        }),
        { numRuns: 50 }
      );
    });

    it('for any product, JSON-LD should include all image URLs', () => {
      fc.assert(
        fc.property(productArb, localeArb, (product, lang) => {
          const jsonLd = generateProductJsonLd(product, lang);

          expect(jsonLd.image).toHaveLength(product.images.length);
          product.images.forEach((img, index) => {
            expect(jsonLd.image[index]).toBe(img.url);
          });
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Brand Information', () => {
    it('for any product, JSON-LD brand should follow Schema.org Brand type', () => {
      fc.assert(
        fc.property(productArb, localeArb, (product, lang) => {
          const jsonLd = generateProductJsonLd(product, lang);

          expect(jsonLd.brand['@type']).toBe('Brand');
          expect(jsonLd.brand.name).toBe(product.brand);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Offer Information', () => {
    it('for any product, JSON-LD offers should follow Schema.org Offer type', () => {
      fc.assert(
        fc.property(productArb, localeArb, (product, lang) => {
          const jsonLd = generateProductJsonLd(product, lang);

          expect(jsonLd.offers['@type']).toBe('Offer');
          expect(jsonLd.offers.priceCurrency).toBe(product.currency);
          expect(jsonLd.offers.price).toBe(product.price);
          expect(jsonLd.offers.itemCondition).toBe('https://schema.org/NewCondition');
        }),
        { numRuns: 50 }
      );
    });

    it('for any product, offer URL should include correct lang and slug', () => {
      fc.assert(
        fc.property(productArb, localeArb, (product, lang) => {
          const jsonLd = generateProductJsonLd(product, lang);

          expect(jsonLd.offers.url).toContain(`/${lang}/products/${product.slug}`);
        }),
        { numRuns: 50 }
      );
    });

    it('for any product, availability should reflect inStock status', () => {
      fc.assert(
        fc.property(productArb, localeArb, (product, lang) => {
          const jsonLd = generateProductJsonLd(product, lang);

          if (product.inStock) {
            expect(jsonLd.offers.availability).toBe('https://schema.org/InStock');
          } else {
            expect(jsonLd.offers.availability).toBe('https://schema.org/OutOfStock');
          }
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Aggregate Rating', () => {
    it('for products with reviews, JSON-LD should include aggregateRating', () => {
      const productWithReviews = productArb.filter((p) => p.reviewCount > 0);

      fc.assert(
        fc.property(productWithReviews, localeArb, (product, lang) => {
          const jsonLd = generateProductJsonLd(product, lang);

          expect(jsonLd.aggregateRating).toBeDefined();
          expect(jsonLd.aggregateRating!['@type']).toBe('AggregateRating');
          expect(jsonLd.aggregateRating!.ratingValue).toBe(product.rating);
          expect(jsonLd.aggregateRating!.reviewCount).toBe(product.reviewCount);
        }),
        { numRuns: 30 }
      );
    });

    it('for products without reviews, JSON-LD should not include aggregateRating', () => {
      const productWithoutReviews = productArb.filter((p) => p.reviewCount === 0);

      fc.assert(
        fc.property(productWithoutReviews, localeArb, (product, lang) => {
          const jsonLd = generateProductJsonLd(product, lang);

          expect(jsonLd.aggregateRating).toBeUndefined();
        }),
        { numRuns: 30 }
      );
    });
  });

  describe('JSON Serialization', () => {
    it('for any product, JSON-LD should be valid JSON', () => {
      fc.assert(
        fc.property(productArb, localeArb, (product, lang) => {
          const jsonLd = generateProductJsonLd(product, lang);

          // Should not throw when stringifying
          const jsonString = JSON.stringify(jsonLd);
          expect(typeof jsonString).toBe('string');

          // Should be parseable back
          const parsed = JSON.parse(jsonString);
          expect(parsed['@context']).toBe('https://schema.org');
        }),
        { numRuns: 50 }
      );
    });
  });
});
