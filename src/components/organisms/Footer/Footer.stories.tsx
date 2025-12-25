import type { Meta, StoryObj } from '@storybook/react';
import Footer from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Organisms/Footer',
  component: Footer,
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
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

const turkishDictionary = {
  navigation: {
    home: 'Ana Sayfa',
    products: 'Ürünler',
    favorites: 'Favoriler',
    categories: 'Kategoriler',
  },
  footer: {
    about: 'Hakkımızda',
    contact: 'İletişim',
    privacy: 'Gizlilik Politikası',
    terms: 'Kullanım Koşulları',
    copyright: '© 2024 Pazaryeri. Tüm hakları saklıdır.',
    followUs: 'Bizi Takip Edin',
  },
};

const englishDictionary = {
  navigation: {
    home: 'Home',
    products: 'Products',
    favorites: 'Favorites',
    categories: 'Categories',
  },
  footer: {
    about: 'About Us',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    copyright: '© 2024 Pazaryeri. All rights reserved.',
    followUs: 'Follow Us',
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
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-48"
              >
                <div className="h-full flex items-center justify-center text-gray-400">
                  Content {i}
                </div>
              </div>
            ))}
          </div>
        </main>
        <Story />
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
