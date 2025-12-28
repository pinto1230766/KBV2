import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stories de base
export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    alt: 'John Doe',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
        alt="Small"
        size="sm"
      />
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face"
        alt="Medium"
        size="md"
      />
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
        alt="Large"
        size="lg"
      />
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
        alt="Extra Large"
        size="xl"
      />
    </div>
  ),
};

export const WithName: Story = {
  args: {
    name: 'John Doe',
    size: 'md',
  },
};

export const Grouped: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
        alt="John"
        name="John"
        size="sm"
      />
      <Avatar
        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
        alt="Jane"
        name="Jane"
        size="sm"
      />
      <Avatar
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
        alt="Bob"
        name="Bob"
        size="sm"
      />
      <Avatar
        name="+3"
        size="sm"
      />
    </div>
  ),
};

export const WithFallbackColor: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        name="John Doe"
        size="md"
        fallbackClassName="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
      />
      <Avatar
        name="Jane Smith"
        size="md"
        fallbackClassName="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
      />
      <Avatar
        name="Bob Wilson"
        size="md"
        fallbackClassName="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
      />
    </div>
  ),
};

export const FallbackStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://example.com/nonexistent.jpg"
        alt="Broken Image"
        name="BI"
        size="md"
      />
      <Avatar
        src=""
        alt="Empty Source"
        name="ES"
        size="md"
      />
      <Avatar
        name="No Source"
        size="md"
      />
    </div>
  ),
};