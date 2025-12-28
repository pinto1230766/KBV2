import type { Meta, StoryObj } from '@storybook/react';
import { AdvancedStats } from './AdvancedStats';

const meta = {
  title: 'Dashboard/AdvancedStats',
  component: AdvancedStats,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdvancedStats>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockStats = {
  totalVisits: 156,
  completedVisits: 142,
  pendingVisits: 14,
  totalSpeakers: 45,
  activeSpeakers: 38,
  totalMessages: 89,
  monthlyGrowth: 12.5,
};

export const Default: Story = {
  args: {
    stats: mockStats,
  },
};

export const WithPositiveTrend: Story = {
  args: {
    stats: {
      ...mockStats,
      monthlyGrowth: 25.8,
    },
  },
};

export const WithNegativeTrend: Story = {
  args: {
    stats: {
      ...mockStats,
      monthlyGrowth: -5.2,
    },
  },
};

export const HighActivity: Story = {
  args: {
    stats: {
      totalVisits: 500,
      completedVisits: 475,
      pendingVisits: 25,
      totalSpeakers: 120,
      activeSpeakers: 98,
      totalMessages: 340,
      monthlyGrowth: 45.3,
    },
  },
};

export const LowActivity: Story = {
  args: {
    stats: {
      totalVisits: 12,
      completedVisits: 10,
      pendingVisits: 2,
      totalSpeakers: 8,
      activeSpeakers: 6,
      totalMessages: 5,
      monthlyGrowth: -2.1,
    },
  },
};