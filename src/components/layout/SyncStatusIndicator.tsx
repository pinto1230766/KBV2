import React from 'react';
import { WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

export const SyncStatusIndicator: React.FC = () => {
  const { isOnline, syncQueue, clearSyncQueue, syncWithGoogleSheet } = useData();
  const [isSyncing, setIsSyncing] = React.useState(false);

  const pendingCount = syncQueue.filter((a) => a.status === 'pending').length;
  const failedCount = syncQueue.filter((a) => a.status === 'failed').length;

  const handleManualSync = async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    try {
      // Pour l'instant on synchronise uniquement en pull via Google Sheets
      // Dans le futur, on pourrait pousser les actions de la queue ici
      await syncWithGoogleSheet();

      // Simulation de traitement de la queue (à implémenter avec un vrai backend)
      // clearSyncQueue();
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOnline) {
    return (
      <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'>
        <WifiOff className='w-3.5 h-3.5' />
        <span>Hors ligne</span>
        {pendingCount > 0 && (
          <span className='ml-1 px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-md'>
            {pendingCount} modif{pendingCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
    );
  }

  if (failedCount > 0) {
    return (
      <button
        onClick={() => clearSyncQueue()}
        className='flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-full text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors'
        title='Cliquez pour ignorer les erreurs'
      >
        <AlertCircle className='w-3.5 h-3.5' />
        <span>
          {failedCount} échec{failedCount > 1 ? 's' : ''}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleManualSync}
      disabled={isSyncing}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
        ${
          isSyncing
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
            : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
        }
      `}
    >
      {isSyncing ? (
        <>
          <RefreshCw className='w-3.5 h-3.5 animate-spin' />
          <span>Synchro...</span>
        </>
      ) : (
        <>
          <CheckCircle className='w-3.5 h-3.5' />
          <span>Connecté</span>
          {pendingCount > 0 && (
            <span className='ml-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-md'>
              {pendingCount} à envoyer
            </span>
          )}
        </>
      )}
    </button>
  );
};
