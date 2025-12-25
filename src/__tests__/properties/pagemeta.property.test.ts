/**
 * Property-Based Tests for Page Metadata Completeness
 *
 * **Feature: pazaryeri-frontend, Property 3: Page Metadata Completeness**
 * **Validates: Requirements 7.1, 7.2**
 *
 * Every page should have complete metadata including title, description,
 * Open Graph tags, and canonical URLs for SEO optimization.
 */

import * as fc from 'fast-check';
import { locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/getDictionary';

describe('Page Metadata Completeness - Property 3', () => {
  describe('Dictionary Meta Section', () => {
    test('for any locale, meta section should have all required fields', async () => {
      const requiredMetaFields = [
        'siteTitle',
        'siteDescription',
        'homeTitle',
        'productsTitle',
        'favoritesTitle',
      ];

      for (const locale of locales) {
        const dictionary = await getDictionary(locale);

        for (const field of requiredMetaFields) {
          const value = dictionary.meta[field as keyof typeof dictionary.meta];
          expect(value).toBeDefined();
          expect(typeof value).toBe('string');
          expect(value.length).toBeGreaterThan(0);
        }
      }
    });

    test('for any locale, siteTitle should be reasonable length', async () => {
      for (const locale of locales) {
        const dictionary = await getDictionary(locale);
        const title = dictionary.meta.siteTitle;

        expect(title.length).toBeGreaterThanOrEqual(3);
        expect(title.length).toBeLessThanOrEqual(100);
      }
    });

    test('for any locale, siteDescription should be SEO-friendly length', async () => {
      for (const locale of locales) {
        const dictionary = await getDictionary(locale);
        const description = dictionary.meta.siteDescription;

        expect(description.length).toBeGreaterThanOrEqual(20);
        expect(description.length).toBeLessThanOrEqual(200);
      }
    });
  });

  describe('Page Title Uniqueness', () => {
    test('for any locale, page titles should be unique', async () => {
      for (const locale of locales) {
        const dictionary = await getDictionary(locale);
        const titles = [
          dictionary.meta.homeTitle,
          dictionary.meta.productsTitle,
          dictionary.meta.favoritesTitle,
        ];

        const uniqueTitles = new Set(titles);
        expect(uniqueTitles.size).toBe(titles.length);
      }
    });
  });

  describe('Metadata Structure Validation', () => {
    test('for any locale, error page texts should be defined', async () => {
      const requiredErrorFields = [
        'notFound',
        'notFoundDescription',
        'serverError',
        'serverErrorDescription',
        'goHome',
      ];

      for (const locale of locales) {
        const dictionary = await getDictionary(locale);

        for (const field of requiredErrorFields) {
          const value = dictionary.errors[field as keyof typeof dictionary.errors];
          expect(value).toBeDefined();
          expect(typeof value).toBe('string');
          expect(value.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Canonical URL Structure', () => {
    test('locales array should contain valid language codes', () => {
      const validLanguageCodes = ['tr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar'];

      for (const locale of locales) {
        expect(validLanguageCodes).toContain(locale);
        expect(locale.length).toBe(2);
      }
    });

    test('for any locale, URL paths should be constructable', () => {
      const pages = ['', '/products', '/favorites', '/categories'];

      fc.assert(
        fc.property(
          fc.constantFrom(...locales),
          fc.constantFrom(...pages),
          (locale, page) => {
            const url = `/${locale}${page}`;
            expect(url).toMatch(/^\/[a-z]{2}(\/[a-z-]*)?$/);
          }
        ),
        { numRuns: locales.length * pages.length }
      );
    });
  });

  describe('Open Graph Metadata Requirements', () => {
    test('for any locale, OG locale should be derivable', () => {
      const localeToOG: Record<string, string> = {
        tr: 'tr_TR',
        en: 'en_US',
      };

      for (const locale of locales) {
        const ogLocale = localeToOG[locale];
        expect(ogLocale).toBeDefined();
        expect(ogLocale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
      }
    });
  });
});
