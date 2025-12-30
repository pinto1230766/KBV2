import React, { useState, useMemo, useEffect } from 'react';
import {
  Zap,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  X,
  Search,
  Download,
  Cloud,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

import { Card, CardBody } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { GlobalSearch } from './GlobalSearch';
import { exportService } from '@/utils/ExportService';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: QuickAction) => void;
}

export type QuickAction =
  | 'schedule-visit'
  | 'add-speaker'
  | 'add-host'
  | 'send-message'
  | 'generate-report'
  | 'check-conflicts'
  | 'backup-data'
  | 'import-data'
  | 'sync-sheets'
  | 'export-all-data'
  | 'search-entities';

interface ActionItem {
  id: QuickAction;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: 'planning' | 'contacts' | 'communication' | 'data';
  bg: string;
}

const QUICK_ACTIONS: ActionItem[] = [
  {
    id: 'schedule-visit',
    label: 'Programmer une visite',
    description: 'Créer une nouvelle visite rapidement',
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    category: 'planning',
  },
  {
    id: 'check-conflicts',
    label: 'Vérifier les conflits',
    description: 'Détecter les conflits de planning',
    icon: Zap,
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/40',
    category: 'planning',
  },
  {
    id: 'add-speaker',
    label: 'Ajouter un orateur',
    description: 'Enregistrer un nouvel orateur',
    icon: Users,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/40',
    category: 'contacts',
  },
  {
    id: 'add-host',
    label: 'Ajouter un hôte',
    description: "Enregistrer un nouveau contact d'accueil",
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/40',
    category: 'contacts',
  },
  {
    id: 'send-message',
    label: 'Envoyer un message',
    description: 'Composer et envoyer un message',
    icon: MessageSquare,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    category: 'communication',
  },
  {
    id: 'generate-report',
    label: 'Générer un rapport',
    description: 'Créer un rapport personnalisé',
    icon: FileText,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100 dark:bg-indigo-900/40',
    category: 'data',
  },
  {
    id: 'backup-data',
    label: 'Sauvegarder les données',
    description: 'Créer une sauvegarde complète',
    icon: Settings,
    color: 'text-gray-600',
    bg: 'bg-gray-100 dark:bg-gray-900/40',
    category: 'data',
  },
  {
    id: 'import-data',
    label: 'Importer des données',
    description: 'Importer depuis un fichier CSV',
    icon: Plus,
    color: 'text-teal-600',
    bg: 'bg-teal-100 dark:bg-teal-900/40',
    category: 'data',
  },
  {
    id: 'sync-sheets',
    label: 'Synchroniser Google Sheets',
    description: 'Cloud sync avec vos feuilles',
    icon: Cloud,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/40',
    category: 'data',
  },
  {
    id: 'export-all-data',
    label: 'Exporter tout',
    description: 'Format CSV/Excel complet',
    icon: Download,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    category: 'data',
  },
  {
    id: 'search-entities',
    label: 'Recherche Globale',
    description: 'Trouver un orateur ou une visite',
    icon: Search,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100 dark:bg-indigo-900/40',
    category: 'planning',
  },
];

const CATEGORIES = [
  { id: 'all' as const, label: 'Toutes', icon: Zap, color: 'text-primary-600' },
  { id: 'planning' as const, label: 'Planning', icon: Calendar, color: 'text-blue-600' },
  { id: 'contacts' as const, label: 'Contacts', icon: Users, color: 'text-green-600' },
  { id: 'communication' as const, label: 'Comms', icon: MessageSquare, color: 'text-purple-600' },
  { id: 'data' as const, label: 'Données', icon: FileText, color: 'text-amber-600' },
];

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onAction,
}) => {
  const allData = useData();
  const { addToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<ActionItem['category'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [recentActions, setRecentActions] = useState<QuickAction[]>([
    'schedule-visit',
    'sync-sheets',
    'search-entities',
  ]);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Set data for export service
  useEffect(() => {
    exportService.setData(allData);
  }, [allData]);

  const filteredActions = useMemo(() => {
    return QUICK_ACTIONS.filter((action) => {
      const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
      const matchesSearch =
        action.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const handleAction = async (actionId: QuickAction) => {
    setRecentActions((prev) => {
      const filtered = prev.filter((id) => id !== actionId);
      return [actionId, ...filtered].slice(0, 3);
    });

    // Handle new unified actions
    if (actionId === 'search-entities') {
      setIsGlobalSearchOpen(true);
      return;
    }

    if (actionId === 'export-all-data') {
      const result = await exportService.export({
        type: 'all',
        format: 'json',
        filename: `sauvegarde_complete_${new Date().toISOString().slice(0, 10)}`,
      });
      if (result.success) {
        exportService.download(result);
        addToast('Sauvegarde complète exportée', 'success');
      } else {
        addToast(`Erreur lors de l'export: ${result.error}`, 'error');
      }
      onClose();
      return;
    }

    if (actionId === 'generate-report') {
      const result = await exportService.export({
        type: 'report',
        format: 'csv',
        filename: `rapport_${new Date().toISOString().slice(0, 10)}`,
      });
      if (result.success) {
        exportService.download(result);
        addToast('Rapport généré', 'success');
      } else {
        addToast(`Erreur lors de la génération: ${result.error}`, 'error');
      }
      onClose();
      return;
    }

    // For other actions, delegate to parent
    onAction(actionId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=''
      size='xl'
      hideCloseButton
      padding='none'
      className='max-sm:rounded-none overflow-hidden border-none'
    >
      <div className='flex flex-col max-h-[90vh] bg-white dark:bg-gray-900 overflow-hidden rounded-3xl'>
        {/* Top Gradient Header */}
        <div className='bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white relative overflow-hidden'>
          <Zap className='absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 rotate-12' />
          <div className='relative z-10'>
            <div className='flex justify-between items-start mb-4'>
              <div className='px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md'>
                Control Panel
              </div>
              <button
                onClick={onClose}
                className='p-2 hover:bg-white/10 rounded-full transition-colors'
              >
                <X className='w-6 h-6' />
              </button>
            </div>
            <h2 className='text-3xl font-black tracking-tighter mb-2 flex items-center gap-3'>
              <Sparkles className='w-8 h-8 text-amber-300' />
              Actions Rapides
            </h2>
            <p className='text-primary-100 opacity-80 text-sm max-w-sm'>
              Accédez instantanément aux fonctionnalités clés de votre assistant de congrégation.
            </p>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className='p-6 border-b border-gray-100 dark:border-gray-800 space-y-6'>
          <div className='relative group'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors' />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Quelle action souhaitez-vous effectuer ?'
              className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-lg focus:ring-4 focus:ring-primary-500/10 transition-all font-medium placeholder:text-gray-400'
              autoFocus
            />
          </div>

          <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-none'>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-tighter transition-all whitespace-nowrap',
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'
                )}
              >
                <cat.icon
                  className={cn('w-4 h-4', selectedCategory === cat.id ? 'text-white' : cat.color)}
                />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className='flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800'>
          {/* Recents - Only if no search */}
          {!searchTerm && selectedCategory === 'all' && recentActions.length > 0 && (
            <div className='animate-in fade-in slide-in-from-top-4 duration-300'>
              <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2'>
                <Clock className='w-3 h-3' />
                Récemment utilisées
              </h4>
              <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
                {recentActions.map((id) => {
                  const action = QUICK_ACTIONS.find((a) => a.id === id);
                  if (!action) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => handleAction(id)}
                      className='p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary-500 transition-all text-left group'
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110',
                          action.bg,
                          action.color
                        )}
                      >
                        <action.icon className='w-5 h-5' />
                      </div>
                      <div className='font-bold text-xs text-gray-900 dark:text-white truncate'>
                        {action.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className='animate-in fade-in duration-500'>
            <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4'>
              {searchTerm ? 'Résultats de recherche' : 'Toutes les actions'}
            </h4>
            {filteredActions.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {filteredActions.map((action) => (
                  <Card
                    key={action.id}
                    hoverable
                    onClick={() => handleAction(action.id)}
                    className='border-none shadow-sm outline outline-1 outline-gray-100 dark:outline-gray-800 hover:outline-primary-500 group'
                  >
                    <CardBody className='p-4 flex items-center gap-4'>
                      <div
                        className={cn(
                          'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300',
                          action.bg,
                          action.color
                        )}
                      >
                        <action.icon className='w-7 h-7' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-0.5 uppercase tracking-tighter text-sm'>
                          {action.label}
                        </h4>
                        <p className='text-[11px] text-gray-500 dark:text-gray-400 truncate'>
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className='w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all' />
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='py-20 text-center'>
                <Search className='w-12 h-12 mx-auto mb-4 text-gray-200' />
                <p className='font-bold text-gray-400 uppercase text-xs'>
                  Aucune action correspondante
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Minimal Footer */}
        <div className='p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center'>
          <div className='flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest'>
            <Zap className='w-3 h-3 text-amber-500' />
            KBV Manager • Core OS
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            className='font-bold uppercase text-[10px] tracking-widest'
          >
            Annuler [ESC]
          </Button>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
      />
    </Modal>
  );
};
