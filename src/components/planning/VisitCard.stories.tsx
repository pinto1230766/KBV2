import type { Meta, StoryObj } from '@storybook/react';
import { VisitCard } from './VisitCard';

const meta = {
  title: 'Planning/VisitCard',
  component: VisitCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof VisitCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockVisit = {
  id: '1',
  nom: 'John Doe',
  date: '2025-01-20',
  heure: '14:00',
  congregation: 'Lyon Centre',
  statut: 'confirmed' as const,
  type: 'discourse' as const,
};

export const Default: Story = {
  args: {
    visit: mockVisit,
  },
};

export const Confirmed: Story = {
  args: {
    visit: {
      ...mockVisit,
      statut: 'confirmed',
    },
  },
};

export const Pending: Story = {
  args: {
    visit: {
      ...mockVisit,
      statut: 'pending',
    },
  },
};

export const Cancelled: Story = {
  args: {
    visit: {
      ...mockVisit,
      statut: 'cancelled',
    },
  },
};

export const WithNotes: Story = {
  args: {
    visit: {
      ...mockVisit,
      notes: "Discours spécial sur l'amour chrétien. Prévoir projecteur.",
    },
  },
};

export const WithContactInfo: Story = {
  args: {
    visit: {
      ...mockVisit,
      telephone: '+33 6 12 34 56 78',
      email: 'john.doe@example.com',
    },
  },
};

export const FullDetails: Story = {
  args: {
    visit: {
      ...mockVisit,
      notes: 'Discours important',
      telephone: '+33 6 12 34 56 78',
      email: 'john.doe@example.com',
      theme: "L'amour de Jéhovah",
      congregation: 'Lyon Sud',
    },
  },
};
