import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary, isValidLocale, type Locale } from '@/lib/i18n';
import FavoritesPageClient from './FavoritesPageClient';

interface FavoritesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FavoritesPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }

  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.meta.favoritesTitle,
    description: dictionary.favorites.emptyDescription,
  };
}

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);

  return (
    <FavoritesPageClient
      lang={locale as Locale}
      dictionary={{
        favorites: dictionary.favorites,
        product: dictionary.product,
        common: dictionary.common,
        navigation: dictionary.navigation,
      }}
    />
  );
}
