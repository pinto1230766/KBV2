import type { Meta, StoryObj } from '@storybook/react';
import { Autocomplete } from './Autocomplete';
import { useState } from 'react';

const meta: Meta<typeof Autocomplete> = {
  title: 'UI/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4' },
  { value: '5', label: 'Option 5' },
];

const sampleSpeakers = [
  { value: 'john', label: 'John Doe' },
  { value: 'jane', label: 'Jane Smith' },
  { value: 'bob', label: 'Bob Johnson' },
  { value: 'alice', label: 'Alice Williams' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | number>('');
    return (
      <div className='w-80'>
        <Autocomplete
          options={sampleOptions}
          value={value}
          onChange={setValue}
          placeholder='Sélectionnez une option'
        />
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState<string | number>('');
    return (
      <div className='w-80'>
        <Autocomplete
          options={sampleSpeakers}
          value={value}
          onChange={setValue}
          placeholder='Rechercher un orateur'
        />
      </div>
    );
  },
};

export const Required: Story = {
  render: () => {
    const [value, setValue] = useState<string | number>('');
    return (
      <div className='w-80'>
        <Autocomplete
          options={sampleOptions}
          value={value}
          onChange={setValue}
          placeholder='Champ requis'
          required
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <div className='w-80'>
        <Autocomplete options={sampleOptions} value='1' onChange={() => {}} disabled />
      </div>
    );
  },
};
