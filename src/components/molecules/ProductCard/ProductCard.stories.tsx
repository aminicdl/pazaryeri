import type { Meta, StoryObj } from '@storybook/react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

const mockProduct: Product = {
  id: '1',
  slug: 'sample-product',
  name: 'Premium Wireless Headphones with Noise Cancellation',
  description: 'High-quality wireless headphones with active noise cancellation.',
  price: 299.99,
  originalPrice: 399.99,
  currency: 'TRY',
  images: [
    {
      id: 'img-1',
      url: 'https://picsum.photos/seed/headphones/400/400',
      alt: 'Premium Wireless Headphones',
      width: 400,
      height: 400,
    },
  ],
  category: {
    id: 'cat-1',
    slug: 'electronics',
    name: 'Electronics',
    productCount: 150,
  },
  brand: 'TechBrand',
  rating: 4.5,
  reviewCount: 128,
  inStock: true,
  attributes: [
    { name: 'Color', value: 'Black' },
    { name: 'Connectivity', value: 'Bluetooth 5.0' },
  ],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z',
};

const meta: Meta<typeof ProductCard> = {
  title: 'Molecules/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    lang: {
      control: 'select',
      options: ['tr', 'en'],
      description: 'Language for formatting and links',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    product: mockProduct,
    lang: 'tr',
  },
};

export const WithDiscount: Story = {
  args: {
    product: mockProduct,
    lang: 'tr',
  },
};

export const NoDiscount: Story = {
  args: {
    product: {
      ...mockProduct,
      originalPrice: undefined,
    },
    lang: 'tr',
  },
};

export const OutOfStock: Story = {
  args: {
    product: {
      ...mockProduct,
      inStock: false,
    },
    lang: 'tr',
  },
};

export const NoImage: Story = {
  args: {
    product: {
      ...mockProduct,
      images: [],
    },
    lang: 'tr',
  },
};

export const LongTitle: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'This is a very long product name that should be truncated after two lines to maintain consistent card height across the grid',
    },
    lang: 'tr',
  },
};

export const NoRating: Story = {
  args: {
    product: {
      ...mockProduct,
      rating: 0,
      reviewCount: 0,
    },
    lang: 'tr',
  },
};

export const EnglishLocale: Story = {
  args: {
    product: mockProduct,
    lang: 'en',
    dictionary: {
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
    },
  },
};

export const TurkishLocale: Story = {
  args: {
    product: mockProduct,
    lang: 'tr',
    dictionary: {
      addToFavorites: 'Favorilere Ekle',
      removeFromFavorites: 'Favorilerden Çıkar',
      inStock: 'Stokta',
      outOfStock: 'Stokta Yok',
    },
  },
};

export const USDCurrency: Story = {
  args: {
    product: {
      ...mockProduct,
      currency: 'USD',
      price: 29.99,
      originalPrice: 39.99,
    },
    lang: 'en',
  },
};
