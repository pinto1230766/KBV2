import type { Meta, StoryObj } from '@storybook/react';
import { VisitCard } from './VisitCard';
import { Visit } from '@/types';

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

const mockVisit: Visit = {
  id: 'speaker-1',
  visitId: 'visit-1',
  nom: 'John Doe',
  congregation: 'Lyon Centre',
  visitDate: '2025-01-20',
  visitTime: '14:00',
  host: 'Marie Dupont',
  accommodation: 'Host family',
  meals: 'Provided',
  status: 'confirmed' as const,
  locationType: 'physical' as const,
  talkNoOrType: '1',
  talkTheme: 'Amour chrétien',
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
      status: 'confirmed',
    },
  },
};

export const Pending: Story = {
  args: {
    visit: {
      ...mockVisit,
      status: 'pending',
    },
  },
};

export const Cancelled: Story = {
  args: {
    visit: {
      ...mockVisit,
      status: 'cancelled',
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
    },
  },
};

export const FullDetails: Story = {
  args: {
    visit: {
      ...mockVisit,
      notes: 'Discours important',
      telephone: '+33 6 12 34 56 78',
      talkTheme: "L'amour de Jéhovah",
      congregation: 'Lyon Sud',
    },
  },
};
