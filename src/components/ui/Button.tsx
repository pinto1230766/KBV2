import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean; // Added asChild prop
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      asChild,
      ...props
    },
    ref
  ) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary:
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
    ghost:
      'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
    outline:
      'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const buttonContent = (
    <>
      {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
      {!isLoading && leftIcon && <span className='mr-2'>{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className='ml-2'>{rightIcon}</span>}
    </>
  );

  const mergedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (asChild) {
    // If asChild is true, render the child and pass props to it.
    // Assuming children is a single React element.
    if (React.isValidElement(children)) {
      return React.cloneElement(
        children,
        {
          className: `${children.props.className || ''} ${mergedClassName}`,
          ...props,
          disabled: disabled || isLoading,
        },
        buttonContent
      );
    }
    // Fallback if children is not a valid element (e.g., just text)
    return (
      <span className={mergedClassName} {...props}>
        {buttonContent}
      </span>
    );
  }

    return (
      <button ref={ref} className={mergedClassName} disabled={disabled || isLoading} {...props}>
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';
