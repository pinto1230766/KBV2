import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutStore {
  useIOSLayout: boolean;
  toggleLayout: () => void;
  setIOSLayout: (value: boolean) => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      useIOSLayout: true, // Par défaut, utiliser le layout iOS
      toggleLayout: () => set((state) => ({ useIOSLayout: !state.useIOSLayout })),
      setIOSLayout: (value) => set({ useIOSLayout: value }),
    }),
    {
      name: 'layout-preference',
    }
  )
);
