import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';

describe('CacheManager', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('QueryClient Configuration', () => {
    it('should create query client instance', () => {
      expect(queryClient).toBeDefined();
      expect(queryClient).toBeInstanceOf(QueryClient);
    });

    it('should have default options configured', () => {
      const options = queryClient.getDefaultOptions();
      expect(options).toBeDefined();
      expect(options.queries).toBeDefined();
    });
  });

  describe('Query Operations', () => {
    it('should set and get query data', async () => {
      const queryKey = ['test', 'data'];
      const testData = { id: 1, name: 'Test' };

      queryClient.setQueryData(queryKey, testData);
      const retrievedData = queryClient.getQueryData(queryKey);

      expect(retrievedData).toEqual(testData);
    });

    it('should invalidate queries', async () => {
      const queryKey = ['test', 'invalidate'];
      queryClient.setQueryData(queryKey, { value: 'old' });

      await queryClient.invalidateQueries({ queryKey });

      const state = queryClient.getQueryState(queryKey);
      expect(state?.isInvalidated).toBe(true);
    });

    it('should remove queries', () => {
      const queryKey = ['test', 'remove'];
      queryClient.setQueryData(queryKey, { value: 'data' });

      expect(queryClient.getQueryData(queryKey)).toBeDefined();

      queryClient.removeQueries({ queryKey });
      expect(queryClient.getQueryData(queryKey)).toBeUndefined();
    });

    it('should clear all queries', () => {
      queryClient.setQueryData(['query1'], { value: 1 });
      queryClient.setQueryData(['query2'], { value: 2 });
      queryClient.setQueryData(['query3'], { value: 3 });

      queryClient.clear();

      expect(queryClient.getQueryData(['query1'])).toBeUndefined();
      expect(queryClient.getQueryData(['query2'])).toBeUndefined();
      expect(queryClient.getQueryData(['query3'])).toBeUndefined();
    });
  });

  describe('Cache Behavior', () => {
    it('should cache query results', async () => {
      const queryKey = ['cached', 'data'];
      const data = { cached: true, timestamp: Date.now() };

      queryClient.setQueryData(queryKey, data);

      // Récupération immédiate
      const cachedData = queryClient.getQueryData(queryKey);
      expect(cachedData).toEqual(data);
    });

    it('should handle multiple queries independently', () => {
      queryClient.setQueryData(['query', 'a'], { name: 'A' });
      queryClient.setQueryData(['query', 'b'], { name: 'B' });
      queryClient.setQueryData(['query', 'c'], { name: 'C' });

      expect(queryClient.getQueryData(['query', 'a'])).toEqual({ name: 'A' });
      expect(queryClient.getQueryData(['query', 'b'])).toEqual({ name: 'B' });
      expect(queryClient.getQueryData(['query', 'c'])).toEqual({ name: 'C' });
    });

    it('should return undefined for non-existent queries', () => {
      const data = queryClient.getQueryData(['non', 'existent']);
      expect(data).toBeUndefined();
    });
  });

  describe('Query State Management', () => {
    it('should track query state', () => {
      const queryKey = ['state', 'test'];
      queryClient.setQueryData(queryKey, { value: 'test' });

      const state = queryClient.getQueryState(queryKey);
      expect(state).toBeDefined();
      expect(state?.data).toEqual({ value: 'test' });
    });

    it('should handle query updates', () => {
      const queryKey = ['update', 'test'];

      queryClient.setQueryData(queryKey, { version: 1 });
      expect(queryClient.getQueryData(queryKey)).toEqual({ version: 1 });

      queryClient.setQueryData(queryKey, { version: 2 });
      expect(queryClient.getQueryData(queryKey)).toEqual({ version: 2 });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid query keys', () => {
      expect(() => {
        queryClient.getQueryData(null as any);
      }).toThrow();
    });

    it('should handle setting undefined data', () => {
      const queryKey = ['undefined', 'data'];
      queryClient.setQueryData(queryKey, undefined);

      expect(queryClient.getQueryData(queryKey)).toBeUndefined();
    });
  });

  describe('Performance', () => {
    it('should handle large number of queries', () => {
      const numQueries = 1000;

      for (let i = 0; i < numQueries; i++) {
        queryClient.setQueryData(['query', i], { id: i });
      }

      // Vérifier un échantillon
      expect(queryClient.getQueryData(['query', 0])).toEqual({ id: 0 });
      expect(queryClient.getQueryData(['query', 500])).toEqual({ id: 500 });
      expect(queryClient.getQueryData(['query', 999])).toEqual({ id: 999 });
    });

    it('should handle large data objects', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        data: 'x'.repeat(100),
      }));

      queryClient.setQueryData(['large', 'data'], largeData);
      const retrieved = queryClient.getQueryData(['large', 'data']);

      expect(retrieved).toEqual(largeData);
      expect(Array.isArray(retrieved)).toBe(true);
      expect((retrieved as any[]).length).toBe(1000);
    });
  });

  describe('Query Prefetching', () => {
    it('should support prefetch queries', async () => {
      const queryKey = ['prefetch', 'test'];

      await queryClient.prefetchQuery({
        queryKey,
        queryFn: async () => ({ prefetched: true }),
      });

      const data = queryClient.getQueryData(queryKey);
      expect(data).toEqual({ prefetched: true });
    });
  });

  describe('Mutation Handling', () => {
    it('should handle mutation state', () => {
      const mutationCache = queryClient.getMutationCache();
      expect(mutationCache).toBeDefined();
    });
  });
});
