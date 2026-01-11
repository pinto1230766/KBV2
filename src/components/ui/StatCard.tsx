import React, { memo } from 'react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  colorClasses: {
    bg: string;
    text: string;
    iconBg: string;
  };
}

/**
 * Premium Stat Card - Carte de statistique stylisée avec icône et effet de luminosité
 * Utilisé dans Planning et potentiellement d'autres pages
 */
export const StatCard = memo<StatCardProps>(({ icon: Icon, value, label, colorClasses }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]',
      colorClasses.bg
    )}
  >
    <div className='relative z-10'>
      <div className='flex items-center justify-between'>
        <div>
          <p className={cn('text-3xl font-black tracking-tight', colorClasses.text)}>{value}</p>
          <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mt-1'>{label}</p>
        </div>
        <div className={cn('p-3 rounded-xl', colorClasses.iconBg)}>
          <Icon className={cn('w-6 h-6', colorClasses.text)} />
        </div>
      </div>
    </div>
    <div
      className={cn(
        'absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10',
        colorClasses.text,
        'bg-current blur-2xl'
      )}
    />
  </div>
));

StatCard.displayName = 'StatCard';
