import React, { createContext, useContext, useEffect, ReactNode, useState } from 'react';

// Contexte pour l'accessibilité globale
interface AccessibilityContextType {
  announceMessage: (message: string, priority?: 'polite' | 'assertive') => void;
  isKeyboardNavigation: boolean;
  reducedMotion: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [announceElement, setAnnounceElement] = useState<HTMLDivElement | null>(null);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Détecter si l'utilisateur utilise le clavier
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardNavigation(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardNavigation(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    // Détecter les préférences d'accessibilité système
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Créer l'élément live-region pour les annonces
    const element = document.createElement('div');
    element.setAttribute('aria-live', 'polite');
    element.setAttribute('aria-atomic', 'true');
    element.className = 'sr-only'; // Screen reader only
    document.body.appendChild(element);
    setAnnounceElement(element);

    return () => {
      if (element.parentNode) {
        document.body.removeChild(element);
      }
    };
  }, []);

  const announceMessage = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceElement) {
      announceElement.setAttribute('aria-live', priority);
      announceElement.textContent = message;
      
      // Nettoyer le message après un délai
      setTimeout(() => {
        if (announceElement) {
          announceElement.textContent = '';
        }
      }, 1000);
    }
  };

  const contextValue: AccessibilityContextType = {
    announceMessage,
    isKeyboardNavigation,
    reducedMotion
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Composant pour les icônes avec accessibilité
interface AccessibleIconProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AccessibleIcon({ icon: Icon, label, className = '', size = 'md' }: AccessibleIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <span 
      className="inline-flex items-center justify-center"
      aria-label={label}
      role="img"
    >
      <Icon 
        className={`${sizeClasses[size]} ${className}`}
      />
    </span>
  );
}

// Hook pour les raccourcis clavier
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      
      // Raccourcis globaux
      if (ctrlOrMeta && key === 'k') {
        e.preventDefault();
        shortcuts['ctrl+k']?.();
      } else if (ctrlOrMeta && key === '/') {
        e.preventDefault();
        shortcuts['ctrl+/']?.();
      } else if (ctrlOrMeta && key === 's') {
        e.preventDefault();
        shortcuts['ctrl+s']?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Composant pour les focus rings
interface FocusRingProps {
  children: ReactNode;
  className?: string;
}

export function FocusRing({ children, className = '' }: FocusRingProps) {
  return (
    <div className={`focus-ring ${className}`}>
      {children}
    </div>
  );
}

// Utilitaire pour ajouter tabIndex automatiquement
interface AutoFocusableProps {
  children: ReactNode;
  autoFocus?: boolean;
  tabIndex?: number;
  className?: string;
}

export function AutoFocusable({
  children,
  autoFocus = false,
  tabIndex = 0,
  className = ''
}: AutoFocusableProps) {
  return (
    <div tabIndex={autoFocus ? -1 : tabIndex} className={className}>
      {children}
    </div>
  );
}

// Export par défaut
const AccessibilityComponents = {
  AccessibilityProvider,
  useAccessibility,
  AccessibleIcon,
  useKeyboardShortcuts,
  FocusRing,
  AutoFocusable
};

export default AccessibilityComponents;
