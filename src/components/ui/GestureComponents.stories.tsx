import type { Meta, StoryObj } from '@storybook/react';
import { SwipeableRow } from './GestureComponents';
import { Trash2, Edit, Archive } from 'lucide-react';

const meta: Meta<typeof SwipeableRow> = {
  title: 'UI/GestureComponents',
  component: SwipeableRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleActions = [
  {
    id: 'delete',
    icon: Trash2,
    label: 'Supprimer',
    color: 'bg-red-500',
    action: () => alert('Supprimé!'),
  },
  {
    id: 'edit',
    icon: Edit,
    label: 'Modifier',
    color: 'bg-blue-500',
    action: () => alert('Édition'),
  },
  {
    id: 'archive',
    icon: Archive,
    label: 'Archiver',
    color: 'bg-gray-500',
    action: () => alert('Archivé'),
  },
];

export const Default: Story = {
  args: {
    actions: sampleActions,
    children: (
      <div className='p-4 bg-white dark:bg-gray-800 rounded-lg'>
        <h3 className='font-semibold'>Glissez vers la gauche</h3>
        <p className='text-sm text-gray-600 dark:text-gray-400'>Pour afficher les actions</p>
      </div>
    ),
  },
};

export const SingleAction: Story = {
  args: {
    actions: [sampleActions[0]],
    children: (
      <div className='p-4 bg-white dark:bg-gray-800 rounded-lg'>
        <h3 className='font-semibold'>Action unique</h3>
        <p className='text-sm text-gray-600 dark:text-gray-400'>Glissez pour supprimer</p>
      </div>
    ),
  },
};

export const WithList: Story = {
  render: () => (
    <div className='space-y-2'>
      {['Item 1', 'Item 2', 'Item 3'].map((item) => (
        <SwipeableRow key={item} actions={sampleActions}>
          <div className='p-4 bg-white dark:bg-gray-800 rounded-lg'>
            <p className='font-medium'>{item}</p>
          </div>
        </SwipeableRow>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    actions: sampleActions,
    disabled: true,
    children: (
      <div className='p-4 bg-gray-100 dark:bg-gray-700 rounded-lg'>
        <h3 className='font-semibold text-gray-400'>Désactivé</h3>
        <p className='text-sm text-gray-500'>Le swipe est désactivé</p>
      </div>
    ),
  },
};
