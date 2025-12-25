import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Pagination from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current active page',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Number of siblings on each side of current page',
    },
    showFirstLast: {
      control: 'boolean',
      description: 'Show first/last page buttons',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all pagination controls',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 50,
    totalPages: 100,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const WithoutFirstLast: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    showFirstLast: false,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const Disabled: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    disabled: true,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const TurkishLocale: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    dictionary: {
      previous: 'Önceki',
      next: 'Sonraki',
      page: 'Sayfa',
      of: '/',
      first: 'İlk sayfa',
      last: 'Son sayfa',
    },
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const EnglishLocale: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    dictionary: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      first: 'First page',
      last: 'Last page',
    },
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

export const MoreSiblings: Story = {
  args: {
    currentPage: 10,
    totalPages: 20,
    siblingCount: 2,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};

// Interactive controlled example
const ControlledPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div className="space-y-4">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Showing page {currentPage} of {totalPages}
      </p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <ControlledPagination />,
};

// In product listing context
export const InProductListing: Story = {
  args: {
    currentPage: 3,
    totalPages: 15,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing 25-36 of 180 products
        </div>
        <Story />
      </div>
    ),
  ],
};
