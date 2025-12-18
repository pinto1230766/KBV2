import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings, Language, Theme, NotificationSettings, AISettings } from '@/types';
import * as idb from '@/utils/idb';

// ============================================================================
// PARAMÈTRES PAR DÉFAUT
// ============================================================================

const defaultSettings: Settings = {
  theme: 'light',
  language: 'fr',
  notifications: {
    enabled: true,
    reminderDays: [7, 2],
    sound: true,
    vibration: true,
  },
  aiSettings: {
    enabled: false,
    model: 'gemini-pro',
    temperature: 0.7,
    apiKey: undefined,
  },
  encryptionEnabled: false,
  sessionTimeout: 30, // 30 minutes
  autoArchiveDays: 90,
};

// ============================================================================
// CONTEXT
// ============================================================================

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setNotifications: (notifications: Partial<NotificationSettings>) => void;
  setAISettings: (aiSettings: Partial<AISettings>) => void;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les paramètres depuis IndexedDB
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await idb.get<Settings>('kbv-settings');
        if (saved) {
          setSettings({ ...defaultSettings, ...saved });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  // Sauvegarder les paramètres dans IndexedDB
  useEffect(() => {
    if (isLoaded) {
      idb.set('kbv-settings', settings).catch((error) => {
        console.error('Error saving settings:', error);
      });
    }
  }, [settings, isLoaded]);

  // Appliquer le thème
  useEffect(() => {
    const root = document.documentElement;

    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto: détecter la préférence système
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Appliquer la langue
  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  // Fonctions de mise à jour
  const updateSettings = async (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const setTheme = (theme: Theme) => {
    updateSettings({ theme });
  };

  const setLanguage = (language: Language) => {
    updateSettings({ language });
  };

  const setNotifications = (notifications: Partial<NotificationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...notifications },
    }));
  };

  const setAISettings = (aiSettings: Partial<AISettings>) => {
    setSettings((prev) => ({
      ...prev,
      aiSettings: { ...prev.aiSettings, ...aiSettings },
    }));
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);
    await idb.set('kbv-settings', defaultSettings);
  };

  if (!isLoaded) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600' />
      </div>
    );
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        setTheme,
        setLanguage,
        setNotifications,
        setAISettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
