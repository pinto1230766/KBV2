import type { Meta, StoryObj } from '@storybook/react';
import { HotkeysHelpModal } from './HotkeysHelpModal';
import { useState } from 'react';

const meta = {
  title: 'UI/HotkeysHelpModal',
  component: HotkeysHelpModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HotkeysHelpModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleHotkeys = [
  { key: 'ctrl+h', description: 'Accueil', category: 'navigation' as const },
  { key: 'ctrl+p', description: 'Planning', category: 'navigation' as const },
  { key: 'ctrl+m', description: 'Messages', category: 'navigation' as const },
  { key: 'ctrl+n', description: 'Nouvelle visite', category: 'actions' as const },
  { key: 'ctrl+s', description: 'Sauvegarder', category: 'actions' as const },
  { key: 'ctrl+k', description: 'Recherche globale', category: 'search' as const },
  { key: '/', description: 'Focus recherche', category: 'search' as const },
  { key: 'escape', description: 'Fermer modal', category: 'modals' as const },
  { key: 'shift+/', description: 'Afficher aide', category: 'general' as const },
];

const HotkeysDemo = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary"
      >
        Afficher les raccourcis
      </button>
      <HotkeysHelpModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <HotkeysDemo {...args} />,
  args: {
    hotkeys: sampleHotkeys,
  },
};

export const MinimalHotkeys: Story = {
  render: (args) => <HotkeysDemo {...args} />,
  args: {
    hotkeys: sampleHotkeys.slice(0, 3),
  },
};

export const ManyHotkeys: Story = {
  render: (args) => <HotkeysDemo {...args} />,
  args: {
    hotkeys: [
      ...sampleHotkeys,
      ...sampleHotkeys.map((h, i) => ({
        ...h,
        key: `alt+${i}`,
        description: `Action ${i}`,
      })),
    ],
  },
};