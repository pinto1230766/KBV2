import React from 'react';
import { cn } from '@/utils/cn';
import { LazyImage } from './LazyImage';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackClassName?: string;
  zoomable?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const fallbackColors = {
  speaker: 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300',
  host: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  default: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className,
  fallbackClassName,
  zoomable = false,
  ...props
}) => {
  const sizeClass = sizeClasses[size];
  const fallbackColor = fallbackClassName || fallbackColors.default;

  if (src) {
    if (zoomable) {
      return (
        <div
          className={cn(
            'rounded-full overflow-hidden',
            sizeClass,
            className
          )}
          {...props}
        >
          <LazyImage
            src={src}
            alt={alt || name || 'Avatar'}
            zoomable={true}
            zoomScale={2}
            aspectRatio='1'
            fallback='/avatar-placeholder.jpg'
            className='w-full h-full'
            onError={() => {
              // Fallback to letter avatar if image fails to load
              // This would be handled by parent component
            }}
          />
        </div>
      );
    }

    return (
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center',
          sizeClass,
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className='w-full h-full object-cover'
          onError={(e) => {
            // Fallback to letter avatar if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.className = cn(
                'rounded-full overflow-hidden flex items-center justify-center font-bold',
                sizeClass,
                fallbackColor
              );
              parent.textContent = name ? name.charAt(0).toUpperCase() : '?';
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden flex items-center justify-center font-bold',
        sizeClass,
        fallbackColor,
        className
      )}
      {...props}
    >
      {name ? name.charAt(0).toUpperCase() : '?'}
    </div>
  );
};
