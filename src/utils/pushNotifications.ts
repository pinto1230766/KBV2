/**
 * Système de Notifications Push pour KBV Lyon
 * Notifications natives du navigateur avec gestion des permissions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export type NotificationPermission = 'default' | 'granted' | 'denied';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  timestamp: number;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error' | 'visit' | 'message' | 'reminder';
  action?: {
    label: string;
    url?: string;
    callback?: () => void;
  };
}

export interface NotificationPreferences {
  enabled: boolean;
  sound: boolean;
  vibrate: boolean;
  types: {
    visits: boolean;
    messages: boolean;
    reminders: boolean;
    updates: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "07:00"
  };
}

// ============================================================================
// GESTIONNAIRE DE NOTIFICATIONS
// ============================================================================

class PushNotificationManager {
  private static instance: PushNotificationManager;
  private swRegistration: ServiceWorkerRegistration | null = null;
  
  static getInstance(): PushNotificationManager {
    if (!PushNotificationManager.instance) {
      PushNotificationManager.instance = new PushNotificationManager();
    }
    return PushNotificationManager.instance;
  }
  
  // ============================================================================
  // PERMISSIONS
  // ============================================================================
  
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return 'denied';
    }
    
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission as NotificationPermission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }
  
  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission as NotificationPermission;
  }
  
  isSupported(): boolean {
    return 'Notification' in window;
  }
  
  isPushSupported(): boolean {
    return 'PushManager' in window && 'serviceWorker' in navigator;
  }
  
  // ============================================================================
  // SERVICE WORKER
  // ============================================================================
  
  async registerServiceWorker(): Promise<boolean> {
    if (!this.isPushSupported()) {
      console.warn('Push notifications not supported');
      return false;
    }
    
    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.swRegistration);
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }
  
  async subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      await this.registerServiceWorker();
    }
    
    if (!this.swRegistration) return null;
    
    try {
      const applicationServerKey = this.urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer
      });
      
      console.log('Push subscription:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return null;
    }
  }
  
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }
  
  // ============================================================================
  // AFFICHAGE DE NOTIFICATIONS
  // ============================================================================
  
  async show(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): Promise<string | null> {
    if (this.getPermission() !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }
    
    // Vérifier les heures silencieuses
    const prefs = useNotificationStore.getState().preferences;
    if (this.isQuietHours(prefs)) {
      console.log('In quiet hours, notification queued');
      // Stocker la notification pour plus tard
      return null;
    }
    
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const options: NotificationOptions = {
      body: notification.body,
      icon: notification.icon || '/logo.svg',
      badge: notification.badge || '/badge.svg',
      tag: notification.tag || id,
      data: { ...notification.data, id },
      requireInteraction: notification.type === 'warning' || notification.type === 'error',
      silent: !prefs.sound
    };
    
    // Vibration is handled separately via Navigator.vibrate() if supported
    if (prefs.vibrate && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    
    try {
      // Utiliser le Service Worker si disponible
      if (this.swRegistration) {
        await this.swRegistration.showNotification(notification.title, options);
      } else {
        // Fallback sur Notification standard
        new Notification(notification.title, options);
      }
      
      // Ajouter au store
      useNotificationStore.getState().addNotification({
        ...notification,
        id,
        timestamp: Date.now(),
        read: false
      });
      
      return id;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return null;
    }
  }
  
  // ============================================================================
  // NOTIFICATIONS PRÉDÉFINIES
  // ============================================================================
  
  async notifyVisitReminder(visitName: string, visitDate: string, visitTime: string): Promise<string | null> {
    return this.show({
      title: '📅 Rappel de visite',
      body: `${visitName} - ${visitDate} à ${visitTime}`,
      type: 'reminder',
      action: {
        label: 'Voir le planning',
        url: '/planning'
      }
    });
  }
  
  async notifyNewMessage(senderName: string, preview: string): Promise<string | null> {
    return this.show({
      title: '💬 Nouveau message',
      body: `${senderName}: ${preview.substring(0, 100)}...`,
      type: 'message',
      action: {
        label: 'Lire le message',
        url: '/messages'
      }
    });
  }
  
  async notifyVisitConfirmed(speakerName: string, date: string): Promise<string | null> {
    return this.show({
      title: '✅ Visite confirmée',
      body: `La visite de ${speakerName} le ${date} a été confirmée`,
      type: 'success',
      action: {
        label: 'Voir les détails',
        url: '/planning'
      }
    });
  }
  
  async notifyActionRequired(message: string): Promise<string | null> {
    return this.show({
      title: '⚠️ Action requise',
      body: message,
      type: 'warning',
      action: {
        label: 'Traiter',
        url: '/planning'
      }
    });
  }
  
  async notifyError(message: string): Promise<string | null> {
    return this.show({
      title: '❌ Erreur',
      body: message,
      type: 'error'
    });
  }
  
  // ============================================================================
  // UTILITAIRES
  // ============================================================================
  
  private isQuietHours(prefs: NotificationPreferences): boolean {
    if (!prefs.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = prefs.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = prefs.quietHours.end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Gérer le cas où les heures silencieuses passent minuit
    if (startMinutes > endMinutes) {
      return currentTime >= startMinutes || currentTime <= endMinutes;
    }
    
    return currentTime >= startMinutes && currentTime <= endMinutes;
  }
}

// ============================================================================
// STORE ZUSTAND
// ============================================================================

interface NotificationStore {
  notifications: AppNotification[];
  unreadCount: number;
  permission: NotificationPermission;
  preferences: NotificationPreferences;
  
  // Actions
  addNotification: (notification: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  setPermission: (permission: NotificationPermission) => void;
  requestPermission: () => Promise<void>;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  sound: true,
  vibrate: true,
  types: {
    visits: true,
    messages: true,
    reminders: true,
    updates: true
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '07:00'
  }
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      permission: 'default',
      preferences: DEFAULT_PREFERENCES,
      
      addNotification: (notification) => {
        set((state) => {
          const notifications = [notification, ...state.notifications].slice(0, 100); // Max 100
          const unreadCount = notifications.filter(n => !n.read).length;
          return { notifications, unreadCount };
        });
      },
      
      markAsRead: (id) => {
        set((state) => {
          const notifications = state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          );
          const unreadCount = notifications.filter(n => !n.read).length;
          return { notifications, unreadCount };
        });
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }));
      },
      
      removeNotification: (id) => {
        set((state) => {
          const notifications = state.notifications.filter(n => n.id !== id);
          const unreadCount = notifications.filter(n => !n.read).length;
          return { notifications, unreadCount };
        });
      },
      
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },
      
      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs }
        }));
      },
      
      setPermission: (permission) => {
        set({ permission });
      },
      
      requestPermission: async () => {
        const manager = PushNotificationManager.getInstance();
        const permission = await manager.requestPermission();
        set({ permission });
      }
    }),
    {
      name: 'kbv-notifications',
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 50), // Persister max 50
        preferences: state.preferences
      })
    }
  )
);

// ============================================================================
// HOOK PERSONNALISÉ
// ============================================================================

export const usePushNotifications = () => {
  const store = useNotificationStore();
  const manager = PushNotificationManager.getInstance();
  
  return {
    ...store,
    
    // Manager methods
    isSupported: manager.isSupported(),
    isPushSupported: manager.isPushSupported(),
    
    // Demander les permissions
    requestPermission: store.requestPermission,
    
    // Afficher une notification
    show: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => 
      manager.show(notification),
    
    // Notifications prédéfinies
    notifyVisitReminder: manager.notifyVisitReminder.bind(manager),
    notifyNewMessage: manager.notifyNewMessage.bind(manager),
    notifyVisitConfirmed: manager.notifyVisitConfirmed.bind(manager),
    notifyActionRequired: manager.notifyActionRequired.bind(manager),
    notifyError: manager.notifyError.bind(manager),
    
    // Utilitaires
    hasUnread: store.unreadCount > 0,
    recentNotifications: store.notifications.slice(0, 10)
  };
};

// ============================================================================
// COMPOSANT INDICATEUR DE NOTIFICATIONS
// ============================================================================

export const getNotificationIcon = (type: AppNotification['type']): string => {
  switch (type) {
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    case 'visit': return '📅';
    case 'message': return '💬';
    case 'reminder': return '⏰';
    default: return 'ℹ️';
  }
};

export const getNotificationColor = (type: AppNotification['type']): string => {
  switch (type) {
    case 'success': return 'text-green-600 bg-green-100';
    case 'warning': return 'text-yellow-600 bg-yellow-100';
    case 'error': return 'text-red-600 bg-red-100';
    case 'visit': return 'text-blue-600 bg-blue-100';
    case 'message': return 'text-purple-600 bg-purple-100';
    case 'reminder': return 'text-orange-600 bg-orange-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  PushNotificationManager
};

export default {
  PushNotificationManager,
  useNotificationStore,
  usePushNotifications,
  getNotificationIcon,
  getNotificationColor,
  DEFAULT_PREFERENCES
};
