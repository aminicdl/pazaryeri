import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
    type: {
      control: 'select',
      options: ['status', 'count'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'In Stock',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Low Stock',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Out of Stock',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'New',
  },
};


export const CountBadge: Story = {
  args: {
    type: 'count',
    variant: 'error',
    children: '5',
  },
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

export const CountBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge type="count" variant="default">3</Badge>
      <Badge type="count" variant="success">12</Badge>
      <Badge type="count" variant="warning">7</Badge>
      <Badge type="count" variant="error">99+</Badge>
      <Badge type="count" variant="info">0</Badge>
    </div>
  ),
};
