import React from 'react';
import { Loader2 } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold?: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullDistance,
  isRefreshing,
  threshold = 80,
}) => {
  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const opacity = Math.min(pullDistance / threshold, 1);

  if (pullDistance === 0 && !isRefreshing) return null;

  // Utiliser les variables CSS pour éviter les styles inline
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      '--ptr-transform',
      `translateY(${isRefreshing ? '60px' : `${pullDistance}px`})`
    );
    root.style.setProperty('--ptr-opacity', isRefreshing ? '1' : opacity.toString());
  }, [pullDistance, isRefreshing, opacity]);

  return (
    <div className='pull-refresh-indicator fixed top-0 left-0 right-0 flex justify-center items-center z-50 transition-all duration-200'>
      <div className='bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg'>
        {isRefreshing ? (
          <Loader2 className='w-6 h-6 text-ios-blue animate-spin' />
        ) : (
          <div className='relative w-6 h-6'>
            <svg className='w-6 h-6 transform -rotate-90' viewBox='0 0 24 24'>
              <circle
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='2'
                fill='none'
                className='text-gray-200 dark:text-gray-700'
              />
              <circle
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='2'
                fill='none'
                strokeDasharray={`${2 * Math.PI * 10}`}
                strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
                className='text-ios-blue transition-all duration-200'
                strokeLinecap='round'
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
