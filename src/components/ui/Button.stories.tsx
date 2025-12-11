/**
 * Story pour le composant Button
 * KBV Lyon - Documentation des composants
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// Configuration metadata du composant
const meta: Meta<typeof Button> = {
  title: 'Components/UI/Button',
  component: Button,
  parameters: {
    // Documentation du composant
    docs: {
      description: {
        component: 'Le composant Button est utilisé pour déclencher des actions dans l\'interface utilisateur. Il supporte plusieurs variantes et états.',
      },
    },
    // Configuration du layout pour les stories
    layout: 'centered',
  },
  tags: ['autodocs'],
  // Contrôles pour les props
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Variante visuelle du bouton'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Taille du bouton'
    },
    disabled: {
      control: 'boolean',
      description: 'État désactivé du bouton'
    },
    isLoading: {
      control: 'boolean',
      description: 'État de chargement du bouton'
    },
    children: {
      control: 'text',
      description: 'Contenu du bouton'
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stories par défaut
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

// Stories pour les variantes
export const Primary: Story = {
  args: {
    children: 'Bouton Principal',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Bouton Secondaire',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Bouton Outline',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Bouton Ghost',
    variant: 'ghost',
  },
};

export const Danger: Story = {
  args: {
    children: 'Bouton Danger',
    variant: 'danger',
  },
};

// Stories pour les tailles
export const Small: Story = {
  args: {
    children: 'Petit Bouton',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Bouton Moyen',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Grand Bouton',
    size: 'lg',
  },
};

// Stories pour les états
export const Disabled: Story = {
  args: {
    children: 'Bouton Désactivé',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Chargement...',
    isLoading: true,
  },
};

// Story avec icône
export const WithIcon: Story = {
  args: {
    children: 'Bouton avec Icône',
    variant: 'primary',
  },
};

// Story pour les états interactifs
export const Interactive: Story = {
  render: (args) => (
    <div className="space-x-2">
      <Button {...args} onClick={() => console.log('Click!')}>
        Cliquer moi
      </Button>
      <Button {...args} variant="secondary" onClick={() => console.log('Secondary click!')}>
        Action Secondaire
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemple de boutons interactifs avec handlers de click.',
      },
    },
  },
};

// Story responsive
export const Responsive: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="block sm:hidden">
        <p className="text-sm text-gray-600 mb-2">Mobile (≤ 640px)</p>
        <Button size="sm" className="w-full">Bouton Mobile</Button>
      </div>
      <div className="hidden sm:block md:hidden">
        <p className="text-sm text-gray-600 mb-2">Tablet (641-768px)</p>
        <Button size="md" className="w-full">Bouton Tablet</Button>
      </div>
      <div className="hidden md:block">
        <p className="text-sm text-gray-600 mb-2">Desktop (≥ 769px)</p>
        <div className="space-x-2">
          <Button size="md">Bouton Desktop</Button>
          <Button size="md" variant="secondary">Action</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Boutons adaptatifs selon la taille d\'écran.',
      },
    },
  },
};
