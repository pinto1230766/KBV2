import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function useDataCache<T>(
  fetcher: () => Promise<T> | T,
  options: CacheOptions = {}
) {
  const { ttl = DEFAULT_TTL, key } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const fetchData = useCallback(async (force = false) => {
    const now = Date.now();
    
    // Si on a des données en cache valides et qu'on ne force pas le rechargement
    if (!force && data && now - lastUpdated < ttl) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      setLastUpdated(now);
      
      // Sauvegarder dans le cache local si une clé est fournie
      if (key) {
        localStorage.setItem(`cache_${key}`, JSON.stringify({
          data: result,
          timestamp: now
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur de chargement'));
      console.error('Cache fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, ttl, key, data, lastUpdated]);

  // Initialisation depuis le localStorage si disponible
  useEffect(() => {
    if (key) {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        try {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < ttl) {
            setData(cachedData);
            setLastUpdated(timestamp);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Invalid cache data', e);
        }
      }
    }
    
    fetchData();
  }, [key, ttl, fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh: () => fetchData(true),
    lastUpdated
  };
}
