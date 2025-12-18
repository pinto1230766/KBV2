import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

  return (
    <div className='w-full'>
      {label && (
        <label
          htmlFor={inputId}
          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
        >
          {label}
        </label>
      )}
      <div className='relative'>
        {leftIcon && (
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200
            disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : 'pl-4'}
            ${rightIcon ? 'pr-10' : 'pr-4'}
            ${
              error
                ? 'border-danger-500 focus:ring-danger-500'
                : 'border-gray-300 dark:border-gray-600'
            }
            ${className}
            py-2
          `}
          {...props}
        />
        {rightIcon && (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 z-10'>
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className='mt-1 text-sm text-danger-600 dark:text-danger-400'>{error}</p>}
      {helperText && !error && (
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{helperText}</p>
      )}
    </div>
  );
};
