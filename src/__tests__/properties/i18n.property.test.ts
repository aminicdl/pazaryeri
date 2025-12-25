/**
 * Property-Based Tests for i18n Text Coverage
 *
 * **Feature: pazaryeri-frontend, Property 2: i18n Text Coverage**
 * **Validates: Requirements 2.4, 2.5**
 *
 * For any UI text rendered in the application, it should originate from the
 * centralized dictionary files and not be hardcoded. When language changes,
 * all visible text should update to the new language.
 */

import * as fc from 'fast-check';
import trDictionary from '@/lib/i18n/dictionaries/tr.json';
import enDictionary from '@/lib/i18n/dictionaries/en.json';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/getDictionary';

// Helper to get all leaf keys from a nested object
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];

  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

// Helper to get value by dot-notation key
function getValueByKey(obj: Record<string, unknown>, key: string): unknown {
  const parts = key.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

describe('i18n Text Coverage - Property 2', () => {
  const trKeys = getAllKeys(trDictionary as Record<string, unknown>);
  const enKeys = getAllKeys(enDictionary as Record<string, unknown>);

  describe('Dictionary Structure Consistency', () => {
    it('should have identical key structure in both TR and EN dictionaries', () => {
      // All TR keys should exist in EN
      for (const key of trKeys) {
        const enValue = getValueByKey(enDictionary as Record<string, unknown>, key);
        expect(enValue).toBeDefined();
      }

      // All EN keys should exist in TR
      for (const key of enKeys) {
        const trValue = getValueByKey(trDictionary as Record<string, unknown>, key);
        expect(trValue).toBeDefined();
      }

      // Key counts should match
      expect(trKeys.length).toBe(enKeys.length);
    });

    it('should have the same key set in both dictionaries', () => {
      const trKeySet = new Set(trKeys);
      const enKeySet = new Set(enKeys);

      // Check for keys in TR but not in EN
      const missingInEn = trKeys.filter((key) => !enKeySet.has(key));
      expect(missingInEn).toEqual([]);

      // Check for keys in EN but not in TR
      const missingInTr = enKeys.filter((key) => !trKeySet.has(key));
      expect(missingInTr).toEqual([]);
    });
  });

  describe('Dictionary Value Validity', () => {
    it('for any key in TR dictionary, the value should be a non-empty string', () => {
      fc.assert(
        fc.property(fc.constantFrom(...trKeys), (key) => {
          const value = getValueByKey(trDictionary as Record<string, unknown>, key);
          expect(typeof value).toBe('string');
          expect((value as string).length).toBeGreaterThan(0);
        }),
        { numRuns: Math.min(100, trKeys.length) }
      );
    });

    it('for any key in EN dictionary, the value should be a non-empty string', () => {
      fc.assert(
        fc.property(fc.constantFrom(...enKeys), (key) => {
          const value = getValueByKey(enDictionary as Record<string, unknown>, key);
          expect(typeof value).toBe('string');
          expect((value as string).length).toBeGreaterThan(0);
        }),
        { numRuns: Math.min(100, enKeys.length) }
      );
    });
  });

  describe('Language Differentiation', () => {
    it('for any key, TR and EN values should be different (language-specific)', () => {
      // Most keys should have different values between languages
      // Some exceptions like brand names or technical terms might be the same
      const differentCount = trKeys.filter((key) => {
        const trValue = getValueByKey(trDictionary as Record<string, unknown>, key);
        const enValue = getValueByKey(enDictionary as Record<string, unknown>, key);
        return trValue !== enValue;
      }).length;

      // At least 80% of keys should have different translations
      const differenceRatio = differentCount / trKeys.length;
      expect(differenceRatio).toBeGreaterThan(0.8);
    });
  });

  describe('getDictionary Function', () => {
    it('for any supported locale, getDictionary should return a valid dictionary', async () => {
      for (const locale of locales) {
        const dictionary = await getDictionary(locale);

        // Should have all required top-level sections
        expect(dictionary.common).toBeDefined();
        expect(dictionary.navigation).toBeDefined();
        expect(dictionary.product).toBeDefined();
        expect(dictionary.favorites).toBeDefined();
        expect(dictionary.filters).toBeDefined();
        expect(dictionary.pagination).toBeDefined();
        expect(dictionary.theme).toBeDefined();
        expect(dictionary.errors).toBeDefined();
        expect(dictionary.meta).toBeDefined();
      }
    });

    it('for any locale, dictionary should have consistent structure with type definition', async () => {
      fc.assert(
        await fc.asyncProperty(fc.constantFrom(...locales), async (locale: Locale) => {
          const dictionary = await getDictionary(locale);

          // Verify common section
          expect(typeof dictionary.common.loading).toBe('string');
          expect(typeof dictionary.common.error).toBe('string');
          expect(typeof dictionary.common.retry).toBe('string');
          expect(typeof dictionary.common.search).toBe('string');
          expect(typeof dictionary.common.noResults).toBe('string');

          // Verify navigation section
          expect(typeof dictionary.navigation.home).toBe('string');
          expect(typeof dictionary.navigation.products).toBe('string');
          expect(typeof dictionary.navigation.favorites).toBe('string');
          expect(typeof dictionary.navigation.categories).toBe('string');

          // Verify product section
          expect(typeof dictionary.product.addToFavorites).toBe('string');
          expect(typeof dictionary.product.removeFromFavorites).toBe('string');
          expect(typeof dictionary.product.inStock).toBe('string');
          expect(typeof dictionary.product.outOfStock).toBe('string');

          // Verify meta section
          expect(typeof dictionary.meta.siteTitle).toBe('string');
          expect(typeof dictionary.meta.siteDescription).toBe('string');
        }),
        { numRuns: locales.length }
      );
    });
  });

  describe('Required UI Text Coverage', () => {
    const requiredSections = [
      'common',
      'navigation',
      'product',
      'favorites',
      'filters',
      'pagination',
      'theme',
      'errors',
      'meta',
    ];

    it('for any required section, both dictionaries should have it defined', () => {
      fc.assert(
        fc.property(fc.constantFrom(...requiredSections), (section) => {
          const trSection = (trDictionary as Record<string, unknown>)[section];
          const enSection = (enDictionary as Record<string, unknown>)[section];

          expect(trSection).toBeDefined();
          expect(enSection).toBeDefined();
          expect(typeof trSection).toBe('object');
          expect(typeof enSection).toBe('object');
        }),
        { numRuns: requiredSections.length }
      );
    });

    it('navigation section should have all required keys for header/footer', () => {
      const requiredNavKeys = ['home', 'products', 'favorites', 'categories'];

      for (const key of requiredNavKeys) {
        expect(trDictionary.navigation[key as keyof typeof trDictionary.navigation]).toBeDefined();
        expect(enDictionary.navigation[key as keyof typeof enDictionary.navigation]).toBeDefined();
      }
    });

    it('product section should have all required keys for product display', () => {
      const requiredProductKeys = [
        'addToFavorites',
        'removeFromFavorites',
        'inStock',
        'outOfStock',
        'price',
        'reviews',
      ];

      for (const key of requiredProductKeys) {
        expect(trDictionary.product[key as keyof typeof trDictionary.product]).toBeDefined();
        expect(enDictionary.product[key as keyof typeof enDictionary.product]).toBeDefined();
      }
    });

    it('errors section should have all required keys for error pages', () => {
      const requiredErrorKeys = [
        'notFound',
        'notFoundDescription',
        'serverError',
        'serverErrorDescription',
        'goHome',
      ];

      for (const key of requiredErrorKeys) {
        expect(trDictionary.errors[key as keyof typeof trDictionary.errors]).toBeDefined();
        expect(enDictionary.errors[key as keyof typeof enDictionary.errors]).toBeDefined();
      }
    });
  });
});
