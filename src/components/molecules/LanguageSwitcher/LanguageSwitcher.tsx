'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/lib/i18n/config';

export interface LanguageSwitcherProps {
  currentLocale?: Locale;
  variant?: 'buttons' | 'dropdown';
  className?: string;
}

const GlobeIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-11-4.69v.001a6.489 6.489 0 003.5 1.024c1.447 0 2.79-.474 3.87-1.274A6.47 6.47 0 0116.5 10z"
      clipRule="evenodd"
    />
  </svg>
);

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  variant = 'buttons',
  className = '',
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // Extract current locale from pathname if not provided
  const activeLocale = currentLocale || (pathname?.split('/')[1] as Locale) || 'tr';

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === activeLocale) return;

    // Replace the locale segment in the pathname
    const segments = pathname?.split('/') || [];
    if (segments[1] && locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join('/') || `/${newLocale}`;
    router.push(newPath);
  };

  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block ${className}`}>
        <label htmlFor="language-select" className="sr-only">
          Select language
        </label>
        <div className="flex items-center gap-2">
          <GlobeIcon />
          <select
            id="language-select"
            value={activeLocale}
            onChange={(e) => switchLanguage(e.target.value as Locale)}
            className="
              appearance-none bg-transparent 
              text-gray-700 dark:text-gray-200 
              font-medium cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              rounded px-1 py-0.5
            "
            aria-label="Select language"
          >
            {locales.map((locale) => (
              <option key={locale} value={locale}>
                {localeNames[locale]}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  // Button variant (default)
  return (
    <div
      className={`inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
      role="group"
      aria-label="Language selection"
    >
      {locales.map((locale) => {
        const isActive = locale === activeLocale;
        return (
          <button
            key={locale}
            onClick={() => switchLanguage(locale)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-md transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              ${
                isActive
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }
            `}
            aria-pressed={isActive}
            aria-label={`Switch to ${localeNames[locale]}`}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
