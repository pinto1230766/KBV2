import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error', 'info', 'primary'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stories de base
export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'md',
  },
};

export const Variants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Badge variant='default'>Default</Badge>
      <Badge variant='primary'>Primary</Badge>
      <Badge variant='success'>Success</Badge>
      <Badge variant='warning'>Warning</Badge>
      <Badge variant='danger'>Danger</Badge>
      <Badge variant='info'>Info</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Badge size='sm'>Small</Badge>
      <Badge size='md'>Medium</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: 'With Icon',
    variant: 'primary',
  },
  render: (args) => (
    <div className='flex gap-4'>
      <Badge {...args}>
        <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
            clipRule='evenodd'
          />
        </svg>
        Success
      </Badge>
      <Badge variant='warning'>
        <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
            clipRule='evenodd'
          />
        </svg>
        Warning
      </Badge>
    </div>
  ),
};

export const Removable: Story = {
  render: () => (
    <div className='flex gap-2'>
      <Badge variant='primary'>
        Removable
        <button className='ml-1 hover:bg-white/20 rounded-full p-0.5'>
          <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </Badge>
    </div>
  ),
};

export const InText: Story = {
  render: () => (
    <div className='space-y-4'>
      <p>
        This is a paragraph with a{' '}
        <Badge variant='primary' size='sm'>
          inline badge
        </Badge>{' '}
        that flows with the text.
      </p>
      <p>
        Another example with{' '}
        <Badge variant='success' size='sm'>
          success status
        </Badge>{' '}
        showing completion.
      </p>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
        <Badge variant='success'>Online</Badge>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
        <Badge variant='warning'>Away</Badge>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
        <Badge variant='danger'>Busy</Badge>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-gray-500 rounded-full'></div>
        <Badge variant='default'>Offline</Badge>
      </div>
    </div>
  ),
};

export const CountBadges: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <div className='relative'>
        <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
          <svg
            className='w-6 h-6 text-gray-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM15 7h5l-5 5v-5zM9 7H4l5 5v-5z'
            />
          </svg>
        </div>
        <Badge variant='danger' size='sm' className='absolute -top-2 -right-2'>
          5
        </Badge>
      </div>
      <div className='relative'>
        <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
          <svg
            className='w-6 h-6 text-gray-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
            />
          </svg>
        </div>
        <Badge variant='success' size='sm' className='absolute -top-2 -right-2'>
          12
        </Badge>
      </div>
    </div>
  ),
};
