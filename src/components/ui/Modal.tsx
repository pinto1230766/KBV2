import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  footer?: React.ReactNode;
  className?: string; // Additional classes for the modal container
  hideCloseButton?: boolean; // Option to hide the default close button
  padding?: 'none' | 'default'; // Control internal padding
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  className = '',
  hideCloseButton = false,
  padding = 'default',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    '3xl': 'max-w-6xl',
    '4xl': 'max-w-7xl',
    full: 'max-w-full m-4 h-[calc(100vh-2rem)]',
  };

  const content = (
    <>
      <div
        className='fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-50'
        onClick={onClose}
        aria-hidden='true'
      />
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
        <div
          ref={modalRef}
          className={`
            bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-h-[80vh] flex flex-col
            transition-all duration-200 scale-100 opacity-100
            ${sizes[size]}
            ${className}
          `}
          role='dialog'
          aria-modal='true'
        >
        {!hideCloseButton && (
          <div
            className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0 ${title ? '' : 'justify-end border-none pb-0'}`}
          >
            {title && (
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>{title}</h3>
            )}
            <button
              onClick={onClose}
              aria-label='Fermer'
              className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        )}

        <div
          className={`${padding === 'none' ? 'p-0' : 'px-6 py-4'} overflow-y-auto custom-scrollbar grow`}
        >
          {children}
        </div>

        {footer && (
          <div className='px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 rounded-b-xl shrink-0 flex justify-end gap-3'>
            {footer}
          </div>
        )}
      </div>
    </div>
  </>
  );

  return createPortal(content, document.body);
};
