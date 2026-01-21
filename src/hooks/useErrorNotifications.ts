import { useState, useCallback } from 'react';

export type ErrorType = 'error' | 'warning' | 'info' | 'success';

export interface ErrorNotification {
  id: string;
  type: ErrorType;
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  retry?: () => void;
  timestamp: Date;
}

interface UseErrorNotificationsReturn {
  notifications: ErrorNotification[];
  showError: (title: string, message: string, options?: Partial<ErrorNotification>) => string;
  showWarning: (title: string, message: string, options?: Partial<ErrorNotification>) => string;
  showInfo: (title: string, message: string, options?: Partial<ErrorNotification>) => string;
  showSuccess: (title: string, message: string, options?: Partial<ErrorNotification>) => string;
  dismissNotification: (id: string) => void;
  dismissAll: () => void;
  clearErrors: () => void;
  getErrors: () => ErrorNotification[];
}

// Hook principal pour les notifications d'erreurs
export function useErrorNotifications(): UseErrorNotificationsReturn {
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);

  const createNotification = useCallback(
    (
      type: ErrorType,
      title: string,
      message: string,
      options: Partial<ErrorNotification> = {}
    ): string => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const duration = options.duration ?? (type === 'error' ? 8000 : 5000);

      const notification: ErrorNotification = {
        id,
        type,
        title,
        message,
        duration,
        persistent: options.persistent ?? false,
        action: options.action,
        retry: options.retry,
        timestamp: new Date(),
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-dismiss pour les notifications non-persistantes
      if (!notification.persistent && duration > 0) {
        setTimeout(() => {
          dismissNotification(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const showError = useCallback(
    (title: string, message: string, options?: Partial<ErrorNotification>) =>
      createNotification('error', title, message, options),
    [createNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string, options?: Partial<ErrorNotification>) =>
      createNotification('warning', title, message, options),
    [createNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string, options?: Partial<ErrorNotification>) =>
      createNotification('info', title, message, options),
    [createNotification]
  );

  const showSuccess = useCallback(
    (title: string, message: string, options?: Partial<ErrorNotification>) =>
      createNotification('success', title, message, { ...options, duration: 3000 }),
    [createNotification]
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearErrors = useCallback(() => {
    setNotifications((prev) => prev.filter((notification) => notification.type !== 'error'));
  }, []);

  const getErrors = useCallback(
    () => notifications.filter((notification) => notification.type === 'error'),
    [notifications]
  );

  return {
    notifications,
    showError,
    showWarning,
    showInfo,
    showSuccess,
    dismissNotification,
    dismissAll,
    clearErrors,
    getErrors,
  };
}

// Hook spécialisé pour les erreurs de réseau
export function useNetworkErrorHandler() {
  const { showError, showWarning, showInfo } = useErrorNotifications();

  const handleNetworkError = useCallback(
    (error: any, context?: string) => {
      const contextStr = context ? ` (${context})` : '';

      if (error.name === 'NetworkError' || error.message.includes('Network Error')) {
        showError(
          'Erreur de connexion',
          'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
          {
            retry: () => window.location.reload(),
            persistent: true,
          }
        );
      } else if (error.status === 404) {
        showError('Ressource non trouvée', `La ressource demandée n'existe pas${contextStr}.`);
      } else if (error.status === 403) {
        showError('Accès refusé', `Vous n'avez pas les permissions nécessaires${contextStr}.`);
      } else if (error.status >= 500) {
        showError(
          'Erreur serveur',
          'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.',
          {
            retry: () => window.location.reload(),
          }
        );
      } else if (error.status === 0) {
        showWarning(
          'Connexion perdue',
          'La connexion avec le serveur a été perdue. Tentative de reconnexion...',
          {
            persistent: true,
          }
        );
      } else {
        showError('Erreur inattendue', `Une erreur inattendue s'est produite${contextStr}.`, {
          retry: () => window.location.reload(),
        });
      }
    },
    [showError, showWarning]
  );

  const handleValidationError = useCallback(
    (errors: Record<string, string[]>, context?: string) => {
      const contextStr = context ? ` (${context})` : '';
      const errorMessages = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('\n');

      showError(
        'Erreurs de validation',
        `Veuillez corriger les erreurs suivantes${contextStr}:\n${errorMessages}`,
        {
          persistent: true,
        }
      );
    },
    [showError]
  );

  const handleSuccess = useCallback(
    (_message: string, context?: string) => {
      const contextStr = context ? ` (${context})` : '';
      showInfo('Succès', `Opération effectuée avec succès${contextStr}.`);
    },
    [showInfo]
  );

  return {
    handleNetworkError,
    handleValidationError,
    handleSuccess,
  };
}

// Hook pour les erreurs de formulaires
export function useFormErrorHandler() {
  const { showError, showWarning } = useErrorNotifications();

  const handleFormError = useCallback(
    (error: any, formName?: string) => {
      const formStr = formName ? ` du formulaire "${formName}"` : '';

      if (error.code === 'VALIDATION_ERROR') {
        if (error.errors) {
          // Erreurs de validation spécifiques par champ
          const fieldErrors = Object.entries(error.errors)
            .map(
              ([field, messages]: [string, any]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('\n');

          showError(
            'Erreurs de validation',
            `Veuillez corriger les erreurs suivantes${formStr}:\n${fieldErrors}`,
            { persistent: true }
          );
        } else {
          showError('Données invalides', 'Les données saisies ne sont pas valides.', {
            persistent: true,
          });
        }
      } else if (error.code === 'REQUIRED_FIELD') {
        showWarning('Champs requis', 'Veuillez remplir tous les champs obligatoires.', {
          persistent: true,
        });
      } else if (error.code === 'DUPLICATE_ENTRY') {
        showError(
          'Doublon détecté',
          'Cette entrée existe déjà. Veuillez utiliser des valeurs différentes.'
        );
      } else {
        showError(
          'Erreur de formulaire',
          `Une erreur est survenue${formStr}. Veuillez réessayer.`,
          {
            retry: () => window.location.reload(),
          }
        );
      }
    },
    [showError, showWarning]
  );

  const handleFormSuccess = useCallback((message: string, formName?: string) => {
    const formStr = formName ? ` du formulaire "${formName}"` : '';
    // Utiliser le hook principal pour les succès
    import('./useErrorNotifications').then(({ useErrorNotifications }) => {
      const { showSuccess } = useErrorNotifications();
      showSuccess('Succès', `${message}${formStr}`);
    });
  }, []);

  return {
    handleFormError,
    handleFormSuccess,
  };
}

// Service global pour les erreurs
class ErrorNotificationService {
  private static instance: ErrorNotificationService;
  private listeners: Array<(notifications: ErrorNotification[]) => void> = [];

  static getInstance(): ErrorNotificationService {
    if (!ErrorNotificationService.instance) {
      ErrorNotificationService.instance = new ErrorNotificationService();
    }
    return ErrorNotificationService.instance;
  }

  subscribe(listener: (notifications: ErrorNotification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(notifications: ErrorNotification[]) {
    this.listeners.forEach((listener) => listener(notifications));
  }

  // Méthodes utilitaires globales
  static showError(_title: string, _message: string, _options?: Partial<ErrorNotification>) {
    console.warn('Use useErrorNotifications hook instead of static methods');
  }

  static showWarning(_title: string, _message: string, _options?: Partial<ErrorNotification>) {
    console.warn('Use useErrorNotifications hook instead of static methods');
  }
}

export { ErrorNotificationService };
export default useErrorNotifications;
