/**
 * Favorites Store - Manages user's favorite products
 * Uses Zustand with normalized state and localStorage persistence
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/product';

/**
 * Normalized state structure for favorites
 * Using Map for safe key handling (avoids prototype pollution)
 */
export interface FavoritesState {
  /** Normalized favorites map: productId -> Product */
  favorites: Map<string, Product>;

  /** Add a product to favorites */
  addFavorite: (product: Product) => void;

  /** Remove a product from favorites by ID */
  removeFavorite: (productId: string) => void;

  /** Check if a product is in favorites */
  isFavorite: (productId: string) => boolean;

  /** Clear all favorites */
  clearFavorites: () => void;

  /** Get all favorites as an array */
  getFavoritesArray: () => Product[];

  /** Get the count of favorites */
  getFavoritesCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: new Map<string, Product>(),

      addFavorite: (product: Product) => {
        set((state) => {
          const newFavorites = new Map(state.favorites);
          newFavorites.set(product.id, product);
          return { favorites: newFavorites };
        });
      },

      removeFavorite: (productId: string) => {
        set((state) => {
          const newFavorites = new Map(state.favorites);
          newFavorites.delete(productId);
          return { favorites: newFavorites };
        });
      },

      isFavorite: (productId: string) => {
        return get().favorites.has(productId);
      },

      clearFavorites: () => {
        set({ favorites: new Map() });
      },

      getFavoritesArray: () => {
        return Array.from(get().favorites.values());
      },

      getFavoritesCount: () => {
        return get().favorites.size;
      },
    }),
    {
      name: 'pazaryeri-favorites',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Convert stored object back to Map
          if (parsed.state?.favorites) {
            parsed.state.favorites = new Map(
              Object.entries(parsed.state.favorites)
            );
          }
          return parsed;
        },
        setItem: (name, value) => {
          // Convert Map to object for JSON serialization
          const toStore = {
            ...value,
            state: {
              ...value.state,
              favorites: Object.fromEntries(value.state.favorites),
            },
          };
          localStorage.setItem(name, JSON.stringify(toStore));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

/**
 * Selector hook for favorites count (for use in components)
 */
export const useFavoritesCount = (): number => {
  return useFavoritesStore((state) => state.favorites.size);
};

/**
 * Selector hook for checking if a specific product is favorited
 */
export const useIsFavorite = (productId: string): boolean => {
  return useFavoritesStore((state) => state.favorites.has(productId));
};
