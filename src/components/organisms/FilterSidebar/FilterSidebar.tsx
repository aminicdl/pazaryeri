'use client';

import React, { useState, useCallback } from 'react';
import type { Category } from '@/types/category';
import type { ProductFilters } from '@/types/product';
import Button from '@/components/atoms/Button/Button';
import Input from '@/components/atoms/Input/Input';

export interface FilterSidebarProps {
  categories: Category[];
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onReset?: () => void;
  dictionary?: {
    categories: string;
    allCategories: string;
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
    inStockOnly: string;
    applyFilters: string;
    resetFilters: string;
  };
}

const defaultDictionary = {
  categories: 'Categories',
  allCategories: 'All Categories',
  priceRange: 'Price Range',
  minPrice: 'Min Price',
  maxPrice: 'Max Price',
  sortBy: 'Sort By',
  sortOptions: {
    newest: 'Newest',
    priceAsc: 'Price: Low to High',
    priceDesc: 'Price: High to Low',
    rating: 'Highest Rated',
  },
  inStockOnly: 'In Stock Only',
  applyFilters: 'Apply Filters',
  resetFilters: 'Reset Filters',
};


const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onFilterChange,
  onReset,
  dictionary = defaultDictionary,
}) => {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      categoryId: categoryId || undefined,
    }));
  }, []);

  const handlePriceChange = useCallback((field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setLocalFilters((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  }, []);

  const handleSortChange = useCallback((sortBy: ProductFilters['sortBy']) => {
    setLocalFilters((prev) => ({
      ...prev,
      sortBy,
    }));
  }, []);

  const handleInStockChange = useCallback((checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      inStock: checked || undefined,
    }));
  }, []);

  const handleApply = useCallback(() => {
    onFilterChange(localFilters);
  }, [localFilters, onFilterChange]);

  const handleReset = useCallback(() => {
    const emptyFilters: ProductFilters = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
    onReset?.();
  }, [onFilterChange, onReset]);

  return (
    <aside
      className="w-full lg:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-6"
      aria-label="Product filters"
    >
      {/* Categories */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {dictionary.categories}
        </h3>
        <div className="space-y-2" role="radiogroup" aria-label={dictionary.categories}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={!localFilters.categoryId}
              onChange={() => handleCategoryChange('')}
              className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {dictionary.allCategories}
            </span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={localFilters.categoryId === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {category.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                ({category.productCount})
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Price Range */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {dictionary.priceRange}
        </h3>
        <div className="flex gap-2 items-center">
          <Input
            variant="number"
            placeholder={dictionary.minPrice}
            value={localFilters.minPrice?.toString() || ''}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            min={0}
            aria-label={dictionary.minPrice}
            className="w-full"
          />
          <span className="text-gray-500 dark:text-gray-400">-</span>
          <Input
            variant="number"
            placeholder={dictionary.maxPrice}
            value={localFilters.maxPrice?.toString() || ''}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            min={0}
            aria-label={dictionary.maxPrice}
            className="w-full"
          />
        </div>
      </section>

      {/* Sort By */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {dictionary.sortBy}
        </h3>
        <select
          value={localFilters.sortBy || ''}
          onChange={(e) => handleSortChange(e.target.value as ProductFilters['sortBy'])}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label={dictionary.sortBy}
        >
          <option value="">{dictionary.sortOptions.newest}</option>
          <option value="price_asc">{dictionary.sortOptions.priceAsc}</option>
          <option value="price_desc">{dictionary.sortOptions.priceDesc}</option>
          <option value="rating">{dictionary.sortOptions.rating}</option>
        </select>
      </section>

      {/* In Stock Only */}
      <section>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={localFilters.inStock || false}
            onChange={(e) => handleInStockChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {dictionary.inStockOnly}
          </span>
        </label>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="primary" onClick={handleApply} className="w-full">
          {dictionary.applyFilters}
        </Button>
        <Button variant="outline" onClick={handleReset} className="w-full">
          {dictionary.resetFilters}
        </Button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
