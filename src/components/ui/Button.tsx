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
    'inline-flex items-center justify-center font-semibold rounded-bento-md shadow-bento-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bento-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';

  const variants = {
    primary: 'bg-bento-primary text-white hover:bg-bento-secondary shadow-bento-accent',
    secondary:
      'bg-white/80 text-bento-slate border border-white/40 hover:bg-white dark:bg-bento-surface-dark/80 dark:text-white/90 dark:border-white/10',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 shadow-bento-sm',
    ghost:
      'text-bento-muted hover:text-bento-slate hover:bg-bento-glass dark:hover:bg-white/10 dark:text-white/70',
    outline:
      'border border-bento-primary text-bento-primary hover:bg-bento-glass',
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
