import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Skeleton pour une carte de visite
export const VisitCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
    <div className="flex items-start gap-3 mb-3">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </div>
      <Skeleton width={60} height={24} className="rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton width="80%" />
      <Skeleton width="70%" />
      <Skeleton width="50%" />
    </div>
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
      <Skeleton width="100%" height={8} className="rounded-full" />
    </div>
  </div>
);

// Skeleton pour une carte statistique
export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" />
        <Skeleton width="60%" height={28} />
        <Skeleton width="50%" />
      </div>
    </div>
  </div>
);

// Skeleton pour un graphique
export const ChartSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
    <div className="mb-4">
      <Skeleton width="40%" height={24} />
    </div>
    <Skeleton variant="rectangular" width="100%" height={300} />
  </div>
);

// Skeleton pour une liste
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" />
          <Skeleton width="50%" />
        </div>
      </div>
    ))}
  </div>
);
