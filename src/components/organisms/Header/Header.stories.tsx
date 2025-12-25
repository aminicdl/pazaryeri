import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    lang: {
      control: 'select',
      options: ['tr', 'en'],
      description: 'Current language locale',
    },
    onSearch: {
      action: 'searched',
      description: 'Callback when search is submitted',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

const turkishDictionary = {
  navigation: {
    home: 'Ana Sayfa',
    products: 'Ürünler',
    favorites: 'Favoriler',
    categories: 'Kategoriler',
  },
  common: {
    search: 'Ürün ara...',
  },
  theme: {
    light: 'Açık',
    dark: 'Koyu',
    system: 'Sistem',
  },
};

const englishDictionary = {
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
};

export const Default: Story = {
  args: {
    lang: 'tr',
    dictionary: turkishDictionary,
  },
};

export const Turkish: Story = {
  args: {
    lang: 'tr',
    dictionary: turkishDictionary,
  },
};

export const English: Story = {
  args: {
    lang: 'en',
    dictionary: englishDictionary,
  },
};

export const WithPageContent: Story = {
  args: {
    lang: 'tr',
    dictionary: turkishDictionary,
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Story />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-48"
              >
                <div className="h-full flex items-center justify-center text-gray-400">
                  Product Card {i}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    ),
  ],
};

export const MobileView: Story = {
  args: {
    lang: 'tr',
    dictionary: turkishDictionary,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  args: {
    lang: 'tr',
    dictionary: turkishDictionary,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
