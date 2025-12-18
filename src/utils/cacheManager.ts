import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { openDB } from 'idb';

// Configuration du cache global avec React Query
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Query Cache Error:', error);
      // Log errors to Sentry or other monitoring service
    },
    onSuccess: (data) => {
      console.log('Query Cache Success:', data);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Mutation Cache Error:', error);
    },
    onSuccess: (data) => {
      console.log('Mutation Cache Success:', data);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (anciennement cacheTime)
      retry: (failureCount, error) => {
        // Retry 3 times for network errors, but not for 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const { status } = error as any;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Configuration IndexedDB pour le cache offline
const DB_NAME = 'KBVCache';
const DB_VERSION = 1;

export interface CacheMetadata {
  key: string;
  timestamp: number;
  size: number;
  accessCount: number;
  lastAccessed: number;
}

export class OfflineCacheManager {
  private db: any;

  async init() {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Store pour les données cachées
          if (!db.objectStoreNames.contains('data')) {
            db.createObjectStore('data', { keyPath: 'key' });
          }
          // Store pour les métadonnées du cache
          if (!db.objectStoreNames.contains('metadata')) {
            const metadataStore = db.createObjectStore('metadata', { keyPath: 'key' });
            metadataStore.createIndex('lastAccessed', 'lastAccessed');
            metadataStore.createIndex('timestamp', 'timestamp');
          }
        },
      });
      console.log('IndexedDB initialized successfully');
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
    }
  }

  async set(key: string, data: any, metadata?: Partial<CacheMetadata>) {
    if (!this.db) await this.init();

    try {
      const timestamp = Date.now();
      const size = JSON.stringify(data).length;

      // Stocker les données
      await this.db.put('data', { key, data, timestamp });

      // Stocker les métadonnées
      const cacheMetadata: CacheMetadata = {
        key,
        timestamp,
        size,
        accessCount: 0,
        lastAccessed: timestamp,
        ...metadata,
      };
      await this.db.put('metadata', cacheMetadata);

      console.log(`Cache set for key: ${key}, size: ${size} bytes`);
    } catch (error) {
      console.error('Failed to set cache:', error);
    }
  }

  async get(key: string) {
    if (!this.db) await this.init();

    try {
      const result = await this.db.get('data', key);
      if (result) {
        // Mettre à jour les métadonnées d'accès
        await this.updateAccessMetadata(key);
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to get cache:', error);
      return null;
    }
  }

  async getMetadata(key: string) {
    if (!this.db) await this.init();

    try {
      return await this.db.get('metadata', key);
    } catch (error) {
      console.error('Failed to get metadata:', error);
      return null;
    }
  }

  private async updateAccessMetadata(key: string) {
    try {
      const metadata = await this.getMetadata(key);
      if (metadata) {
        metadata.accessCount += 1;
        metadata.lastAccessed = Date.now();
        await this.db.put('metadata', metadata);
      }
    } catch (error) {
      console.error('Failed to update access metadata:', error);
    }
  }

  async delete(key: string) {
    if (!this.db) await this.init();

    try {
      await this.db.delete('data', key);
      await this.db.delete('metadata', key);
      console.log(`Cache deleted for key: ${key}`);
    } catch (error) {
      console.error('Failed to delete cache:', error);
    }
  }

  async clear() {
    if (!this.db) await this.init();

    try {
      await this.db.clear('data');
      await this.db.clear('metadata');
      console.log('All cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  async getAllMetadata() {
    if (!this.db) await this.init();

    try {
      return await this.db.getAll('metadata');
    } catch (error) {
      console.error('Failed to get all metadata:', error);
      return [];
    }
  }

  async getCacheStats() {
    const metadata = await this.getAllMetadata();
    const totalSize = metadata.reduce((sum: number, item: CacheMetadata) => sum + item.size, 0);

    return {
      totalEntries: metadata.length,
      totalSize,
      oldestEntry: metadata.reduce(
        (oldest: CacheMetadata, item: CacheMetadata) =>
          item.timestamp < oldest.timestamp ? item : oldest,
        metadata[0]
      ),
      mostAccessed: metadata.reduce(
        (most: CacheMetadata, item: CacheMetadata) =>
          item.accessCount > most.accessCount ? item : most,
        metadata[0]
      ),
      recentlyAccessed: metadata
        .sort((a: CacheMetadata, b: CacheMetadata) => b.lastAccessed - a.lastAccessed)
        .slice(0, 10),
    };
  }

  // Stratégie LRU (Least Recently Used) pour nettoyer le cache
  async cleanup(
    maxAge = 1000 * 60 * 60 * 24 * 7, // 7 jours
    maxSize = 50 * 1024 * 1024
  ) {
    // 50MB
    if (!this.db) await this.init();

    try {
      const metadata = await this.getAllMetadata();
      const now = Date.now();

      // Supprimer les entrées trop anciennes
      const expiredKeys = metadata
        .filter((item: CacheMetadata) => now - item.timestamp > maxAge)
        .map((item: CacheMetadata) => item.key);

      for (const key of expiredKeys) {
        await this.delete(key);
      }

      // Si encore trop volumineux, supprimer les moins récemment utilisées
      const sortedMetadata = metadata
        .filter((item: CacheMetadata) => !expiredKeys.includes(item.key))
        .sort((a: CacheMetadata, b: CacheMetadata) => a.lastAccessed - b.lastAccessed);

      let currentSize = sortedMetadata.reduce(
        (sum: number, item: CacheMetadata) => sum + item.size,
        0
      );
      const keysToRemove: string[] = [];

      for (const item of sortedMetadata) {
        if (currentSize <= maxSize) break;
        keysToRemove.push(item.key);
        currentSize -= item.size;
      }

      for (const key of keysToRemove) {
        await this.delete(key);
      }

      console.log(
        `Cache cleanup: removed ${expiredKeys.length} expired entries and ${keysToRemove.length} LRU entries`
      );
    } catch (error) {
      console.error('Failed to cleanup cache:', error);
    }
  }
}

// Instance globale du gestionnaire de cache
export const offlineCache = new OfflineCacheManager();

// Hook pour précharger les données critiques
export function usePreloadData() {
  const preloadCriticalData = async () => {
    try {
      // Précharger les données les plus utilisées
      await queryClient.prefetchQuery({
        queryKey: ['visits', 'current'],
        queryFn: () =>
          // Logique pour récupérer les visites actuelles
          fetch('/api/visits/current').then((r) => r.json()),
        staleTime: 1000 * 60 * 2, // 2 minutes
      });

      await queryClient.prefetchQuery({
        queryKey: ['speakers', 'active'],
        queryFn: () =>
          // Logique pour récupérer les orateurs actifs
          fetch('/api/speakers/active').then((r) => r.json()),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });

      console.log('Critical data preloaded');
    } catch (error) {
      console.error('Failed to preload critical data:', error);
    }
  };

  return { preloadCriticalData };
}

export default {
  queryClient,
  offlineCache,
  usePreloadData,
};
