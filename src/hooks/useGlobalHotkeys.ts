/**
 * Hook pour gérer les raccourcis clavier globaux de l'application
 * KBV Lyon - Phase 2.1.3 Raccourcis clavier
 */

import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';

interface HotkeyAction {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'search' | 'modals' | 'general';
}

export function useGlobalHotkeys() {
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Définition de tous les raccourcis
  const hotkeys: HotkeyAction[] = [
    // Navigation
    {
      key: 'ctrl+h',
      description: 'Accueil / Dashboard',
      action: () => navigate('/'),
      category: 'navigation',
    },
    {
      key: 'ctrl+p',
      description: 'Planning',
      action: () => navigate('/planning'),
      category: 'navigation',
    },
    {
      key: 'ctrl+m',
      description: 'Messages',
      action: () => navigate('/messages'),
      category: 'navigation',
    },
    {
      key: 'ctrl+o',
      description: 'Orateurs',
      action: () => navigate('/speakers'),
      category: 'navigation',
    },
    {
      key: 'ctrl+,',
      description: 'Paramètres',
      action: () => navigate('/settings'),
      category: 'navigation',
    },

    // Actions rapides
    {
      key: 'ctrl+n',
      description: 'Nouvelle visite',
      action: () => {
        // Ouvrir modal nouvelle visite
        console.log('Nouvelle visite');
      },
      category: 'actions',
    },
    {
      key: 'ctrl+shift+n',
      description: 'Nouveau message',
      action: () => {
        // Ouvrir modal nouveau message
        console.log('Nouveau message');
      },
      category: 'actions',
    },
    {
      key: 'ctrl+s',
      description: 'Sauvegarder (dans formulaire)',
      action: () => {
        // Déclencher sauvegarde du formulaire actif
        console.log('Sauvegarder');
      },
      category: 'actions',
    },

    // Recherche
    {
      key: 'ctrl+k',
      description: 'Recherche globale',
      action: () => setShowSearchModal(true),
      category: 'search',
    },
    {
      key: '/',
      description: 'Focus recherche',
      action: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      category: 'search',
    },

    // Modals
    {
      key: 'escape',
      description: 'Fermer modal/annuler',
      action: () => {
        // Fermer le modal ouvert
        setShowSearchModal(false);
        setShowHelpModal(false);
        setShowQuickActions(false);
      },
      category: 'modals',
    },

    // Général
    {
      key: 'shift+/',
      description: 'Afficher raccourcis (aide)',
      action: () => setShowHelpModal(true),
      category: 'general',
    },
    {
      key: 'ctrl+shift+p',
      description: 'Palette de commandes',
      action: () => setShowQuickActions(true),
      category: 'general',
    },
  ];

  // Enregistrer tous les raccourcis
  hotkeys.forEach(({ key, action }) => {
    useHotkeys(
      key,
      (event) => {
        event.preventDefault();
        action();
      },
      {
        enableOnFormTags: false, // Désactiver dans les formulaires (sauf exceptions)
      }
    );
  });

  // Raccourcis spéciaux qui fonctionnent même dans les formulaires
  useHotkeys(
    'escape',
    () => {
      setShowSearchModal(false);
      setShowHelpModal(false);
      setShowQuickActions(false);
    },
    {
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    'ctrl+k',
    (event) => {
      event.preventDefault();
      setShowSearchModal(true);
    },
    {
      enableOnFormTags: true,
    }
  );

  const closeHelpModal = useCallback(() => setShowHelpModal(false), []);
  const closeSearchModal = useCallback(() => setShowSearchModal(false), []);
  const closeQuickActions = useCallback(() => setShowQuickActions(false), []);

  return {
    hotkeys,
    showHelpModal,
    showSearchModal,
    showQuickActions,
    closeHelpModal,
    closeSearchModal,
    closeQuickActions,
  };
}
