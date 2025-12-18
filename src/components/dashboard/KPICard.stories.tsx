/**
 * Story pour le composant KPICard (Key Performance Indicator)
 * KBV Lyon - Documentation des composants Dashboard
 */

import type { Meta, StoryObj } from '@storybook/react';
import { KPICard } from './AdvancedStats';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';

// Configuration metadata
const meta: Meta<typeof KPICard> = {
  title: 'Components/Dashboard/KPICard',
  component: KPICard,
  parameters: {
    docs: {
      description: {
        component:
          'KPICard affiche un indicateur clé de performance avec sa valeur, tendance et objectif.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    kpi: {
      control: 'object',
      description: "Configuration de l'indicateur",
    },
    onToggleVisibility: {
      action: 'Toggle Visibility',
      description: 'Handler pour masquer/afficher le widget',
    },
    compact: {
      control: 'boolean',
      description: 'Mode compact pour les listes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Données d'exemple
const sampleKPIs = {
  visits: {
    id: 'total-visits',
    label: 'Visites ce mois',
    value: 12,
    previousValue: 8,
    target: 15,
    format: 'number' as const,
    icon: Calendar,
    color: 'text-blue-600',
  },
  speakers: {
    id: 'active-speakers',
    label: 'Orateurs actifs',
    value: 24,
    format: 'number' as const,
    icon: Users,
    color: 'text-purple-600',
  },
  confirmationRate: {
    id: 'confirmation-rate',
    label: 'Taux de confirmation',
    value: 87.5,
    previousValue: 82.1,
    format: 'percentage' as const,
    icon: CheckCircle,
    color: 'text-green-600',
  },
  pendingActions: {
    id: 'pending-actions',
    label: 'Actions en attente',
    value: 5,
    previousValue: 2,
    target: 0,
    format: 'number' as const,
    icon: Clock,
    color: 'text-red-600',
  },
};

// Stories
export const Default: Story = {
  args: {
    kpi: sampleKPIs.visits,
  },
};

export const WithTrend: Story = {
  args: {
    kpi: sampleKPIs.confirmationRate,
  },
};

export const WithTarget: Story = {
  args: {
    kpi: sampleKPIs.visits,
  },
};

export const Compact: Story = {
  args: {
    kpi: sampleKPIs.speakers,
    compact: true,
  },
};

export const LoadingState: Story = {
  args: {
    kpi: {
      ...sampleKPIs.visits,
      value: 0,
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl'>
      <KPICard kpi={sampleKPIs.visits} />
      <KPICard kpi={sampleKPIs.confirmationRate} />
      <KPICard kpi={sampleKPIs.speakers} />
      <KPICard kpi={sampleKPIs.pendingActions} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Vue d'ensemble de toutes les variantes de KPICard.",
      },
    },
  },
};

export const TrendsOnly: Story = {
  render: () => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl'>
      <KPICard kpi={sampleKPIs.visits} />
      <KPICard kpi={sampleKPIs.confirmationRate} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'KPI avec calcul automatique des tendances.',
      },
    },
  },
};

export const Objectives: Story = {
  render: () => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl'>
      <KPICard
        kpi={{
          ...sampleKPIs.visits,
          value: 18,
          target: 15,
        }}
      />
      <KPICard
        kpi={{
          ...sampleKPIs.pendingActions,
          value: 0,
          target: 0,
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'KPI avec objectifs atteints et barres de progression.',
      },
    },
  },
};

export const Interactive: Story = {
  render: (args) => (
    <div className='space-y-4'>
      <p className='text-sm text-gray-600'>
        Cliquez sur l'icône 👁️ pour masquer/afficher le widget
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl'>
        <KPICard
          {...args}
          kpi={sampleKPIs.visits}
          onToggleVisibility={(id) => console.log('Toggle visibility:', id)}
        />
        <KPICard
          {...args}
          kpi={sampleKPIs.confirmationRate}
          onToggleVisibility={(id) => console.log('Toggle visibility:', id)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'KPICard interactifs avec gestion de visibilité.',
      },
    },
  },
};

// Story responsive
export const Responsive: Story = {
  render: () => (
    <div className='space-y-8'>
      {/* Mobile */}
      <div className='block lg:hidden'>
        <h3 className='text-lg font-semibold mb-4'>Vue Mobile</h3>
        <div className='space-y-3'>
          <KPICard kpi={sampleKPIs.visits} compact />
          <KPICard kpi={sampleKPIs.confirmationRate} compact />
        </div>
      </div>

      {/* Desktop */}
      <div className='hidden lg:block'>
        <h3 className='text-lg font-semibold mb-4'>Vue Desktop</h3>
        <div className='grid grid-cols-2 gap-4'>
          <KPICard kpi={sampleKPIs.visits} />
          <KPICard kpi={sampleKPIs.confirmationRate} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Adaptation du layout selon la taille d'écran.",
      },
    },
  },
};
