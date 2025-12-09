import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { AppData, Speaker, Visit, Host, MessageType, MessageRole, Language, SyncAction } from '@/types';
import * as idb from '@/utils/idb';
import { defaultAppData } from '@/data/constants';
import { useToast } from '@/contexts/ToastContext';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { getTalkTitle } from '@/data/talkTitles';

// Utility functions for Google Sheets sync
const UNASSIGNED_HOST = 'À définir';

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const parseDate = (dateStr: string): Date | null => {
  // Handle DD/MM/YYYY, DD-MM-YYYY, or other formats
  const parts = dateStr.split(/[/\-.]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month is 0-indexed
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  return null;
};

// Types condensés pour le context
interface DataContextValue extends AppData {
  addSpeaker: (speaker: Speaker) => void;
  updateSpeaker: (speaker: Speaker) => void;
  deleteSpeaker: (id: string) => void;
  
  addVisit: (visit: Visit) => void;
  updateVisit: (visit: Visit) => void;
  deleteVisit: (visitId: string) => void;
  completeVisit: (visit: Visit) => void;
  
  addHost: (host: Host) => void;
  updateHost: (name: string, data: Partial<Host>) => void;
  deleteHost: (name: string) => void;
  
  logCommunication: (visitId: string, type: MessageType, role: MessageRole) => void;
  saveCustomTemplate: (lang: Language, type: MessageType, role: MessageRole, text: string) => void;
  updateCongregationProfile: (profile: any) => void;
  
  exportData: () => string;
  importData: (json: string) => void;
  resetData: () => void;
  syncWithGoogleSheet: () => Promise<void>;

  refreshData: () => Promise<void>;
  
  // Sync
  syncQueue: SyncAction[];
  isOnline: boolean;
  clearSyncQueue: () => void;
  mergeDuplicates: (type: 'speaker' | 'host' | 'visit', keepId: string, duplicateIds: string[]) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultAppData);
  const [loaded, setLoaded] = useState(false);
  const { addToast } = useToast();
  
  const { queue: syncQueue, addAction: addToSyncQueue, clearQueue: clearSyncQueue } = useSyncQueue();
  // On utilise useOfflineMode simplement pour le statut online ici, 
  // car le chargement de données est déjà géré par useEffect + idb ci-dessous
  const { isOnline } = useOfflineMode('app_state', async () => defaultAppData);

  // Load - Charger depuis IDB ou depuis le fichier JSON initial
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const saved = await idb.get<AppData>('kbv-app-data');
        
        if (saved && saved.speakers && saved.speakers.length > 0) {
          // Données existantes dans IDB - ajouter les titres manquants et les hôtes s'ils sont vides
          const visitsWithTitles = saved.visits.map(visit => ({
            ...visit,
            talkTheme: visit.talkTheme || getTalkTitle(visit.talkNoOrType)
          }));
          
          // Injecter les hôtes par défaut s'ils sont manquants (migration)
          const hosts = (!saved.hosts || saved.hosts.length === 0) ? defaultAppData.hosts : saved.hosts;
          
          setData({ ...defaultAppData, ...saved, visits: visitsWithTitles, hosts });
        } else {
          // Première utilisation : charger depuis le fichier JSON
          const response = await fetch('/kbv-backup-2025-12-08.json');
          if (response.ok) {
            const jsonData = await response.json();
            // Ajouter automatiquement les titres aux visites
            const visitsWithTitles = jsonData.visits.map((visit: Visit) => ({
              ...visit,
              talkTheme: visit.talkTheme || getTalkTitle(visit.talkNoOrType)
            }));
            const mergedData = { ...defaultAppData, ...jsonData, visits: visitsWithTitles };
            setData(mergedData);
            // Sauvegarder immédiatement dans IDB
            await idb.set('kbv-app-data', mergedData);
            addToast('Données initiales chargées avec succès !', 'success');
          } else {
            setData(defaultAppData);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setData(defaultAppData);
      } finally {
        setLoaded(true);
      }
    };
    
    loadInitialData();
  }, []);

  // Save
  useEffect(() => {
    if (loaded) idb.set('kbv-app-data', data);
  }, [data, loaded]);

  // Speakers
  const addSpeaker = (speaker: Speaker) => {
    setData((d) => ({ ...d, speakers: [...d.speakers, speaker] }));
    addToSyncQueue('ADD_SPEAKER', speaker);
  };

  const updateSpeaker = (speaker: Speaker) => {
    setData((d) => ({
      ...d,
      speakers: d.speakers.map((s) => (s.id === speaker.id ? speaker : s)),
    }));
    addToSyncQueue('UPDATE_SPEAKER', speaker);
  };

  const deleteSpeaker = (id: string) => {
    setData((d) => ({ ...d, speakers: d.speakers.filter((s) => s.id !== id) }));
    addToSyncQueue('DELETE_SPEAKER', { id });
  };

  // Visits
  const addVisit = (visit: Visit) => {
    setData((d) => ({ ...d, visits: [...d.visits, visit] }));
    addToSyncQueue('ADD_VISIT', visit);
  };

  const updateVisit = (visit: Visit) => {
    setData((d) => ({
      ...d,
      visits: d.visits.map((v) => (v.visitId === visit.visitId ? visit : v)),
    }));
    addToSyncQueue('UPDATE_VISIT', visit);
  };

  const deleteVisit = (visitId: string) => {
    setData((d) => ({ ...d, visits: d.visits.filter((v) => v.visitId !== visitId) }));
    addToSyncQueue('DELETE_VISIT', { visitId });
  };

  const completeVisit = (visit: Visit) => {
    setData((d) => ({
      ...d,
      visits: d.visits.filter((v) => v.visitId !== visit.visitId),
      archivedVisits: [...d.archivedVisits, { ...visit, status: 'completed' }],
    }));
  };

  // Hosts
  const addHost = (host: Host) => {
    setData((d) => ({ ...d, hosts: [...d.hosts, host] }));
  };

  const updateHost = (name: string, updates: Partial<Host>) => {
    setData((d) => ({
      ...d,
      hosts: d.hosts.map((h) => (h.nom === name ? { ...h, ...updates } : h)),
    }));
  };

  const deleteHost = (name: string) => {
    setData((d) => ({ ...d, hosts: d.hosts.filter((h) => h.nom !== name) }));
  };

  // Communication
  const logCommunication = (visitId: string, type: MessageType, role: MessageRole) => {
    setData((d) => ({
      ...d,
      visits: d.visits.map((v) =>
        v.visitId === visitId
          ? {
              ...v,
              communicationStatus: {
                ...v.communicationStatus,
                [type]: {
                  ...(v.communicationStatus?.[type] || {}),
                  [role]: new Date().toISOString(),
                },
              },
            }
          : v
      ),
    }));
  };

  // Templates
  const saveCustomTemplate = (lang: Language, type: MessageType, role: MessageRole, text: string) => {
    setData((d) => ({
      ...d,
      customTemplates: {
        ...d.customTemplates,
        [lang]: {
          ...(d.customTemplates[lang] || {}),
          [type]: {
            ...((d.customTemplates[lang] as any)?.[type] || {}),
            [role]: text,
          },
        },
      },
    }));
  };

  // Profile
  const updateCongregationProfile = (profile: any) => {
    setData((d) => ({
      ...d,
      congregationProfile: { ...d.congregationProfile, ...profile },
    }));
  };



  const resetData = () => {
    setData(defaultAppData);
    idb.clear();
  };

  // Google Sheets Sync
  const syncWithGoogleSheet = async (): Promise<void> => {
    const googleSheetId = '1drIzPPi6AohCroSyUkF1UmMFxuEtMACBF4XATDjBOcg';
    const range = 'A:E';
    const sheetGidsToTry = ['490509024', '1817293373', '936069614', '1474640023'];

    let allRows: any[] = [];
    let cols: any = null;
    let successfulGids: string[] = [];

    for (const gid of sheetGidsToTry) {
      const url = `https://docs.google.com/spreadsheets/d/${googleSheetId}/gviz/tq?gid=${gid}&range=${encodeURIComponent(range)}&tqx=out:json`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`Could not fetch sheet with gid "${gid}". Trying next one.`);
          continue;
        }

        const rawText = await response.text();
        const jsonMatch = rawText.match(/google\.visualization\.Query\.setResponse\((.*)\)/);
        if (!jsonMatch || !jsonMatch[1]) {
          console.warn(`Invalid response from sheet with gid "${gid}". Trying next one.`);
          continue;
        }

        const parsedData = JSON.parse(jsonMatch[1]);
        if (parsedData.status === 'error') {
          console.warn(`Error in sheet with gid "${gid}": ${parsedData.errors.map((e: any) => e.detailed_message).join(', ')}. Trying next one.`);
          continue;
        }

        if (parsedData.table && parsedData.table.rows) {
          allRows.push(...parsedData.table.rows);
          if (!cols) cols = parsedData.table.cols;
          successfulGids.push(gid);
        }
      } catch (error) {
        console.warn(`Error fetching or parsing sheet with gid "${gid}":`, error);
      }
    }

    if (allRows.length === 0) {
      setTimeout(() => addToast('Impossible de récupérer des données depuis les onglets spécifiés.', 'error'), 0);
      return;
    }

    try {
      const rows = allRows;

      if (!rows || rows.length === 0) {
        setTimeout(() => addToast('Aucune donnée trouvée dans les feuilles synchronisées.', 'warning'), 0);
        return;
      }

      const headers = cols.map((h: any) => h.label.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, ''));
      const dateIndex = headers.findIndex((h: string) => h.includes('data'));
      const speakerIndex = headers.findIndex((h: string) => h.includes('orador'));
      const congIndex = headers.findIndex((h: string) => h.includes('kongregason'));
      const talkNoIndex = headers.findIndex((h: string) => h === 'n' || h === 'no');
      const themeIndex = headers.findIndex((h: string) => h.includes('tema'));

      if ([dateIndex, speakerIndex, congIndex].some(i => i === -1)) {
        setTimeout(() => addToast("En-têtes requis manquants: Data, Orador, Kongregason.", 'error'), 0);
        return;
      }

      let addedCount = 0, updatedCount = 0, skippedCount = 0;
      const addedVisitsDetails: string[] = [];
      const updatedVisitsDetails: string[] = [];

      setData(prev => {
        const newSpeakers = [...prev.speakers];
        const newVisits = [...prev.visits];
        const speakerMap = new Map(newSpeakers.map(s => [s.nom.toLowerCase(), s]));

        for (const row of rows) {
          const cells = row.c;
          const dateValue = cells[dateIndex]?.v;
          let visitDateObj: Date | null = null;

          if (typeof dateValue === 'string' && dateValue.startsWith('Date(')) {
            const dateParts = dateValue.substring(5, dateValue.length - 1).split(',');
            visitDateObj = new Date(Number(dateParts[0]), Number(dateParts[1]), Number(dateParts[2]));
          } else if (typeof dateValue === 'string') {
            visitDateObj = parseDate(dateValue);
          }

          const speakerName = cells[speakerIndex]?.v?.trim();
          const congregation = cells[congIndex]?.v?.trim() || '';
          
          if (!visitDateObj || !speakerName) {
            skippedCount++;
            continue;
          }

          // Timezone-safe date formatting
          const year = visitDateObj.getFullYear();
          const month = String(visitDateObj.getMonth() + 1).padStart(2, '0');
          const day = String(visitDateObj.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
          
          const displayDate = visitDateObj.toLocaleDateString('fr-FR');

          let speaker = speakerMap.get(speakerName.toLowerCase());
          if (!speaker) {
            speaker = { id: generateUUID(), nom: speakerName, congregation: congregation || 'À définir', talkHistory: [], gender: 'male' };
            newSpeakers.push(speaker);
            speakerMap.set(speakerName.toLowerCase(), speaker);
          } else if (speaker.congregation !== congregation && congregation) {
            // Update congregation if it differs
            speaker.congregation = congregation;
          }

          const existingVisitIndex = newVisits.findIndex(v => v.visitDate === formattedDate);

          const talkNoValue = talkNoIndex > -1 ? (cells[talkNoIndex]?.v !== null ? String(cells[talkNoIndex]?.v) : null) : null;
          const themeValue = themeIndex > -1 ? (cells[themeIndex]?.v !== null ? String(cells[themeIndex]?.v) : null) : null;
          // Si pas de titre dans le sheet, utiliser le titre par défaut
          const finalTheme = themeValue || getTalkTitle(talkNoValue);

          if (existingVisitIndex > -1) {
            const existingVisit = newVisits[existingVisitIndex];
            const updates: string[] = [];
            
            if (existingVisit.id !== speaker.id) {
              existingVisit.id = speaker.id;
              existingVisit.nom = speaker.nom;
              existingVisit.telephone = speaker.telephone;
              existingVisit.photoUrl = speaker.photoUrl;
              updates.push("Orateur");
            }
            
            if (congregation && existingVisit.congregation !== congregation) {
              existingVisit.congregation = congregation;
              updates.push("Congrégation");
            }
            if (talkNoIndex > -1 && existingVisit.talkNoOrType !== talkNoValue) {
              existingVisit.talkNoOrType = talkNoValue;
              updates.push("N° Discours");
            }
            if (themeIndex > -1 && existingVisit.talkTheme !== finalTheme) {
              existingVisit.talkTheme = finalTheme;
              updates.push("Thème");
            }

            if (updates.length > 0) {
              updatedCount++;
              updatedVisitsDetails.push(`- ${speaker.nom} (${displayDate}): ${updates.join(', ')}`);
            }
          } else {
            const newVisit: Visit = {
              id: speaker.id, nom: speaker.nom, congregation, telephone: speaker.telephone, photoUrl: speaker.photoUrl,
              visitId: generateUUID(), visitDate: formattedDate, visitTime: prev.congregationProfile.meetingTime || '14:30',
              host: congregation.toLowerCase().includes('zoom') || congregation.toLowerCase().includes('streaming') ? 'N/A' : UNASSIGNED_HOST,
              accommodation: '', meals: '', status: 'pending',
              locationType: congregation.toLowerCase().includes('zoom') ? 'zoom' : congregation.toLowerCase().includes('streaming') ? 'streaming' : 'physical',
              talkNoOrType: talkNoValue,
              talkTheme: finalTheme,
              communicationStatus: {},
            };
            newVisits.push(newVisit);
            addedCount++;
            addedVisitsDetails.push(`- ${newVisit.nom} (${displayDate})`);
          }
        }
        return { ...prev, speakers: newSpeakers, visits: newVisits };
      });

      let toastMessage = `Synchronisation depuis les onglets ${successfulGids.join(', ')} terminée !\n- ${addedCount} visite(s) ajoutée(s)\n- ${updatedCount} visite(s) mise(s) à jour\n- ${skippedCount} ligne(s) ignorée(s)`;
      if (addedVisitsDetails.length > 0) {
        toastMessage += `\n\nAjouts:\n${addedVisitsDetails.join('\n')}`;
      }
      if (updatedVisitsDetails.length > 0) {
        toastMessage += `\n\nMises à jour:\n${updatedVisitsDetails.join('\n')}`;
      }
      localStorage.setItem('lastGoogleSheetSync', new Date().toISOString());
      setTimeout(() => addToast(toastMessage, 'success', 15000), 0);

    } catch (error) {
      console.error("Error syncing with Google Sheet:", error);
      setTimeout(() => addToast(`Erreur de synchronisation: ${error instanceof Error ? error.message : 'Inconnue'}.`, 'error'), 0);
    }
  };

  const refreshData = async (): Promise<void> => {
    // Mettre à jour tous les titres manquants
    setData(prev => {
      const visitsWithTitles = prev.visits.map(visit => ({
        ...visit,
        talkTheme: visit.talkTheme || getTalkTitle(visit.talkNoOrType)
      }));
      return { ...prev, visits: visitsWithTitles };
    });
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const exportData = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importData = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      // Basic validation: check for key properties
      if (!parsed.speakers || !parsed.visits || !parsed.dataVersion) {
        throw new Error("Format de données invalide ou version manquante");
      }
      
      // Update state and persistence
      setData(parsed);
      setLoaded(true);
      // Force immediate save to IDB
      idb.set('kbv-app-data', parsed).then(() => {
         addToast('Données importées avec succès !', 'success');
      });
      
    } catch (e) {
      console.error('Import error:', e);
      addToast(`Erreur lors de l'importation: ${e instanceof Error ? e.message : 'Format invalide'}`, 'error');
    }
  };

  // Merge Duplicates
  const mergeDuplicates = (type: 'speaker' | 'host' | 'visit', keepId: string, duplicateIds: string[]) => {
    setData(prev => {
      let newState = { ...prev };
      const updates: string[] = [];

      if (type === 'speaker') {
        const keepSpeaker = prev.speakers.find(s => s.id === keepId);
        if (!keepSpeaker) return prev;

        // 1. Mettre à jour toutes les visites pointant vers les doublons
        newState.visits = prev.visits.map(v => {
          if (duplicateIds.includes(v.id)) {
            updates.push(`Visite ${v.visitDate} réassignée à ${keepSpeaker.nom}`);
            return {
              ...v,
              id: keepId,
              nom: keepSpeaker.nom,
              telephone: keepSpeaker.telephone || v.telephone,
              photoUrl: keepSpeaker.photoUrl || v.photoUrl
            };
          }
          return v;
        });

        // 2. Supprimer les doublons
        newState.speakers = prev.speakers.filter(s => !duplicateIds.includes(s.id));
        addToSyncQueue('DELETE_SPEAKER', { count: duplicateIds.length, ids: duplicateIds });
      } 
      else if (type === 'host') {
        // keepId est le NOM de l'hôte à garder
        const keepHostName = keepId;
        
        // 1. Mettre à jour toutes les visites utilisant les noms en doublon
        newState.visits = prev.visits.map(v => {
          if (duplicateIds.includes(v.host)) {
            updates.push(`Visite ${v.visitDate} hôte mis à jour: ${v.host} -> ${keepHostName}`);
            return { ...v, host: keepHostName };
          }
          return v;
        });

        // 2. Supprimer les doublons
        newState.hosts = prev.hosts.filter(h => !duplicateIds.includes(h.nom));
        addToSyncQueue('DELETE_HOST', { count: duplicateIds.length, names: duplicateIds });
      }
      else if (type === 'visit') {
        // keepId est le visitId à garder
        // 1. Supprimer les autres visites
        newState.visits = prev.visits.filter(v => 
          v.visitId === keepId || !duplicateIds.includes(v.visitId)
        );
        addToSyncQueue('DELETE_VISIT', { count: duplicateIds.length, visitIds: duplicateIds });
      }

      if (updates.length > 0) {
        addToast(`${updates.length} relation(s) mise(s) à jour lors de la fusion`, 'info');
      }
      return newState;
    });
  };

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <DataContext.Provider
      value={{
        ...data,
        addSpeaker,
        updateSpeaker,
        deleteSpeaker,
        addVisit,
        updateVisit,
        deleteVisit,
        completeVisit,
        addHost,
        updateHost,
        deleteHost,
        logCommunication,
        saveCustomTemplate,
        updateCongregationProfile,
        exportData,
        importData,
        resetData,
        syncWithGoogleSheet,
        refreshData,
        syncQueue,
        isOnline,
        clearSyncQueue,
        mergeDuplicates,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
