/**
 * Theme Store - Manages dark/light mode state
 * Uses Zustand with localStorage persistence
 *
 * Requirements: 5.4, 5.5
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

/**
 * Determines the effective theme based on system preference
 */
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * Applies the theme to the document by adding/removing the 'dark' class
 */
const applyThemeToDocument = (theme: Theme): void => {
  if (typeof document === 'undefined') return;

  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',

      setTheme: (theme: Theme) => {
        set({ theme });
        applyThemeToDocument(theme);
      },

      toggleTheme: () => {
        const effectiveTheme = get().getEffectiveTheme();
        const newTheme: Theme = effectiveTheme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        applyThemeToDocument(newTheme);
      },

      getEffectiveTheme: () => {
        const { theme } = get();
        return theme === 'system' ? getSystemTheme() : theme;
      },
    }),
    {
      name: 'pazaryeri-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme after rehydration from localStorage
        if (state) {
          applyThemeToDocument(state.theme);
        }
      },
    }
  )
);

/**
 * Hook to initialize theme on client-side
 * Should be called in the root layout
 */
export const initializeTheme = (): void => {
  const theme = useThemeStore.getState().theme;
  applyThemeToDocument(theme);
};
