import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { useState } from 'react';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper pour gérer l'état
const ModalWithState = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Ouvrir Modal</button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export const Default: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Modal par défaut',
    children: <p>Contenu de la modal</p>,
  },
};

export const WithLongContent: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Modal avec beaucoup de contenu',
    children: (
      <div>
        <p>Premier paragraphe de contenu.</p>
        <p>Deuxième paragraphe de contenu.</p>
        <p>Troisième paragraphe de contenu.</p>
        <p>Quatrième paragraphe de contenu.</p>
        <p>Cinquième paragraphe de contenu.</p>
        <p>Sixième paragraphe de contenu.</p>
      </div>
    ),
  },
};

export const WithForm: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Formulaire',
    children: (
      <form className='space-y-4'>
        <div>
          <label className='block mb-2'>Nom</label>
          <input type='text' className='w-full p-2 border rounded' />
        </div>
        <div>
          <label className='block mb-2'>Email</label>
          <input type='email' className='w-full p-2 border rounded' />
        </div>
        <button type='submit' className='btn-primary'>
          Envoyer
        </button>
      </form>
    ),
  },
};

export const Small: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Petite modal',
    size: 'sm',
    children: <p>Confirmation requise</p>,
  },
};

export const Large: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Grande modal',
    size: 'lg',
    children: <p>Beaucoup d'espace pour du contenu</p>,
  },
};
