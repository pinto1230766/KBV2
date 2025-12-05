import { useState, useEffect, useCallback } from 'react';

interface OfflineData<T> {
  data: T | null;
  timestamp: number;
}

export const useOfflineMode = <T,>(key: string, fetchData: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Charger les données du cache
  const loadFromCache = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(`offline_${key}`);
      if (cached) {
        const offlineData: OfflineData<T> = JSON.parse(cached);
        return offlineData.data;
      }
    } catch (err) {
      console.error('Error loading from cache:', err);
    }
    return null;
  }, [key]);

  // Sauvegarder dans le cache
  const saveToCache = useCallback((data: T) => {
    try {
      const offlineData: OfflineData<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(`offline_${key}`, JSON.stringify(offlineData));
    } catch (err) {
      console.error('Error saving to cache:', err);
    }
  }, [key]);

  // Charger les données
  const loadData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isOnline || forceRefresh) {
        // Essayer de charger depuis le réseau
        const freshData = await fetchData();
        setData(freshData);
        saveToCache(freshData);
      } else {
        // Charger depuis le cache si hors ligne
        const cachedData = loadFromCache();
        if (cachedData) {
          setData(cachedData);
        } else {
          throw new Error('No cached data available');
        }
      }
    } catch (err) {
      setError(err as Error);
      // Essayer de charger depuis le cache en cas d'erreur
      const cachedData = loadFromCache();
      if (cachedData) {
        setData(cachedData);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, fetchData, loadFromCache, saveToCache]);

  // Écouter les changements de connexion
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      loadData(true); // Rafraîchir quand on revient en ligne
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadData]);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    isOnline,
    isLoading,
    error,
    refresh: () => loadData(true),
  };
};
