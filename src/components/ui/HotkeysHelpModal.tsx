/**
 * Modal d'aide pour les raccourcis clavier
 * KBV Lyon - Phase 2.1.3
 */

import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { cn } from '@/utils/cn';

interface HotkeyAction {
  key: string;
  description: string;
  category: 'navigation' | 'actions' | 'search' | 'modals' | 'general';
}

interface HotkeysHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotkeys: HotkeyAction[];
}

const categoryLabels = {
  navigation: 'Navigation',
  actions: 'Actions',
  search: 'Recherche',
  modals: 'Fenêtres',
  general: 'Général',
};

const categoryIcons = {
  navigation: '🧭',
  actions: '⚡',
  search: '🔍',
  modals: '🗔',
  general: '⚙️',
};

export const HotkeysHelpModal: React.FC<HotkeysHelpModalProps> = ({
  isOpen,
  onClose,
  hotkeys,
}) => {
  if (!isOpen) return null;

  // Grouper les raccourcis par catégorie
  const groupedHotkeys = hotkeys.reduce((acc, hotkey) => {
    if (!acc[hotkey.category]) {
      acc[hotkey.category] = [];
    }
    acc[hotkey.category].push(hotkey);
    return acc;
  }, {} as Record<string, HotkeyAction[]>);



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hotkeys-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Keyboard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 id="hotkeys-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                Raccourcis clavier
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gagnez du temps avec ces raccourcis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {Object.entries(groupedHotkeys).map(([category, categoryHotkeys]) => (
              <div key={category} className="space-y-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <span>{categoryIcons[category as keyof typeof categoryIcons]}</span>
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
                <div className="space-y-2">
                  {categoryHotkeys.map((hotkey, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {hotkey.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {hotkey.key.split('+').map((k, i, arr) => (
                          <React.Fragment key={i}>
                            <kbd
                              className={cn(
                                'px-2 py-1 text-xs font-semibold text-gray-900 dark:text-white',
                                'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600',
                                'rounded shadow-sm min-w-[2rem] text-center'
                              )}
                            >
                              {k.charAt(0).toUpperCase() + k.slice(1).replace('ctrl', 'Ctrl').replace('shift', 'Shift')}
                            </kbd>
                            {i < arr.length - 1 && (
                              <span className="text-gray-400 dark:text-gray-500 mx-1">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer tip */}
          <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
            <p className="text-sm text-primary-900 dark:text-primary-100">
              💡 <strong>Astuce:</strong> Appuyez sur <kbd className="px-2 py-1 text-xs font-semibold bg-white dark:bg-gray-800 border border-primary-300 dark:border-primary-700 rounded">Shift</kbd> + <kbd className="px-2 py-1 text-xs font-semibold bg-white dark:bg-gray-800 border border-primary-300 dark:border-primary-700 rounded">/</kbd> à tout moment pour afficher cette aide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
