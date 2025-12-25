import { getDictionary, isValidLocale, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getFeaturedProducts } from '@/services/productService';
import { getRootCategories } from '@/services/categoryService';
import ProductGrid from '@/components/organisms/ProductGrid/ProductGrid';
import OptimizedImage from '@/components/atoms/OptimizedImage/OptimizedImage';
import type { Metadata } from 'next';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  
  if (!isValidLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.meta.homeTitle,
    description: dictionary.meta.siteDescription,
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang as Locale);
  
  // Fetch data for SSG
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(4),
    getRootCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {dictionary.meta.siteTitle}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {dictionary.meta.siteDescription}
          </p>
          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            {dictionary.home.shopNow}
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {dictionary.home.categories}
            </h2>
            <Link
              href={`/${lang}/categories`}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {dictionary.common.viewAll}
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${lang}/products?category=${category.id}`}
                className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
                  {category.image ? (
                    <OptimizedImage
                      src={category.image}
                      alt={category.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {category.productCount} {lang === 'tr' ? 'ürün' : 'products'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {dictionary.home.featuredProducts}
            </h2>
            <Link
              href={`/${lang}/products`}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {dictionary.common.viewAll}
            </Link>
          </div>
          
          <ProductGrid
            products={featuredProducts}
            lang={lang as Locale}
            columns={4}
            dictionary={{
              product: dictionary.product,
              common: dictionary.common,
            }}
          />
        </div>
      </section>
    </div>
  );
}
