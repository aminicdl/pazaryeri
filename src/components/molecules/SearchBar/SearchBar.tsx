'use client';

import React, { useState, useRef, useCallback } from 'react';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
  dictionary?: {
    search: string;
    clear: string;
  };
}

const SearchIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    />
  </svg>
);

const ClearIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
      clipRule="evenodd"
    />
  </svg>
);

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  disabled = false,
  className = '',
  autoFocus = false,
  dictionary = {
    search: 'Search',
    clear: 'Clear search',
  },
}) => {
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  }, [isControlled, onChange, onClear]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSearch?.(value);
      }
      if (e.key === 'Escape' && value) {
        handleClear();
      }
    },
    [value, onSearch, handleClear]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(value);
    },
    [value, onSearch]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center ${className}`}
      role="search"
    >
      {/* Search Icon */}
      <span className="absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none">
        <SearchIcon />
      </span>

      {/* Input */}
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || dictionary.search}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={dictionary.search}
        className={`
          w-full pl-10 pr-10 py-2.5 
          bg-white dark:bg-gray-800 
          border border-gray-300 dark:border-gray-600 
          rounded-lg 
          text-gray-900 dark:text-gray-100 
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          dark:focus:ring-blue-400 dark:focus:border-blue-400
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        `}
      />

      {/* Clear Button */}
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          aria-label={dictionary.clear}
        >
          <ClearIcon />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
