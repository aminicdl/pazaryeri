import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'search', 'number'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Text: Story = {
  args: {
    variant: 'text',
    placeholder: 'Enter text...',
  },
};

export const Search: Story = {
  args: {
    variant: 'search',
    placeholder: 'Search...',
  },
};

export const Number: Story = {
  args: {
    variant: 'number',
    placeholder: 'Enter number...',
  },
};


export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    error: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot edit...',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input variant="text" label="Text Input" placeholder="Enter text..." />
      <Input variant="search" label="Search Input" placeholder="Search..." />
      <Input variant="number" label="Number Input" placeholder="Enter number..." />
      <Input label="With Error" placeholder="Invalid input" error="This field is required" />
      <Input label="Disabled" placeholder="Cannot edit" disabled />
    </div>
  ),
};
