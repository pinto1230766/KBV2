import { useState, useEffect } from 'react';

/**
 * Hook pour dévaluer une valeur avec un délai
 * Utile pour les recherches et les filtres pour éviter trop de rendus
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
