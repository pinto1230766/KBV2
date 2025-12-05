import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Speaker, Visit, Host, MessageType, MessageRole, Language } from '@/types';
import * as idb from '@/utils/idb';
import { defaultAppData } from '@/data/constants';
import { useToast } from '@/contexts/ToastContext';

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
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultAppData);
  const [loaded, setLoaded] = useState(false);
  const { addToast } = useToast();

  // Load
  useEffect(() => {
    idb.get<AppData>('kbv-app-data').then((saved) => {
      if (saved) setData({ ...defaultAppData, ...saved });
      setLoaded(true);
    });
  }, []);

  // Save
  useEffect(() => {
    if (loaded) idb.set('kbv-app-data', data);
  }, [data, loaded]);

  // Speakers
  const addSpeaker = (speaker: Speaker) => {
    setData((d) => ({ ...d, speakers: [...d.speakers, speaker] }));
  };

  const updateSpeaker = (speaker: Speaker) => {
    setData((d) => ({
      ...d,
      speakers: d.speakers.map((s) => (s.id === speaker.id ? speaker : s)),
    }));
  };

  const deleteSpeaker = (id: string) => {
    setData((d) => ({ ...d, speakers: d.speakers.filter((s) => s.id !== id) }));
  };

  // Visits
  const addVisit = (visit: Visit) => {
    setData((d) => ({ ...d, visits: [...d.visits, visit] }));
  };

  const updateVisit = (visit: Visit) => {
    setData((d) => ({
      ...d,
      visits: d.visits.map((v) => (v.visitId === visit.visitId ? visit : v)),
    }));
  };

  const deleteVisit = (visitId: string) => {
    setData((d) => ({ ...d, visits: d.visits.filter((v) => v.visitId !== visitId) }));
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

  // Export/Import
  const exportData = () => JSON.stringify(data, null, 2);

  const importData = (json: string) => {
    try {
      const imported = JSON.parse(json);
      setData({ ...defaultAppData, ...imported });
    } catch (e) {
      console.error('Import error:', e);
    }
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
            if (themeIndex > -1 && existingVisit.talkTheme !== themeValue) {
              existingVisit.talkTheme = themeValue;
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
              talkTheme: themeValue,
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
