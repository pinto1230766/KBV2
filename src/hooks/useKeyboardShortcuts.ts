import { useEffect } from 'react';

type KeyCombo = string;
type Handler = (event: KeyboardEvent) => void;

export function useKeyboardShortcuts(shortcuts: Record<KeyCombo, Handler>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorer si l'utilisateur tape dans un champ de texte
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const combo = [
        event.ctrlKey ? 'Ctrl' : '',
        event.altKey ? 'Alt' : '',
        event.shiftKey ? 'Shift' : '',
        event.key
      ].filter(Boolean).join('+');

      // Vérifier la correspondance exacte
      if (shortcuts[combo]) {
        event.preventDefault();
        shortcuts[combo](event);
        return;
      }

      // Vérifier les touches simples (ex: 'Escape')
      if (shortcuts[event.key]) {
        event.preventDefault();
        shortcuts[event.key](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
