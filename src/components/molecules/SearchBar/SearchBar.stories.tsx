import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the search bar is disabled',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Whether to auto-focus the input on mount',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    placeholder: 'Search products...',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Search products...',
    value: 'Headphones',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search products...',
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    placeholder: 'Search products...',
    value: 'Headphones',
    disabled: true,
  },
};

export const TurkishLocale: Story = {
  args: {
    placeholder: 'Ürün ara...',
    dictionary: {
      search: 'Ara',
      clear: 'Aramayı temizle',
    },
  },
};

export const EnglishLocale: Story = {
  args: {
    placeholder: 'Search products...',
    dictionary: {
      search: 'Search',
      clear: 'Clear search',
    },
  },
};

// Interactive controlled example
const ControlledSearchBar = () => {
  const [value, setValue] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');

  return (
    <div className="space-y-4">
      <SearchBar
        value={value}
        onChange={setValue}
        onSearch={(term) => setSearchedTerm(term)}
        onClear={() => setSearchedTerm('')}
        placeholder="Type and press Enter..."
      />
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>Current value: {value || '(empty)'}</p>
        <p>Last searched: {searchedTerm || '(none)'}</p>
      </div>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledSearchBar />,
};

export const AutoFocus: Story = {
  args: {
    placeholder: 'Auto-focused input...',
    autoFocus: true,
  },
};

export const CustomWidth: Story = {
  args: {
    placeholder: 'Full width search...',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg">
        <Story />
      </div>
    ),
  ],
};
