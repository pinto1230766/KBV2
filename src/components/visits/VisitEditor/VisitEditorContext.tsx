import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Visit } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { useVisitNotifications } from '@/hooks/useVisitNotifications';

export type VisitEditorTab = 'details' | 'hosts' | 'logistics' | 'expenses' | 'messages' | 'history';

type VisitEditorMode = 'edit' | 'create';

interface VisitEditorContextValue {
  visit: Visit;
  mode: VisitEditorMode;
  formData: Partial<Visit>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Visit>>>;
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  markDirty: () => void;
  activeTab: VisitEditorTab;
  setActiveTab: (tab: VisitEditorTab) => void;
  saveVisit: () => Promise<void>;
  deleteVisit: () => Promise<void>;
  refreshVisit: (updated: Visit) => void;
  isSaving: boolean;
}

const VisitEditorContext = createContext<VisitEditorContextValue | undefined>(undefined);

interface VisitEditorProviderProps {
  visit: Visit;
  mode?: VisitEditorMode;
  initialTab?: VisitEditorTab;
  children: React.ReactNode;
}

export const VisitEditorProvider: React.FC<VisitEditorProviderProps> = ({ visit, mode = 'edit', initialTab = 'details', children }) => {
  const { updateVisit, deleteVisit } = useData();
  const { scheduleVisitReminder, cancelVisitReminder } = useVisitNotifications();
  const { addToast } = useToast();

  const [formDataState, setFormDataState] = useState<Partial<Visit>>(visit);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<VisitEditorTab>(initialTab);

  const markDirty = useCallback(() => setIsDirty(true), []);

  const setFormData = useCallback<React.Dispatch<React.SetStateAction<Partial<Visit>>>>(
    (updater) => {
      setFormDataState((prev) => {
        const next = typeof updater === 'function' ? (updater as (p: Partial<Visit>) => Partial<Visit>)(prev) : updater;
        return next;
      });
      markDirty();
    },
    [markDirty]
  );

  const saveVisit = useCallback(async () => {
    setIsSaving(true);
    try {
      await cancelVisitReminder(visit.visitId);
      const updatedVisit = { ...visit, ...formDataState } as Visit;
      await updateVisit(updatedVisit);
      await scheduleVisitReminder(updatedVisit);
      addToast('Visite mise à jour', 'success');
      setIsDirty(false);
    } catch (error) {
      console.error('VisitEditor save error:', error);
      addToast("Erreur lors de l'enregistrement", 'error');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [addToast, cancelVisitReminder, formDataState, scheduleVisitReminder, updateVisit, visit]);

  const deleteVisitHandler = useCallback(async () => {
    setIsSaving(true);
    try {
      await cancelVisitReminder(visit.visitId);
      await deleteVisit(visit.visitId);
      addToast('Visite supprimée', 'success');
    } catch (error) {
      console.error('VisitEditor delete error:', error);
      addToast('Erreur lors de la suppression', 'error');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [addToast, cancelVisitReminder, deleteVisit, visit.visitId]);

  const refreshVisit = useCallback((updated: Visit) => {
    setFormDataState(updated);
    setIsDirty(false);
  }, []);

  const value = useMemo(
    () => ({
      visit,
      mode,
      formData: formDataState,
      setFormData,
      isDirty,
      setIsDirty,
      activeTab,
      setActiveTab,
      saveVisit,
      deleteVisit: deleteVisitHandler,
      refreshVisit,
      isSaving,
      markDirty,
    }),
    [visit, mode, formDataState, isDirty, activeTab, saveVisit, deleteVisitHandler, refreshVisit, isSaving, markDirty]
  );

  return <VisitEditorContext.Provider value={value}>{children}</VisitEditorContext.Provider>;
};

export const useVisitEditor = (): VisitEditorContextValue => {
  const context = useContext(VisitEditorContext);
  if (!context) {
    throw new Error('useVisitEditor must be used within a VisitEditorProvider');
  }
  return context;
};
