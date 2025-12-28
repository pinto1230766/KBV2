import type { Meta, StoryObj } from '@storybook/react';
import { LazyImage } from './LazyImage';

const meta = {
  title: 'UI/LazyImage',
  component: LazyImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LazyImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Image par défaut',
  },
};

export const WithPlaceholder: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Image avec placeholder',
    placeholder: 'https://picsum.photos/400/300?blur=10',
  },
};

export const Priority: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Image prioritaire (eager loading)',
    priority: true,
  },
};

export const CustomQuality: Story = {
  args: {
    src: 'https://picsum.photos/800/600',
    alt: 'Image haute qualité',
    quality: 90,
  },
};

export const WithAspectRatio: Story = {
  args: {
    src: 'https://picsum.photos/800/600',
    alt: 'Image avec aspect ratio',
    aspectRatio: '16/9',
  },
};

export const Landscape: Story = {
  args: {
    src: 'https://picsum.photos/800/400',
    alt: 'Image paysage',
  },
};

export const Portrait: Story = {
  args: {
    src: 'https://picsum.photos/400/600',
    alt: 'Image portrait',
  },
};

export const Square: Story = {
  args: {
    src: 'https://picsum.photos/400/400',
    alt: 'Image carrée',
  },
};