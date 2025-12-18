import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { SatisfactionMetrics } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SatisfactionChartProps {
  metrics: SatisfactionMetrics;
  periodLabel: string;
}

export const SatisfactionChart: React.FC<SatisfactionChartProps> = ({ metrics, periodLabel }) => {
  const data = [
    { name: 'Orateurs', score: metrics.averageSpeakerRating, color: '#8b5cf6' }, // Violet
    { name: 'Accueil', score: metrics.averageHostRating, color: '#10b981' }, // Vert
    { name: 'Organisation', score: metrics.averageOrganizationRating, color: '#f59e0b' }, // Orange
  ];

  const getTrendIcon = () => {
    switch (metrics.trendDirection) {
      case 'up':
        return <TrendingUp className='w-4 h-4 text-green-500' />;
      case 'down':
        return <TrendingDown className='w-4 h-4 text-red-500' />;
      default:
        return <Minus className='w-4 h-4 text-gray-500' />;
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div className='space-y-1'>
          <h3 className='font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
            <Star className='w-5 h-5 text-yellow-500' />
            Satisfaction {periodLabel}
          </h3>
          <p className='text-sm text-gray-500'>Basé sur {metrics.totalFeedbacks} avis</p>
        </div>
        <div className='flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700'>
          <span className='text-xs font-medium text-gray-600 dark:text-gray-300'>Tendance</span>
          {getTrendIcon()}
        </div>
      </CardHeader>
      <CardBody>
        <div className='h-[200px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              layout='vertical'
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' horizontal={false} stroke='#E5E7EB' />
              <XAxis type='number' domain={[0, 5]} hide />
              <YAxis
                type='category'
                dataKey='name'
                tick={{ fill: '#6B7280', fontSize: 12 }}
                width={80}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar dataKey='score' radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='mt-4 grid grid-cols-3 gap-2 text-center'>
          {data.map((item) => (
            <div
              key={item.name}
              className='flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50'
            >
              <span className='text-xs text-gray-500 mb-1'>{item.name}</span>
              <span className='text-lg font-bold text-gray-900 dark:text-white'>
                {item.score.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
