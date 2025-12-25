import type { Meta, StoryObj } from '@storybook/react';
import LanguageSwitcher from './LanguageSwitcher';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Molecules/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/tr',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentLocale: {
      control: 'select',
      options: ['tr', 'en'],
      description: 'Currently active locale',
    },
    variant: {
      control: 'select',
      options: ['buttons', 'dropdown'],
      description: 'Visual variant of the switcher',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSwitcher>;

export const Default: Story = {
  args: {
    currentLocale: 'tr',
  },
};

export const ButtonsVariant: Story = {
  args: {
    currentLocale: 'tr',
    variant: 'buttons',
  },
};

export const DropdownVariant: Story = {
  args: {
    currentLocale: 'tr',
    variant: 'dropdown',
  },
};

export const TurkishActive: Story = {
  args: {
    currentLocale: 'tr',
    variant: 'buttons',
  },
};

export const EnglishActive: Story = {
  args: {
    currentLocale: 'en',
    variant: 'buttons',
  },
};

export const DropdownTurkish: Story = {
  args: {
    currentLocale: 'tr',
    variant: 'dropdown',
  },
};

export const DropdownEnglish: Story = {
  args: {
    currentLocale: 'en',
    variant: 'dropdown',
  },
};

// In header context
export const InHeader: Story = {
  args: {
    currentLocale: 'tr',
    variant: 'buttons',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
        <span className="text-gray-700 dark:text-gray-200 font-medium">Pazaryeri</span>
        <div className="flex-1" />
        <Story />
      </div>
    ),
  ],
};

// Mobile context with dropdown
export const MobileDropdown: Story = {
  args: {
    currentLocale: 'tr',
    variant: 'dropdown',
  },
  decorators: [
    (Story) => (
      <div className="w-64 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
        <Story />
      </div>
    ),
  ],
};
