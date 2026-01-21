import React, { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface IOSCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const IOSCard: React.FC<IOSCardProps> = ({
  children,
  className,
  hoverable = false,
  onClick,
}) => (
  <div
    className={cn(
      'bg-white dark:bg-gray-800',
      'rounded-ios-lg',
      'shadow-ios-md',
      'overflow-hidden',
      'transition-all duration-200',
      hoverable && 'hover:shadow-ios-lg active:scale-[0.98]',
      onClick && 'cursor-pointer',
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

interface IOSCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const IOSCardHeader: React.FC<IOSCardHeaderProps> = ({ children, className }) => (
  <div className={cn('px-4 py-3', 'border-b border-gray-200 dark:border-gray-700', className)}>
    {children}
  </div>
);

interface IOSCardBodyProps {
  children: ReactNode;
  className?: string;
}

export const IOSCardBody: React.FC<IOSCardBodyProps> = ({ children, className }) => (
  <div className={cn('p-4', className)}>{children}</div>
);
