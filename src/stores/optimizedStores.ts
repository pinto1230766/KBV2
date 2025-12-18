import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

// Types pour nos stores optimisés
interface UserStore {
  user: {
    id: string;
    name: string;
    email: string;
    preferences: {
      theme: 'light' | 'dark' | 'system';
      language: string;
      notifications: boolean;
    };
  } | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: any) => void;
  updatePreferences: (preferences: Partial<any>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface AppStore {
  // État de l'application
  isInitialized: boolean;
  currentPage: string;
  sidebarOpen: boolean;
  modals: {
    [key: string]: boolean;
  };
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: number;
  }>;

  // Actions
  initialize: () => void;
  setCurrentPage: (page: string) => void;
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  addNotification: (notification: Omit<any, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface DevStore {
  devMode: boolean;
  debugEnabled: boolean;
  toggleDevMode: () => void;
  setDebugEnabled: (enabled: boolean) => void;
  logAction: (action: string, data?: any) => void;
}

// Store utilisateur avec Immer pour l'immutabilité
export const useUserStore = create<UserStore>()(
  subscribeWithSelector(
    persist(
      immer((_set) => ({
        // État initial
        user: null,
        isLoading: false,
        error: null,

        // Actions avec Immer pour l'immutabilité
        setUser: (user) =>
          _set((state) => {
            state.user = user;
            state.error = null;
          }),

        updatePreferences: (preferences) =>
          _set((state) => {
            if (state.user) {
              state.user.preferences = { ...state.user.preferences, ...preferences };
            }
          }),

        clearUser: () =>
          _set((state) => {
            state.user = null;
            state.error = null;
          }),

        setLoading: (loading) =>
          _set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          _set((state) => {
            state.error = error;
          }),
      })),
      {
        name: 'kbv-user-store',
        partialize: (state) => ({ user: state.user }),
      }
    )
  )
);

// Store application avec Immer
export const useAppStore = create<AppStore>()(
  subscribeWithSelector(
    immer((_set) => ({
      // État initial
      isInitialized: false,
      currentPage: 'dashboard',
      sidebarOpen: true,
      modals: {},
      notifications: [],

      // Actions avec Immer
      initialize: () =>
        _set((state) => {
          state.isInitialized = true;
        }),

      setCurrentPage: (page) =>
        _set((state) => {
          state.currentPage = page;
        }),

      toggleSidebar: () =>
        _set((state) => {
          state.sidebarOpen = !state.sidebarOpen;
        }),

      openModal: (modalId) =>
        _set((state) => {
          state.modals[modalId] = true;
        }),

      closeModal: (modalId) =>
        _set((state) => {
          state.modals[modalId] = false;
        }),

      addNotification: (notification) =>
        _set((state) => {
          state.notifications.push({
            ...notification,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
          });
        }),

      removeNotification: (id) =>
        _set((state) => {
          state.notifications = state.notifications.filter((n: any) => n.id !== id);
        }),

      clearNotifications: () =>
        _set((state) => {
          state.notifications = [];
        }),
    }))
  )
);

// Sélecteurs optimisés pour éviter les re-rendus inutiles
export const useUserSelector = {
  user: () => useUserStore((state) => state.user),
  isLoading: () => useUserStore((state) => state.isLoading),
  error: () => useUserStore((state) => state.error),
  preferences: () => useUserStore((state) => state.user?.preferences),
  isAuthenticated: () => useUserStore((state) => Boolean(state.user)),
};

export const useAppSelector = {
  isInitialized: () => useAppStore((state) => state.isInitialized),
  currentPage: () => useAppStore((state) => state.currentPage),
  sidebarOpen: () => useAppStore((state) => state.sidebarOpen),
  modals: () => useAppStore((state) => state.modals),
  notifications: () => useAppStore((state) => state.notifications),
  unreadNotifications: () =>
    useAppStore((state) =>
      state.notifications.filter(
        (n: any) => Date.now() - n.timestamp < 5000 // 5 secondes
      )
    ),
};

// Hook composite pour les actions courantes
export const useStoreActions = () => {
  const userStore = useUserStore();
  const appStore = useAppStore();

  return {
    // Actions utilisateur
    setUser: userStore.setUser,
    updatePreferences: userStore.updatePreferences,
    clearUser: userStore.clearUser,
    setLoading: userStore.setLoading,
    setError: userStore.setError,

    // Actions application
    initialize: appStore.initialize,
    setCurrentPage: appStore.setCurrentPage,
    toggleSidebar: appStore.toggleSidebar,
    openModal: appStore.openModal,
    closeModal: appStore.closeModal,
    addNotification: appStore.addNotification,
    removeNotification: appStore.removeNotification,
    clearNotifications: appStore.clearNotifications,

    // Actions combinées
    logout: () => {
      userStore.clearUser();
      appStore.clearNotifications();
    },

    showSuccess: (message: string) => {
      appStore.addNotification({
        type: 'success',
        message,
      });
    },

    showError: (message: string) => {
      appStore.addNotification({
        type: 'error',
        message,
      });
    },
  };
};

// Store de développement avec debugging
export const useDevStore = create<DevStore>()(
  subscribeWithSelector(
    immer((_set) => ({
      devMode: false,
      debugEnabled: false,

      toggleDevMode: () =>
        _set((state: any) => {
          state.devMode = !state.devMode;
        }),

      setDebugEnabled: (enabled) =>
        _set((state: any) => {
          state.debugEnabled = enabled;
        }),

      logAction: (action: string, data?: any) => {
        const state = useDevStore.getState();
        if (state.debugEnabled) {
          console.log(`🎯 [DevStore] ${action}`, data);
        }
      },
    }))
  )
);

// Selectors pour le debugging
export const useDevSelectors = {
  devMode: () => useDevStore((state) => state.devMode),
  debugEnabled: () => useDevStore((state) => state.debugEnabled),
};

export default {
  useUserStore,
  useAppStore,
  useUserSelector,
  useAppSelector,
  useStoreActions,
  useDevStore,
  useDevSelectors,
};
