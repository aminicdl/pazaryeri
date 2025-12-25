import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary, isValidLocale, type Locale } from '@/lib/i18n';
import { getProductBySlug } from '@/services/productService';
import ProductDetailClient from './ProductDetailClient';

// SSR - no caching, always fetch fresh data
export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }

  const product = await getProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pazaryeri.com';
  const productUrl = `${baseUrl}/${locale}/products/${product.slug}`;
  const productImage = product.images[0]?.url || '/images/placeholder.jpg';

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      url: productUrl,
      type: 'website',
      images: [
        {
          url: productImage,
          width: product.images[0]?.width || 800,
          height: product.images[0]?.height || 800,
          alt: product.images[0]?.alt || product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [productImage],
    },
  };
}

// Generate JSON-LD structured data for product
function generateProductJsonLd(product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>, locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pazaryeri.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => img.url),
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: product.reviewCount > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        }
      : undefined,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const [product, dictionary] = await Promise.all([
    getProductBySlug(slug),
    getDictionary(locale as Locale),
  ]);

  if (!product) {
    notFound();
  }

  const jsonLd = generateProductJsonLd(product, locale);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ProductDetailClient
        product={product}
        lang={locale as Locale}
        dictionary={{
          product: dictionary.product,
          common: dictionary.common,
          navigation: dictionary.navigation,
        }}
      />
    </>
  );
}
