import type { Meta, StoryObj } from '@storybook/react';
import { useToast } from '@/contexts/ToastContext';

const meta = {
  title: 'UI/Toast',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

// Composant démo pour déclencher des toasts
const ToastDemo = () => {
  const { addToast } = useToast();

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold mb-4">Toast Notifications Demo</h2>
      
      <button
        onClick={() => addToast('Message envoyé avec succès', 'success', 3000)}
        className="btn-primary mr-2"
      >
        Success Toast
      </button>

      <button
        onClick={() => addToast('Une erreur est survenue', 'error', 5000)}
        className="bg-red-600 text-white px-4 py-2 rounded mr-2"
      >
        Error Toast
      </button>

      <button
        onClick={() => addToast('Attention, action importante', 'warning', 4000)}
        className="bg-orange-600 text-white px-4 py-2 rounded mr-2"
      >
        Warning Toast
      </button>

      <button
        onClick={() => addToast('Information utile', 'info', 3000)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Info Toast
      </button>
    </div>
  );
};

export const AllToastTypes: StoryObj = {
  render: () => <ToastDemo />,
};