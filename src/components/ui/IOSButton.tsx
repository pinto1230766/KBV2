import React from 'react';
import { cn } from '@/utils/cn';

interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const IOSButton: React.FC<IOSButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-ios-md
    transition-all duration-200
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const variantStyles = {
    primary: `
      bg-ios-blue text-white
      hover:bg-[#0051D5]
      focus:ring-ios-blue
      shadow-ios-sm
    `,
    secondary: `
      bg-gray-200 dark:bg-gray-700
      text-gray-900 dark:text-white
      hover:bg-gray-300 dark:hover:bg-gray-600
      focus:ring-gray-400
    `,
    danger: `
      bg-ios-red text-white
      hover:bg-[#CC2E26]
      focus:ring-ios-red
      shadow-ios-sm
    `,
    ghost: `
      bg-transparent text-ios-blue
      hover:bg-gray-100 dark:hover:bg-gray-800
      focus:ring-ios-blue
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-ios-body',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className='mr-2'>{leftIcon}</span>}
      {children}
      {rightIcon && <span className='ml-2'>{rightIcon}</span>}
    </button>
  );
};
