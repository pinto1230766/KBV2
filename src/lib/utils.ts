/**
 * Utility functions for KBV Lyon application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and merges Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a style object with vendor prefixes for better browser compatibility
 */
export function createStyle(styles: Record<string, string | number>): React.CSSProperties {
  // Add any necessary vendor prefixes here
  const prefixedStyles: Record<string, string | number> = {};

  Object.entries(styles).forEach(([key, value]) => {
    // Handle specific properties that need prefixes
    switch (key) {
      case 'userSelect':
        prefixedStyles.WebkitUserSelect = value;
        prefixedStyles.MozUserSelect = value;
        prefixedStyles.msUserSelect = value;
        break;
      case 'transition':
        prefixedStyles.WebkitTransition = value;
        prefixedStyles.MozTransition = value;
        prefixedStyles.msTransition = value;
        break;
      default:
        prefixedStyles[key] = value;
    }
  });

  return prefixedStyles as React.CSSProperties;
}

/**
 * Formats a date to a localized string
 */
export function formatDate(date: Date | string | number): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 */
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return `${str.substring(0, length)}...`;
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generates a unique ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Checks if the current device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

/**
 * Converts a string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
