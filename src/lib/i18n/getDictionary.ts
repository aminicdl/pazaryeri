import type { Locale } from './config';

export interface Dictionary {
  common: {
    loading: string;
    error: string;
    retry: string;
    search: string;
    noResults: string;
    close: string;
    save: string;
    cancel: string;
    viewAll: string;
  };
  navigation: {
    home: string;
    products: string;
    favorites: string;
    categories: string;
  };
  footer: {
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    copyright: string;
    followUs: string;
  };
  home: {
    featuredProducts: string;
    categories: string;
    shopNow: string;
  };
  product: {
    addToFavorites: string;
    removeFromFavorites: string;
    inStock: string;
    outOfStock: string;
    price: string;
    reviews: string;
    description: string;
    specifications: string;
  };
  favorites: {
    title: string;
    empty: string;
    emptyDescription: string;
    browseProducts: string;
    itemCount: string;
  };
  filters: {
    title: string;
    category: string;
    priceRange: string;
    minPrice: string;
    maxPrice: string;
    sortBy: string;
    sortOptions: {
      newest: string;
      priceAsc: string;
      priceDesc: string;
      rating: string;
    };
    clearAll: string;
    apply: string;
  };
  pagination: {
    previous: string;
    next: string;
    page: string;
    of: string;
  };
  theme: {
    light: string;
    dark: string;
    system: string;
  };
  errors: {
    notFound: string;
    notFoundDescription: string;
    serverError: string;
    serverErrorDescription: string;
    goHome: string;
  };
  meta: {
    siteTitle: string;
    siteDescription: string;
    homeTitle: string;
    productsTitle: string;
    favoritesTitle: string;
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  tr: () => import('./dictionaries/tr.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
