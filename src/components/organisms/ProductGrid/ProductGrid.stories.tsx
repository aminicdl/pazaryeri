import type { Meta, StoryObj } from '@storybook/react';
import ProductGrid from './ProductGrid';
import type { Product } from '@/types/product';

const meta: Meta<typeof ProductGrid> = {
  title: 'Organisms/ProductGrid',
  component: ProductGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    lang: {
      control: 'select',
      options: ['tr', 'en'],
      description: 'Current language locale',
    },
    columns: {
      control: 'select',
      options: [2, 3, 4],
      description: 'Number of columns in the grid',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading skeleton',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductGrid>;

const mockProducts: Product[] = [
  {
    id: 'prod-001',
    slug: 'iphone-15-pro-256gb',
    name: 'iPhone 15 Pro 256GB',
    description: 'Apple iPhone 15 Pro, A17 Pro çip, 256GB depolama',
    price: 64999,
    originalPrice: 69999,
    currency: 'TRY',
    images: [
      {
        id: 'img-001',
        url: 'https://picsum.photos/seed/iphone/400/400',
        alt: 'iPhone 15 Pro',
        width: 400,
        height: 400,
      },
    ],
    category: {
      id: 'cat-002',
      slug: 'telefon-aksesuar',
      name: 'Telefon & Aksesuar',
      productCount: 150,
    },
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 245,
    inStock: true,
    attributes: [{ name: 'Renk', value: 'Titanyum' }],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-20T14:30:00Z',
  },
  {
    id: 'prod-002',
    slug: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    description: 'Samsung Galaxy S24 Ultra, Snapdragon 8 Gen 3',
    price: 59999,
    currency: 'TRY',
    images: [
      {
        id: 'img-002',
        url: 'https://picsum.photos/seed/samsung/400/400',
        alt: 'Samsung Galaxy S24 Ultra',
        width: 400,
        height: 400,
      },
    ],
    category: {
      id: 'cat-002',
      slug: 'telefon-aksesuar',
      name: 'Telefon & Aksesuar',
      productCount: 150,
    },
    brand: 'Samsung',
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    attributes: [{ name: 'Renk', value: 'Titanium Gray' }],
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-12-18T11:00:00Z',
  },
  {
    id: 'prod-003',
    slug: 'macbook-pro-14-m3',
    name: 'MacBook Pro 14" M3 Pro',
    description: 'Apple MacBook Pro 14 inç, M3 Pro çip',
    price: 89999,
    originalPrice: 94999,
    currency: 'TRY',
    images: [
      {
        id: 'img-003',
        url: 'https://picsum.photos/seed/macbook/400/400',
        alt: 'MacBook Pro 14',
        width: 400,
        height: 400,
      },
    ],
    category: {
      id: 'cat-003',
      slug: 'bilgisayar',
      name: 'Bilgisayar',
      productCount: 80,
    },
    brand: 'Apple',
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    attributes: [{ name: 'İşlemci', value: 'M3 Pro' }],
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-12-15T16:00:00Z',
  },
  {
    id: 'prod-004',
    slug: 'erkek-slim-fit-gomlek',
    name: 'Erkek Slim Fit Gömlek',
    description: 'Premium pamuklu slim fit erkek gömleği',
    price: 899,
    originalPrice: 1299,
    currency: 'TRY',
    images: [
      {
        id: 'img-004',
        url: 'https://picsum.photos/seed/shirt/400/400',
        alt: 'Erkek slim fit gömlek',
        width: 400,
        height: 400,
      },
    ],
    category: {
      id: 'cat-005',
      slug: 'erkek-giyim',
      name: 'Erkek Giyim',
      productCount: 200,
    },
    brand: 'Mavi',
    rating: 4.3,
    reviewCount: 78,
    inStock: true,
    attributes: [{ name: 'Beden', value: 'M' }],
    createdAt: '2024-03-10T12:00:00Z',
    updatedAt: '2024-12-10T09:00:00Z',
  },
  {
    id: 'prod-005',
    slug: 'airpods-pro-2',
    name: 'AirPods Pro 2. Nesil',
    description: 'Apple AirPods Pro 2. nesil, USB-C şarj kutusu',
    price: 9499,
    currency: 'TRY',
    images: [
      {
        id: 'img-005',
        url: 'https://picsum.photos/seed/airpods/400/400',
        alt: 'AirPods Pro',
        width: 400,
        height: 400,
      },
    ],
    category: {
      id: 'cat-002',
      slug: 'telefon-aksesuar',
      name: 'Telefon & Aksesuar',
      productCount: 150,
    },
    brand: 'Apple',
    rating: 4.6,
    reviewCount: 312,
    inStock: false,
    attributes: [{ name: 'Renk', value: 'Beyaz' }],
    createdAt: '2024-02-15T14:00:00Z',
    updatedAt: '2024-12-22T10:00:00Z',
  },
  {
    id: 'prod-006',
    slug: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5 Kulaklık',
    description: 'Sony WH-1000XM5 kablosuz kulaklık',
    price: 12999,
    currency: 'TRY',
    images: [
      {
        id: 'img-006',
        url: 'https://picsum.photos/seed/sony/400/400',
        alt: 'Sony WH-1000XM5',
        width: 400,
        height: 400,
      },
    ],
    category: {
      id: 'cat-004',
      slug: 'elektronik',
      name: 'Elektronik',
      productCount: 300,
    },
    brand: 'Sony',
    rating: 4.8,
    reviewCount: 420,
    inStock: true,
    attributes: [{ name: 'Renk', value: 'Siyah' }],
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-12-01T08:00:00Z',
  },
];

const turkishDictionary = {
  product: {
    addToFavorites: 'Favorilere Ekle',
    removeFromFavorites: 'Favorilerden Çıkar',
    inStock: 'Stokta',
    outOfStock: 'Stokta Yok',
  },
  common: {
    loading: 'Yükleniyor...',
    noResults: 'Ürün bulunamadı',
  },
};

const englishDictionary = {
  product: {
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
  },
  common: {
    loading: 'Loading...',
    noResults: 'No products found',
  },
};

export const Default: Story = {
  args: {
    products: mockProducts,
    lang: 'tr',
    columns: 4,
    dictionary: turkishDictionary,
  },
};

export const ThreeColumns: Story = {
  args: {
    products: mockProducts,
    lang: 'tr',
    columns: 3,
    dictionary: turkishDictionary,
  },
};

export const TwoColumns: Story = {
  args: {
    products: mockProducts,
    lang: 'tr',
    columns: 2,
    dictionary: turkishDictionary,
  },
};

export const Loading: Story = {
  args: {
    products: [],
    lang: 'tr',
    columns: 4,
    loading: true,
    dictionary: turkishDictionary,
  },
};

export const Empty: Story = {
  args: {
    products: [],
    lang: 'tr',
    columns: 4,
    dictionary: turkishDictionary,
  },
};

export const EmptyWithCustomMessage: Story = {
  args: {
    products: [],
    lang: 'tr',
    columns: 4,
    emptyMessage: 'Aradığınız kriterlere uygun ürün bulunamadı.',
    dictionary: turkishDictionary,
  },
};

export const English: Story = {
  args: {
    products: mockProducts,
    lang: 'en',
    columns: 4,
    dictionary: englishDictionary,
  },
};

export const FewProducts: Story = {
  args: {
    products: mockProducts.slice(0, 2),
    lang: 'tr',
    columns: 4,
    dictionary: turkishDictionary,
  },
};
