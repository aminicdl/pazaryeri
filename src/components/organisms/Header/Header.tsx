'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/molecules/SearchBar/SearchBar';
import LanguageSwitcher from '@/components/molecules/LanguageSwitcher/LanguageSwitcher';
import ThemeToggle from '@/components/molecules/ThemeToggle/ThemeToggle';
import { useFavoritesCount } from '@/stores/useFavoritesStore';
import type { Locale } from '@/lib/i18n/config';

export interface HeaderProps {
  lang?: Locale;
  dictionary?: {
    navigation: {
      home: string;
      products: string;
      favorites: string;
      categories: string;
    };
    common: {
      search: string;
    };
    theme: {
      light: string;
      dark: string;
      system: string;
    };
  };
  onSearch?: (query: string) => void;
}

const MenuIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HeartIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const Header: React.FC<HeaderProps> = ({
  lang = 'tr',
  dictionary = {
    navigation: {
      home: 'Home',
      products: 'Products',
      favorites: 'Favorites',
      categories: 'Categories',
    },
    common: {
      search: 'Search products...',
    },
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
  },
  onSearch,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const favoritesCount = useFavoritesCount();

  const navLinks = [
    { href: `/${lang}`, label: dictionary.navigation.home },
    { href: `/${lang}/products`, label: dictionary.navigation.products },
    { href: `/${lang}/categories`, label: dictionary.navigation.categories },
  ];

  const handleSearch = (query: string) => {
    onSearch?.(query);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href={`/${lang}`}
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Pazaryeri Home"
            >
              Pazaryeri
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar
              placeholder={dictionary.common.search}
              onSearch={handleSearch}
              dictionary={{
                search: dictionary.common.search,
                clear: 'Clear search',
              }}
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher currentLocale={lang} variant="buttons" />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle
              variant="icon"
              dictionary={{
                light: dictionary.theme.light,
                dark: dictionary.theme.dark,
                system: dictionary.theme.system,
                toggleTheme: 'Toggle theme',
              }}
            />

            {/* Favorites */}
            <Link
              href={`/${lang}/favorites`}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={`${dictionary.navigation.favorites}${favoritesCount > 0 ? ` (${favoritesCount} items)` : ''}`}
            >
              <HeartIcon />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-200 dark:border-gray-700"
        >
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <SearchBar
              placeholder={dictionary.common.search}
              onSearch={handleSearch}
              dictionary={{
                search: dictionary.common.search,
                clear: 'Clear search',
              }}
            />

            {/* Mobile Navigation */}
            <nav className="space-y-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={`/${lang}/favorites`}
                className="flex items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{dictionary.navigation.favorites}</span>
                {favoritesCount > 0 && (
                  <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </Link>
            </nav>

            {/* Mobile Language Switcher */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <LanguageSwitcher currentLocale={lang} variant="buttons" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
