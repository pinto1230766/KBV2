import React from 'react';
import { useVisitEditor } from '../VisitEditorContext';
import { useData } from '@/contexts/DataContext';
import { LogisticsManager } from '@/components/logistics/LogisticsManager';

export const LogisticsTab: React.FC = () => {
  const { formData, setFormData, visit } = useVisitEditor();
  const { hosts } = useData();

  if (visit.congregation?.includes('Lyon')) {
    return (
      <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
        Aucun besoin logistique pour les orateurs locaux.
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='border border-gray-200 dark:border-gray-800 rounded-2xl p-4'>
        <LogisticsManager
          logistics={formData.logistics || {}}
          hosts={hosts}
          readOnly={false}
          onUpdate={(logistics) => setFormData((prev) => ({ ...prev, logistics }))}
        />
      </div>
    </div>
  );
};
