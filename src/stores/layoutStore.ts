import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface LayoutStore {
  useIOSLayout: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  toggleLayout: () => void;
  setIOSLayout: (value: boolean) => void;
  setDeviceType: (type: 'mobile' | 'tablet' | 'desktop') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Sélecteurs fins pour éviter les rendus inutiles
const createSelectors = <T extends Record<string, any>>(store: any) => ({
  useIOSLayout: () => store((state: T) => state.useIOSLayout),
  useDeviceType: () => store((state: T) => ({
    isMobile: state.isMobile,
    isTablet: state.isTablet,
    isDesktop: state.isDesktop
  })),
  useSidebarState: () => store((state: T) => state.sidebarOpen),
  useTheme: () => store((state: T) => state.theme),
  useIsMobile: () => store((state: T) => state.isMobile),
  useIsTablet: () => store((state: T) => state.isTablet),
  useIsDesktop: () => store((state: T) => state.isDesktop),
  useIsIOSLayout: () => store((state: T) => state.useIOSLayout),
});

export const useLayoutStore = create<LayoutStore>()(
  subscribeWithSelector((set, get) => ({
    // État initial
    useIOSLayout: true,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    sidebarOpen: true,
    theme: 'system' as const,
    
    // Actions
    toggleLayout: () => set((state) => ({ 
      useIOSLayout: !state.useIOSLayout,
      // Adapter la sidebar selon le layout
      sidebarOpen: !state.useIOSLayout ? false : state.sidebarOpen
    })),
    
    setIOSLayout: (value: boolean) => set((state) => ({ 
      useIOSLayout: value,
      sidebarOpen: value ? state.sidebarOpen : false
    })),
    
    setDeviceType: (type: 'mobile' | 'tablet' | 'desktop') => set(() => ({
      isMobile: type === 'mobile',
      isTablet: type === 'tablet',
      isDesktop: type === 'desktop',
      // Auto-fermer sidebar sur mobile
      sidebarOpen: type === 'mobile' ? false : get().sidebarOpen
    })),
    
    toggleSidebar: () => set((state) => ({ 
      sidebarOpen: !state.sidebarOpen 
    })),
    
    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    
    setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),
  }))
);

// Créer les sélecteurs optimisés
const selectors = createSelectors(useLayoutStore);

// Exporter les sélecteurs fins pour éviter les re-rendus
export const {
  useIOSLayout,
  useDeviceType,
  useSidebarState,
  useTheme,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsIOSLayout: useIsIOSLayoutSelector,
} = selectors;

// Subscribe aux changements pour debugging et analytics
useLayoutStore.subscribe(
  (state) => state.useIOSLayout,
  (useIOSLayout) => {
    console.log('Layout changed to:', useIOSLayout ? 'iOS' : 'Desktop');
  }
);

useLayoutStore.subscribe(
  (state) => state.theme,
  (theme) => {
    console.log('Theme changed to:', theme);
    // Appliquer le thème au document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }
);
