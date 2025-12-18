import React, { useState } from 'react';
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
  TrendingUp,
  Cloud,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { KeyboardShortcutIcon } from '@/components/ui/KeyboardShortcutIcon';

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
  | 'search-entities'
  | 'show-statistics';

interface ActionItem {
  id: QuickAction;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: 'planning' | 'contacts' | 'communication' | 'data';
  shortcut?: string;
}

const QUICK_ACTIONS: ActionItem[] = [
  {
    id: 'schedule-visit',
    label: 'Programmer une visite',
    description: 'Créer une nouvelle visite rapidement',
    icon: Calendar,
    color: 'blue',
    category: 'planning',
    shortcut: 'Ctrl+N',
  },
  {
    id: 'check-conflicts',
    label: 'Vérifier les conflits',
    description: 'Détecter les conflits de planning',
    icon: Zap,
    color: 'orange',
    category: 'planning',
    shortcut: 'Ctrl+K',
  },
  {
    id: 'add-speaker',
    label: 'Ajouter un orateur',
    description: 'Enregistrer un nouvel orateur',
    icon: Users,
    color: 'green',
    category: 'contacts',
    shortcut: 'Ctrl+Shift+S',
  },
  {
    id: 'add-host',
    label: 'Ajouter un hôte',
    description: "Enregistrer un nouveau contact d'accueil",
    icon: Users,
    color: 'purple',
    category: 'contacts',
    shortcut: 'Ctrl+Shift+H',
  },
  {
    id: 'send-message',
    label: 'Envoyer un message',
    description: 'Composer et envoyer un message',
    icon: MessageSquare,
    color: 'blue',
    category: 'communication',
    shortcut: 'Ctrl+M',
  },
  {
    id: 'generate-report',
    label: 'Générer un rapport',
    description: 'Créer un rapport personnalisé',
    icon: FileText,
    color: 'indigo',
    category: 'data',
    shortcut: 'Ctrl+R',
  },
  {
    id: 'backup-data',
    label: 'Sauvegarder les données',
    description: 'Créer une sauvegarde complète',
    icon: Settings,
    color: 'gray',
    category: 'data',
    shortcut: 'Ctrl+B',
  },
  {
    id: 'import-data',
    label: 'Importer des données',
    description: 'Importer depuis un fichier CSV',
    icon: Plus,
    color: 'teal',
    category: 'data',
    shortcut: 'Ctrl+I',
  },
  // Nouvelles actions recommandées
  {
    id: 'sync-sheets',
    label: 'Synchroniser avec Google Sheets',
    description: 'Synchroniser les données avec Google Sheets',
    icon: Cloud,
    color: 'green',
    category: 'data',
    shortcut: 'Ctrl+Shift+G',
  },
  {
    id: 'export-all-data',
    label: 'Exporter toutes les données',
    description: 'Exporter toutes les données en format CSV/Excel',
    icon: Download,
    color: 'blue',
    category: 'data',
    shortcut: 'Ctrl+Shift+E',
  },
  {
    id: 'search-entities',
    label: 'Rechercher un orateur ou une visite',
    description: 'Recherche globale dans la base de données',
    icon: Search,
    color: 'indigo',
    category: 'planning',
    shortcut: 'Ctrl+F',
  },
  {
    id: 'show-statistics',
    label: 'Afficher les statistiques',
    description: 'Voir les statistiques détaillées et graphiques',
    icon: TrendingUp,
    color: 'purple',
    category: 'data',
    shortcut: 'Ctrl+Shift+T',
  },
];

const CATEGORIES = [
  { id: 'all' as const, label: 'Toutes', icon: Zap },
  { id: 'planning' as const, label: 'Planning', icon: Calendar },
  { id: 'contacts' as const, label: 'Contacts', icon: Users },
  { id: 'communication' as const, label: 'Communication', icon: MessageSquare },
  { id: 'data' as const, label: 'Données', icon: FileText },
];

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onAction,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'planning' | 'contacts' | 'communication' | 'data'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [recentActions, setRecentActions] = useState<QuickAction[]>([]);

  const filteredActions = QUICK_ACTIONS.filter((action) => {
    if (selectedCategory !== 'all' && action.category !== selectedCategory) {
      return false;
    }
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        action.label.toLowerCase().includes(search) ||
        action.description.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const handleAction = (actionId: QuickAction) => {
    // Ajouter aux actions récentes
    setRecentActions((prev) => {
      const filtered = prev.filter((id) => id !== actionId);
      return [actionId, ...filtered].slice(0, 5);
    });

    onAction(actionId);
    onClose();
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
      green: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
      indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300',
      gray: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300',
      teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300',
    };
    return colors[color] || colors.blue;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Actions rapides' size='lg'>
      <div className='space-y-6'>
        {/* Recherche */}
        <div className='relative'>
          <Zap className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Rechercher une action...'
            className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg'
            autoFocus
          />
        </div>

        {/* Catégories */}
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <category.icon className='w-4 h-4' />
              {category.label}
            </button>
          ))}
        </div>

        {/* Actions récentes */}
        {recentActions.length > 0 && selectedCategory === 'all' && !searchTerm && (
          <div>
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
              Actions récentes
            </h4>
            <div className='flex gap-2 flex-wrap'>
              {recentActions.map((actionId) => {
                const action = QUICK_ACTIONS.find((a) => a.id === actionId);
                if (!action) return null;
                return (
                  <button
                    key={actionId}
                    onClick={() => handleAction(actionId)}
                    className='flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                  >
                    <action.icon className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                    <span className='text-sm text-gray-900 dark:text-white'>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Liste des actions */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto'>
          {filteredActions.length === 0 ? (
            <div className='col-span-2 text-center py-12'>
              <Zap className='w-16 h-16 mx-auto mb-4 text-gray-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Aucune action trouvée
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>Essayez une autre recherche</p>
            </div>
          ) : (
            filteredActions.map((action) => (
              <Card
                key={action.id}
                hoverable
                className='cursor-pointer'
                onClick={() => handleAction(action.id)}
              >
                <CardBody>
                  <div className='flex items-start gap-3'>
                    <div className={`p-3 rounded-lg ${getColorClasses(action.color)}`}>
                      <action.icon className='w-6 h-6' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-1'>
                        <h4 className='font-semibold text-gray-900 dark:text-white'>
                          {action.label}
                        </h4>
                        <div className='flex items-center gap-2'>
                          {action.shortcut && (
                            <KeyboardShortcutIcon shortcut={action.shortcut} showLabel={false} />
                          )}
                          {action.shortcut && (
                            <Badge variant='default' className='text-xs'>
                              {action.shortcut}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Aide raccourcis */}
        <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
          <div className='flex items-start gap-3'>
            <Zap className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
            <div className='text-sm text-blue-800 dark:text-blue-300'>
              <strong>Astuce :</strong> Utilisez les raccourcis clavier pour accéder rapidement aux
              actions. Appuyez sur{' '}
              <kbd className='px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded'>Ctrl+K</kbd> pour
              ouvrir ce panneau.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button variant='secondary' onClick={onClose}>
            <X className='w-4 h-4 mr-2' />
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
