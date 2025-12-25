import type { Meta, StoryObj } from '@storybook/react';
import ThemeToggle from './ThemeToggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Molecules/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['icon', 'switch', 'buttons'],
      description: 'Visual variant of the toggle',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show text labels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  args: {
    variant: 'icon',
  },
};

export const IconVariant: Story = {
  args: {
    variant: 'icon',
  },
};

export const IconWithLabel: Story = {
  args: {
    variant: 'icon',
    showLabel: true,
  },
};

export const SwitchVariant: Story = {
  args: {
    variant: 'switch',
  },
};

export const ButtonsVariant: Story = {
  args: {
    variant: 'buttons',
  },
};

export const ButtonsWithLabels: Story = {
  args: {
    variant: 'buttons',
    showLabel: true,
  },
};

export const TurkishLocale: Story = {
  args: {
    variant: 'buttons',
    showLabel: true,
    dictionary: {
      light: 'Açık',
      dark: 'Koyu',
      system: 'Sistem',
      toggleTheme: 'Tema değiştir',
    },
  },
};

export const EnglishLocale: Story = {
  args: {
    variant: 'buttons',
    showLabel: true,
    dictionary: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      toggleTheme: 'Toggle theme',
    },
  },
};

// In header context
export const InHeader: Story = {
  args: {
    variant: 'icon',
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

// Settings page context
export const InSettings: Story = {
  args: {
    variant: 'buttons',
    showLabel: true,
  },
  decorators: [
    (Story) => (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow max-w-md">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Theme</span>
          <Story />
        </div>
      </div>
    ),
  ],
};

// Mobile context
export const MobileSwitch: Story = {
  args: {
    variant: 'switch',
  },
  decorators: [
    (Story) => (
      <div className="w-64 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-200">Dark Mode</span>
          <Story />
        </div>
      </div>
    ),
  ],
};
