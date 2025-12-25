import type { Meta, StoryObj } from '@storybook/react';
import OptimizedImage from './OptimizedImage';

const meta: Meta<typeof OptimizedImage> = {
  title: 'Atoms/OptimizedImage',
  component: OptimizedImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'select',
      options: ['lazy', 'eager'],
    },
    placeholder: {
      control: 'select',
      options: ['blur', 'empty'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof OptimizedImage>;

export const Default: Story = {
  args: {
    src: '/next.svg',
    alt: 'Next.js Logo',
    width: 200,
    height: 100,
  },
};

export const WithBlurPlaceholder: Story = {
  args: {
    src: '/vercel.svg',
    alt: 'Vercel Logo',
    width: 200,
    height: 100,
    placeholder: 'blur',
  },
};

export const LazyLoaded: Story = {
  args: {
    src: '/globe.svg',
    alt: 'Globe Icon',
    width: 100,
    height: 100,
    loading: 'lazy',
  },
};

export const WithFallback: Story = {
  args: {
    src: '/non-existent-image.jpg',
    alt: 'Image with fallback',
    width: 200,
    height: 200,
    fallbackSrc: '/file.svg',
  },
};

export const MultipleImages: Story = {
  render: () => (
    <div className="flex gap-4">
      <OptimizedImage
        src="/next.svg"
        alt="Next.js Logo"
        width={100}
        height={50}
      />
      <OptimizedImage
        src="/vercel.svg"
        alt="Vercel Logo"
        width={100}
        height={50}
      />
      <OptimizedImage
        src="/globe.svg"
        alt="Globe Icon"
        width={50}
        height={50}
      />
    </div>
  ),
};
