import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import FilterSidebar from './FilterSidebar';
import type { Category } from '@/types/category';
import type { ProductFilters } from '@/types/product';

const meta: Meta<typeof FilterSidebar> = {
  title: 'Organisms/FilterSidebar',
  component: FilterSidebar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FilterSidebar>;

const mockCategories: Category[] = [
  {
    id: 'cat-001',
    slug: 'elektronik',
    name: 'Elektronik',
    productCount: 450,
  },
  {
    id: 'cat-002',
    slug: 'telefon-aksesuar',
    name: 'Telefon & Aksesuar',
    productCount: 150,
  },
  {
    id: 'cat-003',
    slug: 'bilgisayar',
    name: 'Bilgisayar',
    productCount: 80,
  },
  {
    id: 'cat-004',
    slug: 'erkek-giyim',
    name: 'Erkek Giyim',
    productCount: 200,
  },
  {
    id: 'cat-005',
    slug: 'kadin-giyim',
    name: 'Kadın Giyim',
    productCount: 320,
  },
];


const turkishDictionary = {
  categories: 'Kategoriler',
  allCategories: 'Tüm Kategoriler',
  priceRange: 'Fiyat Aralığı',
  minPrice: 'Min Fiyat',
  maxPrice: 'Max Fiyat',
  sortBy: 'Sırala',
  sortOptions: {
    newest: 'En Yeni',
    priceAsc: 'Fiyat: Düşükten Yükseğe',
    priceDesc: 'Fiyat: Yüksekten Düşüğe',
    rating: 'En Yüksek Puan',
  },
  inStockOnly: 'Sadece Stokta Olanlar',
  applyFilters: 'Filtreleri Uygula',
  resetFilters: 'Filtreleri Sıfırla',
};

const englishDictionary = {
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

// Interactive wrapper component
const FilterSidebarWrapper = ({
  categories,
  initialFilters = {},
  dictionary,
}: {
  categories: Category[];
  initialFilters?: ProductFilters;
  dictionary?: typeof turkishDictionary;
}) => {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  return (
    <div className="space-y-4">
      <FilterSidebar
        categories={categories}
        filters={filters}
        onFilterChange={setFilters}
        dictionary={dictionary}
      />
      <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Current Filters:
        </h4>
        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <FilterSidebarWrapper
      categories={mockCategories}
      dictionary={turkishDictionary}
    />
  ),
};

export const WithInitialFilters: Story = {
  render: () => (
    <FilterSidebarWrapper
      categories={mockCategories}
      initialFilters={{
        categoryId: 'cat-002',
        minPrice: 1000,
        maxPrice: 50000,
        sortBy: 'price_asc',
        inStock: true,
      }}
      dictionary={turkishDictionary}
    />
  ),
};

export const English: Story = {
  render: () => (
    <FilterSidebarWrapper
      categories={mockCategories}
      dictionary={englishDictionary}
    />
  ),
};

export const FewCategories: Story = {
  render: () => (
    <FilterSidebarWrapper
      categories={mockCategories.slice(0, 2)}
      dictionary={turkishDictionary}
    />
  ),
};

export const NoCategories: Story = {
  render: () => (
    <FilterSidebarWrapper
      categories={[]}
      dictionary={turkishDictionary}
    />
  ),
};
