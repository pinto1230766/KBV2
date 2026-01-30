import React, { useEffect } from 'react';
import { Visit } from '@/types';
import { VisitEditorProvider, useVisitEditor } from './VisitEditorContext';
import type { VisitEditorTab } from './VisitEditorContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { DetailsTab } from './tabs/DetailsTab';
import { HostsTab } from './tabs/HostsTab';
import { LogisticsTab } from './tabs/LogisticsTab';
import { ExpensesTab } from './tabs/ExpensesTab';
import { MessagesTab } from './tabs/MessagesTab';
import { HistoryTab } from './tabs/HistoryTab';

interface VisitEditorProps {
  visit: Visit;
  mode?: 'edit' | 'create';
  onClose?: () => void;
  isOpen?: boolean; // future modal integration
  onOpenMessageModal?: (params: { type: any; isGroup?: boolean; channel?: any; visit: Visit }) => void;
  initialTab?: VisitEditorTab;
}

const TAB_DEFINITIONS = [
  { id: 'details', label: 'Détails' },
  { id: 'hosts', label: 'Hôtes & Accueil' },
  { id: 'logistics', label: 'Logistique' },
  { id: 'expenses', label: 'Dépenses' },
  { id: 'messages', label: 'Messages' },
  { id: 'history', label: 'Historique' },
];

const getTabComponent = (tab: string, onOpenMessageModal?: VisitEditorProps['onOpenMessageModal']) => {
  switch (tab) {
    case 'details':
      return <DetailsTab />;
    case 'hosts':
      return <HostsTab />;
    case 'logistics':
      return <LogisticsTab />;
    case 'expenses':
      return <ExpensesTab />;
    case 'messages':
      return <MessagesTab onOpenMessageModal={onOpenMessageModal} />;
    case 'history':
      return <HistoryTab />;
    default:
      return <div className='text-center text-sm text-gray-400'>Sélectionnez un onglet pour commencer l'édition.</div>;
  }
};

const VisitEditorShell: React.FC<{ onClose?: () => void; onOpenMessageModal?: VisitEditorProps['onOpenMessageModal'] }> = ({ onClose, onOpenMessageModal }) => {
  const { visit, activeTab, setActiveTab, isDirty, saveVisit, isSaving } = useVisitEditor();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <Card className='flex flex-col h-full overflow-hidden'>
      <div className='border-b border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white'>
        <div>
          <p className='text-xs uppercase tracking-widest opacity-80'>Édition de visite</p>
          <h2 className='text-2xl font-bold'>{visit.nom}</h2>
          <p className='text-sm opacity-80'>Congrégation {visit.congregation}</p>
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='ghost' className='text-white/80 hover:text-white' onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={saveVisit} isLoading={isSaving} disabled={!isDirty && !isSaving}>
            Enregistrer
          </Button>
        </div>
      </div>

      <div className='border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30 flex overflow-x-auto'>
        {TAB_DEFINITIONS.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors border-b-2',
              activeTab === tab.id
                ? 'text-primary-600 border-primary-600 bg-white dark:bg-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            )}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='flex-1 overflow-auto p-6 text-gray-600 dark:text-gray-300'>
        {getTabComponent(activeTab, onOpenMessageModal)}
      </div>
    </Card>
  );
};

export const VisitEditor: React.FC<VisitEditorProps> = ({ visit, mode = 'edit', onClose, onOpenMessageModal, initialTab }) => {
  return (
    <VisitEditorProvider visit={visit} mode={mode} initialTab={initialTab}>
      <VisitEditorShell onClose={onClose} onOpenMessageModal={onOpenMessageModal} />
    </VisitEditorProvider>
  );
};
