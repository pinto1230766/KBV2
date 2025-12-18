/**
 * AuthContext - Contexte d'authentification React pour KBV Lyon
 * Fournit l'état d'authentification et les actions à tous les composants
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from 'react';
import {
  useAuth,
  setupTokenRefresh,
  cleanupTokenRefresh,
  User,
  LoginCredentials,
  RegisterData,
  SessionInfo,
  SECURITY_CONFIG,
} from '@/utils/auth';

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextValue {
  // État
  user: User | null;
  session: SessionInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isSessionLocked: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  lockSession: () => void;
  unlockSession: (password: string) => Promise<boolean>;

  // Utilitaires
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  getSessionDuration: () => number;
  getIdleTime: () => number;
}

interface AuthProviderProps {
  children: ReactNode;
  onSessionExpired?: () => void;
  onSessionLocked?: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  onSessionExpired,
  onSessionLocked,
}) => {
  const auth = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser l'authentification au montage
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Vérifier le statut d'authentification
        await auth.checkAuthStatus();

        // Configurer le refresh automatique des tokens
        setupTokenRefresh();

        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setIsInitialized(true);
      }
    };

    initAuth();

    // Nettoyage au démontage
    return () => {
      cleanupTokenRefresh();
    };
  }, []);

  // Écouter les changements de session
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    // Vérifier si la session est verrouillée
    if (auth.session?.isLocked && onSessionLocked) {
      onSessionLocked();
    }
  }, [auth.session?.isLocked, auth.isAuthenticated, onSessionLocked]);

  // Écouter les événements de visibilité de la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && auth.isAuthenticated) {
        // Mettre à jour l'activité quand la page redevient visible
        auth.updateActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [auth.isAuthenticated]);

  // Wrapper pour logout avec callback
  const handleLogout = useCallback(() => {
    auth.logout();
    if (onSessionExpired) {
      onSessionExpired();
    }
  }, [auth, onSessionExpired]);

  // Valeur du contexte
  const value: AuthContextValue = {
    // État
    user: auth.user,
    session: auth.session,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || !isInitialized,
    error: auth.error,
    isSessionLocked: auth.isSessionLocked(),

    // Actions
    login: auth.login,
    register: auth.register,
    logout: handleLogout,
    refreshToken: auth.refreshToken,
    updateProfile: auth.updateProfile,
    clearError: auth.clearError,
    lockSession: auth.lockSession,
    unlockSession: auth.unlockSession,

    // Utilitaires
    hasPermission: auth.hasPermission,
    hasRole: auth.hasRole,
    isAdmin: auth.isAdmin,
    isModerator: auth.isModerator,
    getSessionDuration: auth.getSessionDuration,
    getIdleTime: auth.getIdleTime,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// HOOK
// ============================================================================

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};

// ============================================================================
// COMPOSANT DE PROTECTION DE ROUTE
// ============================================================================

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'moderator' | 'user';
  requiredPermission?: string;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallback = null,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuthContext();

  // Afficher le fallback pendant le chargement
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Rediriger si non authentifié
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return null;
  }

  // Vérifier le rôle requis
  if (requiredRole && !hasRole(requiredRole)) {
    return <UnauthorizedMessage />;
  }

  // Vérifier la permission requise
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <UnauthorizedMessage />;
  }

  return <>{children}</>;
};

// ============================================================================
// COMPOSANT DE MESSAGE NON AUTORISÉ
// ============================================================================

const UnauthorizedMessage: React.FC = () => (
  <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
    <div className='text-center p-8'>
      <div className='text-6xl mb-4'>🔒</div>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>Accès non autorisé</h1>
      <p className='text-gray-600 dark:text-gray-400 mb-4'>
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <button
        onClick={() => window.history.back()}
        className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
      >
        Retour
      </button>
    </div>
  </div>
);

// ============================================================================
// COMPOSANT D'ÉCRAN DE VERROUILLAGE
// ============================================================================

interface LockScreenProps {
  onUnlock: (password: string) => Promise<boolean>;
  userName?: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, userName }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUnlocking(true);

    try {
      const success = await onUnlock(password);
      if (!success) {
        setError('Mot de passe incorrect');
        setPassword('');
      }
    } catch (err) {
      setError('Erreur lors du déverrouillage');
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm'>
      <div className='w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl'>
        <div className='text-center mb-8'>
          <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center'>
            <span className='text-4xl'>🔐</span>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Session verrouillée</h2>
          {userName && (
            <p className='text-gray-600 dark:text-gray-400 mt-2'>Bienvenue, {userName}</p>
          )}
          <p className='text-sm text-gray-500 dark:text-gray-500 mt-2'>
            Entrez votre mot de passe pour continuer
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Mot de passe'
              className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              autoFocus
              disabled={isUnlocking}
            />
          </div>

          {error && <p className='text-red-500 text-sm text-center'>{error}</p>}

          <button
            type='submit'
            disabled={isUnlocking || !password}
            className='w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isUnlocking ? 'Déverrouillage...' : 'Déverrouiller'}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <button
            onClick={() => (window.location.href = '/login')}
            className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPOSANT D'AVERTISSEMENT DE SESSION
// ============================================================================

interface SessionWarningProps {
  remainingTime: number; // en secondes
  onExtend: () => void;
  onLogout: () => void;
}

export const SessionWarning: React.FC<SessionWarningProps> = ({
  remainingTime,
  onExtend,
  onLogout,
}) => {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className='fixed bottom-4 right-4 z-50 w-80 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-lg'>
      <div className='flex items-start gap-3'>
        <span className='text-2xl'>⚠️</span>
        <div className='flex-1'>
          <h3 className='font-semibold text-yellow-800 dark:text-yellow-200'>
            Session bientôt expirée
          </h3>
          <p className='text-sm text-yellow-700 dark:text-yellow-300 mt-1'>
            Votre session expire dans {minutes}:{seconds.toString().padStart(2, '0')}
          </p>
          <div className='flex gap-2 mt-3'>
            <button
              onClick={onExtend}
              className='px-3 py-1.5 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors'
            >
              Prolonger
            </button>
            <button
              onClick={onLogout}
              className='px-3 py-1.5 text-sm text-yellow-700 dark:text-yellow-300 hover:underline'
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export { SECURITY_CONFIG };
export type { AuthContextValue, AuthProviderProps, ProtectedRouteProps };
