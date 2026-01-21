import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stories de base
export const Default: Story = {
  args: {
    className: 'w-48 h-4',
  },
};

export const TextLines: Story = {
  render: () => (
    <div className='space-y-2 w-64'>
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-3/4' />
      <Skeleton className='h-4 w-1/2' />
    </div>
  ),
};

export const Avatar: Story = {
  args: {
    className: 'w-12 h-12 rounded-full',
  },
};

export const Card: Story = {
  render: () => (
    <div className='space-y-4 w-80'>
      <Skeleton className='h-32 w-full rounded-lg' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
      </div>
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div className='space-y-3 w-64'>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className='flex items-center space-x-3'>
          <Skeleton className='w-10 h-10 rounded-full' />
          <div className='space-y-2 flex-1'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const DashboardCard: Story = {
  render: () => (
    <div className='grid grid-cols-2 gap-4 w-96'>
      <div className='p-6 bg-white dark:bg-gray-800 rounded-lg border space-y-3'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-8 w-16' />
        <Skeleton className='h-3 w-20' />
      </div>
      <div className='p-6 bg-white dark:bg-gray-800 rounded-lg border space-y-3'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-8 w-20' />
        <Skeleton className='h-3 w-16' />
      </div>
    </div>
  ),
};

export const Table: Story = {
  render: () => (
    <div className='space-y-2 w-full max-w-2xl'>
      {/* Header */}
      <div className='flex space-x-4'>
        <Skeleton className='h-6 w-1/4' />
        <Skeleton className='h-6 w-1/4' />
        <Skeleton className='h-6 w-1/4' />
        <Skeleton className='h-6 w-1/4' />
      </div>
      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className='flex space-x-4'>
          <Skeleton className='h-4 w-1/4' />
          <Skeleton className='h-4 w-1/4' />
          <Skeleton className='h-4 w-1/4' />
          <Skeleton className='h-4 w-1/4' />
        </div>
      ))}
    </div>
  ),
};

export const Profile: Story = {
  render: () => (
    <div className='flex items-center space-x-4 w-80'>
      <Skeleton className='w-16 h-16 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-4 w-48' />
        <Skeleton className='h-4 w-24' />
      </div>
    </div>
  ),
};
