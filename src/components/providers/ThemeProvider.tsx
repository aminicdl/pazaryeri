'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Hook to check if component is mounted (client-side)
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/**
 * ThemeProvider - Initializes and manages theme state on client-side
 * Applies the theme class to the document and listens for system preference changes
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, getEffectiveTheme } = useThemeStore();
  const mounted = useIsMounted();

  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme on mount and when theme changes
    const effectiveTheme = getEffectiveTheme();
    const root = document.documentElement;

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, getEffectiveTheme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    // Listen for system preference changes when theme is 'system'
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // Script to prevent flash of wrong theme
  useEffect(() => {
    // Initial theme application
    const effectiveTheme = getEffectiveTheme();
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [getEffectiveTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
