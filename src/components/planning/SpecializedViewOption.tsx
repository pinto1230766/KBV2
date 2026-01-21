import React from 'react';
import { cn } from '@/utils/cn';

interface SpecializedViewOptionProps {
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
}

export const SpecializedViewOption: React.FC<SpecializedViewOptionProps> = ({
  label,
  desc,
  icon: Icon,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors group',
      isActive
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
    )}
  >
    <div
      className={cn(
        'p-2 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors',
        isActive ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-800'
      )}
    >
      <Icon className='w-4 h-4' />
    </div>
    <div className='text-left'>
      <div className='font-bold text-xs uppercase tracking-tight'>{label}</div>
      <div className='text-[10px] text-gray-500 dark:text-gray-400 mt-0.5'>{desc}</div>
    </div>
  </button>
);
