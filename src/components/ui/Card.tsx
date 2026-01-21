import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => (
  <div
    className={`
        relative rounded-bento-lg border border-white/30 dark:border-white/5
        bg-bento-surface dark:bg-bento-surface-dark/95 backdrop-blur-bento
        shadow-bento-md transition-all duration-300
        ${hoverable || onClick ? 'hover:shadow-bento-lg hover:-translate-y-1.5 active:scale-[0.99] cursor-pointer' : ''}
        ${className}
      `}
    onClick={onClick}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-4 border-b border-gray-100 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`p-6 ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 rounded-b-xl ${className}`}
  >
    {children}
  </div>
);
