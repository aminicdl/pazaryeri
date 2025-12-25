import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pazaryeri.com';

  // Static pages for each locale
  const staticPages = locales.flatMap((lang) => [
    {
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/${lang}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${lang}/favorites`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ]);

  // Dynamic product pages
  const { products } = await getProducts(undefined, 1, 100);
  const productPages = products.flatMap((product) =>
    locales.map((lang) => ({
      url: `${baseUrl}/${lang}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // Dynamic category pages
  const categories = await getCategories();
  const categoryPages = categories.flatMap((category) =>
    locales.map((lang) => ({
      url: `${baseUrl}/${lang}/products?category=${category.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...productPages, ...categoryPages];
}
