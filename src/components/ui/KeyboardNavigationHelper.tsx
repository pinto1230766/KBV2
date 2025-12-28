/**
 * Utilitaire pour améliorer la navigation clavier dans les composants
 */
import React, { useEffect, useCallback } from 'react';

// Hook pour gérer la navigation par tabulation
export const useKeyboardNavigation = (
  items: any[],
  onSelect: (index: number) => void,
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
  } = {}
) => {
  const { loop = false, orientation = 'vertical' } = options;
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!items.length) return;

    switch (e.key) {
      case 'ArrowDown':
        if (orientation === 'vertical') {
          e.preventDefault();
          setFocusedIndex(prev => {
            if (prev < items.length - 1) return prev + 1;
            if (loop) return 0;
            return prev;
          });
        }
        break;
      
      case 'ArrowUp':
        if (orientation === 'vertical') {
          e.preventDefault();
          setFocusedIndex(prev => {
            if (prev > 0) return prev - 1;
            if (loop) return items.length - 1;
            return prev;
          });
        }
        break;
      
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          e.preventDefault();
          setFocusedIndex(prev => {
            if (prev < items.length - 1) return prev + 1;
            if (loop) return 0;
            return prev;
          });
        }
        break;
      
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          e.preventDefault();
          setFocusedIndex(prev => {
            if (prev > 0) return prev - 1;
            if (loop) return items.length - 1;
            return prev;
          });
        }
        break;
      
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      
      case 'End':
        e.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
      
      case 'Enter':
      case ' ':
        if (focusedIndex >= 0) {
          e.preventDefault();
          onSelect(focusedIndex);
        }
        break;
      
      case 'Escape':
        setFocusedIndex(-1);
        break;
    }
  }, [items, focusedIndex, loop, orientation, onSelect]);

  // Reset focus when items change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [items]);

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    getItemProps: (index: number) => ({
      'data-focused': focusedIndex === index,
      tabIndex: focusedIndex === index ? 0 : -1,
      'aria-selected': focusedIndex === index,
      onKeyDown: handleKeyDown,
    }),
  };
};

// Composant pour gérer les listes cliquables au clavier
interface KeyboardListProps<T> {
  items: T[];
  renderItem: (item: T, index: number, props: any) => React.ReactNode;
  onSelect: (item: T, index: number) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  getItemKey?: (item: T, index: number) => string;
}

export function KeyboardList<T>({
  items,
  renderItem,
  onSelect,
  className = '',
  orientation = 'vertical',
  loop = false,
  getItemKey = ((_, index) => index.toString()),
}: KeyboardListProps<T>) {
  const { handleKeyDown, getItemProps } = useKeyboardNavigation(
    items,
    (index) => onSelect(items[index], index),
    { loop, orientation }
  );

  return (
    <div
      role="listbox"
      className={className}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {items.map((item, index) => (
        <div key={getItemKey(item, index)} role="option">
          {renderItem(item, index, getItemProps(index))}
        </div>
      ))}
    </div>
  );
}

// Composant pour les menus déroulants avec navigation clavier
interface KeyboardMenuProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'bottom' | 'top' | 'left' | 'right';
}

export function KeyboardMenu({
  isOpen,
  onClose,
  trigger,
  children,
  position = 'bottom',
}: KeyboardMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus first focusable element when menu opens
      const firstFocusable = menuRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
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

  if (!isOpen) return <>{trigger}</>;

  return (
    <div className="relative inline-block">
      {trigger}
      <div
        ref={menuRef}
        className={`absolute z-50 ${
          position === 'bottom' ? 'top-full mt-1' :
          position === 'top' ? 'bottom-full mb-1' :
          position === 'left' ? 'right-full mr-1' :
          'left-full ml-1'
        } min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg`}
        role="menu"
        aria-orientation="vertical"
      >
        {children}
      </div>
    </div>
  );
}

// Utilitaire pour gérer les skip links (liens d'évitement)
export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {children}
    </a>
  );
}