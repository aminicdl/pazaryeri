import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary, isValidLocale, type Locale } from '@/lib/i18n';
import ProductsPageClient from './ProductsPageClient';

// ISR configuration - revalidate every 60 seconds
export const revalidate = 60;

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }

  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.meta.productsTitle,
    description: dictionary.meta.siteDescription,
  };
}

function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);

  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsPageClient
        lang={locale as Locale}
        dictionary={{
          navigation: dictionary.navigation,
          product: dictionary.product,
          common: dictionary.common,
          filters: dictionary.filters,
          pagination: dictionary.pagination,
        }}
      />
    </Suspense>
  );
}
