import { create } from 'zustand';

interface LayoutStore {
  useIOSLayout: boolean;
  toggleLayout: () => void;
  setIOSLayout: (value: boolean) => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  useIOSLayout: true, // Par défaut, utiliser le layout iOS
  toggleLayout: () => set((state) => ({ useIOSLayout: !state.useIOSLayout })),
  setIOSLayout: (value: boolean) => set({ useIOSLayout: value }),
}));
