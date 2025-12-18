import { useState, useEffect, useCallback } from 'react';
import { SyncAction, SyncActionType } from '@/types';
import { generateUUID } from '@/utils/uuid';

const QUEUE_STORAGE_KEY = 'kbv_sync_queue';

export function useSyncQueue() {
  const [queue, setQueue] = useState<SyncAction[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger la file d'attente au démarrage
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (savedQueue) {
        setQueue(JSON.parse(savedQueue));
      }
    } catch (e) {
      console.error('Failed to load sync queue', e);
    }
    setIsInitialized(true);
  }, []);

  // Sauvegarder la file d'attente à chaque changement
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to save sync queue', e);
    }
  }, [queue, isInitialized]);

  const addAction = useCallback((type: SyncActionType, payload: any) => {
    const newAction: SyncAction = {
      id: generateUUID(),
      type,
      payload,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0,
    };

    setQueue((prev) => [...prev, newAction]);
    return newAction.id;
  }, []);

  const removeAction = useCallback((id: string) => {
    setQueue((prev) => prev.filter((action) => action.id !== id));
  }, []);

  const updateActionStatus = useCallback(
    (id: string, status: SyncAction['status'], error?: string) => {
      setQueue((prev) =>
        prev.map((action) =>
          action.id === id
            ? {
                ...action,
                status,
                error,
                retryCount: status === 'failed' ? action.retryCount + 1 : action.retryCount,
              }
            : action
        )
      );
    },
    []
  );

  const clearQueue = useCallback(() => {
    setQueue([]);
    localStorage.removeItem(QUEUE_STORAGE_KEY);
  }, []);

  const getPendingActions = useCallback(
    () => queue.filter((action) => action.status === 'pending' || action.status === 'failed'),
    [queue]
  );

  return {
    queue,
    addAction,
    removeAction,
    updateActionStatus,
    clearQueue,
    getPendingActions,
  };
}
