import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import {
  AppData,
  Speaker,
  Visit,
  Host,
  MessageType,
  MessageRole,
  Language,
  SyncAction,
} from '@/types';
import * as storage from '@/utils/storage';
import { completeData } from '@/data/completeData';
import { UNASSIGNED_HOST, NA_HOST } from '@/data/commonConstants';
import { generateUUID } from '@/utils/uuid';
import { parseDate } from '@/utils/formatters';
import { useToast } from '@/contexts/ToastContext';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { getTalkTitle } from '@/data/talkTitles';

// Types condensés pour le context
interface DataContextValue extends AppData {
  addSpeaker: (speaker: Speaker) => void;
  updateSpeaker: (speaker: Speaker) => void;
  deleteSpeaker: (id: string) => void;

  addVisit: (visit: Visit) => void;
  updateVisit: (visit: Visit) => void;
  deleteVisit: (visitId: string) => void;
  completeVisit: (visit: Visit) => void;
  cancelVisit: (visit: Visit, cancellationData?: any) => void;

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
  mergeDuplicates: (
    type: 'speaker' | 'host' | 'visit' | 'message' | 'archivedVisit',
    keepId: string,
    duplicateIds: string[]
  ) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(completeData);
  const [loaded, setLoaded] = useState(false);
  const { addToast } = useToast();

  const {
    queue: syncQueue,
    addAction: addToSyncQueue,
    clearQueue: clearSyncQueue,
  } = useSyncQueue();
  // On utilise useOfflineMode simplement pour le statut online ici,
  // car le chargement de données est déjà géré par useEffect + idb ci-dessous
  const { isOnline } = useOfflineMode('app_state', async () => completeData);

  // Load - Charger depuis le stockage ou depuis le fichier JSON initial
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Migration automatique si nécessaire
        await storage.migrateToCapacitor();

        const saved = await storage.get<AppData>('kbv-app-data');
        const lastRestoreTimestamp = localStorage.getItem('last-data-restore');

        // Vérifier si une restauration a été faite récemment (dans les 5 dernières minutes)
        const isRecentRestore = lastRestoreTimestamp &&
          (Date.now() - parseInt(lastRestoreTimestamp)) < (5 * 60 * 1000); // 5 minutes

        if (isRecentRestore) {
          console.log('🔄 RECENT RESTORE DETECTED: Using saved data without fusion');
          // Utiliser directement les données sauvegardées sans fusion
          const dataToUse = saved || completeData;
          setData({
            ...dataToUse,
            dataVersion: '1.3.0', // S'assurer d'avoir la bonne version
          });
          // Nettoyer le flag de restauration
          localStorage.removeItem('last-data-restore');
          setTimeout(() => addToast('Restauration appliquée avec succès !', 'success'), 0);
          setLoaded(true);
          return;
        }

        // SOLUTION: Toujours utiliser completeData comme base, puis fusionner avec les sauvegardes
        // Cela garantit que la tablette aura TOUTES les données complètes
        const visitsWithTitles = (saved?.visits || []).map((visit) => ({
          ...visit,
          talkTheme: visit.talkTheme || getTalkTitle(visit.talkNoOrType),
        }));

        // FORCE RELOAD: Si les données sauvegardées n'ont pas la nouvelle version ou sont vides,
        // utiliser uniquement completeData pour forcer le rechargement complet
        const shouldForceReload =
          !saved?.dataVersion ||
          saved.dataVersion < '1.3.0' ||
          !saved.speakers ||
          saved.speakers.length < 50;

        let mergedData;
        if (shouldForceReload) {
          console.log('🔄 FORCE RELOAD: Utilisation exclusive de completeData (version 1.3.0)');
          mergedData = {
            ...completeData,
            dataVersion: '1.3.0', // Forcer la nouvelle version
          };
        } else {
          // FUSION INTELLIGENTE: Préserver les hostAssignments et autres données utilisateur
          const mergedVisits = visitsWithTitles.length > 0 ? visitsWithTitles : completeData.visits;

          // Si nous avons des visites sauvegardées avec hostAssignments, les préserver
          const visitsWithHostAssignments = mergedVisits.map((visit) => {
            // Chercher la visite correspondante dans les données sauvegardées
            const savedVisit = saved?.visits?.find((sv) => sv.visitId === visit.visitId);
            if (savedVisit?.hostAssignments && savedVisit.hostAssignments.length > 0) {
              console.log(`🔄 Préservation hostAssignments pour ${visit.nom}:`, savedVisit.hostAssignments);
              return {
                ...visit,
                hostAssignments: savedVisit.hostAssignments,
                // Garder aussi l'ancien champ host pour compatibilité
                host: savedVisit.host || visit.host,
              };
            }
            return visit;
          });

          mergedData = {
            ...completeData, // BASE = Données complètes intégrées
            ...saved, // SAUVEGARDES = Modifications utilisateur (visites terminées, etc.)
            visits: visitsWithHostAssignments,
            // Préserver les hôtes personnalisés mais ajouter ceux manquants
            hosts: [...completeData.hosts, ...(saved?.hosts || [])].filter(
              (host, index, arr) => arr.findIndex((h) => h.nom === host.nom) === index
            ),
            dataVersion: '1.3.0', // Mettre à jour la version
          };
        }

        setData(mergedData);
        // Sauvegarder immédiatement les données complètes
        await storage.set('kbv-app-data', mergedData);
        setTimeout(() => addToast('Données complètes chargées avec succès !', 'success'), 0);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setData(completeData);
      } finally {
        setLoaded(true);
      }
    };

    loadInitialData();
  }, []);

  // Save
  useEffect(() => {
    if (loaded) storage.set('kbv-app-data', data);
  }, [data, loaded]);

  // Speakers
  const addSpeaker = (speaker: Speaker) => {
    setData((d) => ({ ...d, speakers: [...d.speakers, speaker] }));
    addToSyncQueue('ADD_SPEAKER', speaker);
  };

  const updateSpeaker = (speaker: Speaker) => {
    setData((d) => {
      const updatedSpeakers = d.speakers.map((s) => (s.id === speaker.id ? speaker : s));

      // Synchroniser les visites futures avec les nouvelles données de l'orateur
      const today = new Date();
      const updatedVisits = d.visits.map((visit) => {
        if (visit.id !== speaker.id) return visit;

        const visitDate = new Date(visit.visitDate);
        // Synchroniser uniquement les visites futures
        if (visitDate >= today) {
          return {
            ...visit,
            nom: speaker.nom,
            congregation: speaker.congregation,
            telephone: speaker.telephone,
            photoUrl: speaker.photoUrl,
          };
        }

        return visit;
      });

      return {
        ...d,
        speakers: updatedSpeakers,
        visits: updatedVisits,
      };
    });
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
    console.log('🔄 UPDATE VISIT CALLED:', visit.visitId, 'New speaker:', visit.nom, 'ID:', visit.id);
    setData((d) => {
      const updatedVisits = d.visits.map((v) => {
        if (v.visitId === visit.visitId) {
          console.log('🔄 UPDATING VISIT:', v.nom, '->', visit.nom);
          return visit;
        }
        return v;
      });
      console.log('🔄 VISITS UPDATED, new count:', updatedVisits.length);
      return {
        ...d,
        visits: updatedVisits,
      };
    });
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

  const cancelVisit = (visit: Visit, cancellationData?: any) => {
    setData((d) => ({
      ...d,
      visits: d.visits.map((v) =>
        v.visitId === visit.visitId
          ? {
              ...v,
              status: 'cancelled' as const,
              cancellationData,
              cancelledAt: new Date().toISOString(),
            }
          : v
      ),
    }));
    addToSyncQueue('CANCEL_VISIT', { visitId: visit.visitId, cancellationData });
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
  const saveCustomTemplate = (
    lang: Language,
    type: MessageType,
    role: MessageRole,
    text: string
  ) => {
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
    setData(completeData);
    storage.clear();
  };

  // Google Sheets Sync
  const syncWithGoogleSheet = async (): Promise<void> => {
    const googleSheetId = '1drIzPPi6AohCroSyUkF1UmMFxuEtMACBF4XATDjBOcg';
    const range = 'A:E';
    const sheetGidsToTry = ['490509024', '1817293373', '936069614', '1474640023'];

    const allRows: any[] = [];
    let cols: any = null;
    const successfulGids: string[] = [];

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
          console.warn(
            `Error in sheet with gid "${gid}": ${parsedData.errors.map((e: any) => e.detailed_message).join(', ')}. Trying next one.`
          );
          continue;
        }

        if (parsedData.table && parsedData.table.rows) {
          allRows.push(...parsedData.table.rows);
          if (!cols) cols = parsedData.table.cols;
          successfulGids.push(gid);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setData(completeData);
      }

      if (allRows.length === 0) {
        setTimeout(
          () =>
            addToast('Impossible de récupérer des données depuis les onglets spécifiés.', 'error'),
          0
        );
        return;
      }

      try {
        const rows = allRows;

        if (!rows || rows.length === 0) {
          setTimeout(
            () => addToast('Aucune donnée trouvée dans les feuilles synchronisées.', 'warning'),
            0
          );
          return;
        }

        const headers = cols.map((h: any) =>
          h.label
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '')
        );
        const dateIndex = headers.findIndex((h: string) => h.includes('data'));
        const speakerIndex = headers.findIndex((h: string) => h.includes('orador'));
        const congIndex = headers.findIndex((h: string) => h.includes('kongregason'));
        const talkNoIndex = headers.findIndex((h: string) => h === 'n' || h === 'no');
        const themeIndex = headers.findIndex((h: string) => h.includes('tema'));

        if ([dateIndex, speakerIndex, congIndex].some((i) => i === -1)) {
          setTimeout(
            () => addToast('En-têtes requis manquants: Data, Orador, Kongregason.', 'error'),
            0
          );
          return;
        }

        let addedCount = 0,
          updatedCount = 0,
          skippedCount = 0;
        const addedVisitsDetails: string[] = [];
        const updatedVisitsDetails: string[] = [];

        setData((prev) => {
          const newSpeakers = [...prev.speakers];
          const newVisits = [...prev.visits];
          const speakerMap = new Map(newSpeakers.map((s) => [s.nom.toLowerCase(), s]));

          for (const row of rows) {
            const cells = row.c;
            const dateValue = cells[dateIndex]?.v;
            let visitDateObj: Date | null = null;

            if (typeof dateValue === 'string' && dateValue.startsWith('Date(')) {
              const dateParts = dateValue.substring(5, dateValue.length - 1).split(',');
              visitDateObj = new Date(
                Number(dateParts[0]),
                Number(dateParts[1]),
                Number(dateParts[2])
              );
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
              speaker = {
                id: generateUUID(),
                nom: speakerName,
                congregation: congregation || 'À définir',
                talkHistory: [],
                gender: 'male',
              };
              newSpeakers.push(speaker);
              speakerMap.set(speakerName.toLowerCase(), speaker);
            } else if (speaker.congregation !== congregation && congregation) {
              // Update congregation if it differs
              speaker.congregation = congregation;
            }

            const existingVisitIndex = newVisits.findIndex((v) => v.visitDate === formattedDate);

            const talkNoValue =
              talkNoIndex > -1
                ? cells[talkNoIndex]?.v !== null
                  ? String(cells[talkNoIndex]?.v)
                  : null
                : null;
            const themeValue =
              themeIndex > -1
                ? cells[themeIndex]?.v !== null
                  ? String(cells[themeIndex]?.v)
                  : null
                : null;
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
                updates.push('Orateur');
              }

              if (congregation && existingVisit.congregation !== congregation) {
                existingVisit.congregation = congregation;
                updates.push('Congrégation');
              }
              if (talkNoIndex > -1 && existingVisit.talkNoOrType !== talkNoValue) {
                existingVisit.talkNoOrType = talkNoValue;
                updates.push('N° Discours');
              }
              if (themeIndex > -1 && existingVisit.talkTheme !== finalTheme) {
                existingVisit.talkTheme = finalTheme;
                updates.push('Thème');
              }

              if (updates.length > 0) {
                updatedCount++;
                updatedVisitsDetails.push(
                  `- ${speaker.nom} (${displayDate}): ${updates.join(', ')}`
                );
              }
            } else {
              const newVisit: Visit = {
                id: speaker.id,
                nom: speaker.nom,
                congregation,
                telephone: speaker.telephone,
                photoUrl: speaker.photoUrl,
                visitId: generateUUID(),
                visitDate: formattedDate,
                visitTime: prev.congregationProfile.meetingTime || '14:30',
                host:
                  congregation.toLowerCase().includes('zoom') ||
                  congregation.toLowerCase().includes('streaming') ||
                  congregation.toLowerCase().includes('lyon')
                    ? NA_HOST
                    : UNASSIGNED_HOST,
                accommodation: '',
                meals: '',
                status: 'pending',
                locationType: congregation.toLowerCase().includes('zoom')
                  ? 'zoom'
                  : congregation.toLowerCase().includes('streaming')
                    ? 'streaming'
                    : 'physical',
                talkNoOrType: talkNoValue,
                talkTheme: finalTheme,
                communicationStatus: {},
              };
              newVisits.push(newVisit);
              addedCount++;
              addedVisitsDetails.push(`- ${newVisit.nom} (${displayDate})`);
            }
          }
          // IMPORTANT: Préserver les hôtes lors de la sync
          return { ...prev, speakers: newSpeakers, visits: newVisits, hosts: prev.hosts };
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
        console.error('Error syncing with Google Sheet:', error);
        setTimeout(
          () =>
            addToast(
              `Erreur de synchronisation: ${error instanceof Error ? error.message : 'Inconnue'}.`,
              'error'
            ),
          0
        );
      }
    }
  };

  const refreshData = async (): Promise<void> => {
    // Mettre à jour tous les titres manquants
    setData((prev) => {
      const visitsWithTitles = prev.visits.map((visit) => ({
        ...visit,
        talkTheme: visit.talkTheme || getTalkTitle(visit.talkNoOrType),
      }));
      return { ...prev, visits: visitsWithTitles };
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const exportData = (): string => {
    const dataToExport = {
      ...data,
      dataVersion: data.dataVersion || '1.0.0',
    };
    return JSON.stringify(dataToExport, null, 2);
  };

  const importData = (json: string) => {
    try {
      const parsed = JSON.parse(json);

      // Validation plus souple
      if (!parsed.speakers || !parsed.visits) {
        throw new Error('Format de données invalide : orateurs ou visites manquants');
      }

      // Si version manquante, on assume 1.0.0
      if (!parsed.dataVersion) {
        console.warn(
          "Version de données manquante lors de l'import, ajout de la version par défaut 1.0.0"
        );
        parsed.dataVersion = '1.0.0';
      }

      // Update state and persistence
      setData(parsed);
      setLoaded(true);
      // Force immediate save to storage
      storage.set('kbv-app-data', parsed).then(() => {
        setTimeout(() => addToast('Données importées avec succès !', 'success'), 0);
      });
    } catch (e) {
      console.error('Import error:', e);
      setTimeout(
        () =>
          addToast(
            `Erreur lors de l'importation: ${e instanceof Error ? e.message : 'Format invalide'}`,
            'error'
          ),
        0
      );
    }
  };

  // Merge Duplicates
  const mergeDuplicates = (
    type: 'speaker' | 'host' | 'visit' | 'message' | 'archivedVisit',
    keepId: string,
    duplicateIds: string[]
  ) => {
    setData((prev) => {
      const newState = { ...prev };
      const updates: string[] = [];

      if (type === 'speaker') {
        const keepSpeaker = prev.speakers.find((s) => s.id === keepId);
        if (!keepSpeaker) return prev;

        // 1. Mettre à jour toutes les visites pointant vers les doublons
        newState.visits = prev.visits.map((v) => {
          if (duplicateIds.includes(v.id)) {
            updates.push(`Visite ${v.visitDate} réassignée à ${keepSpeaker.nom}`);
            return {
              ...v,
              id: keepId,
              nom: keepSpeaker.nom,
              telephone: keepSpeaker.telephone || v.telephone,
              photoUrl: keepSpeaker.photoUrl || v.photoUrl,
            };
          }
          return v;
        });

        // 2. Supprimer les doublons
        newState.speakers = prev.speakers.filter((s) => !duplicateIds.includes(s.id));
        addToSyncQueue('DELETE_SPEAKER', { count: duplicateIds.length, ids: duplicateIds });
      } else if (type === 'host') {
        // keepId est le NOM de l'hôte à garder
        const keepHostName = keepId;

        // 1. Mettre à jour toutes les visites utilisant les noms en doublon
        newState.visits = prev.visits.map((v) => {
          let updated = false;

          // Mettre à jour l'ancien champ host
          if (duplicateIds.includes(v.host)) {
            updated = true;
            v = { ...v, host: keepHostName };
          }

          // Mettre à jour les hostAssignments
          if (v.hostAssignments && v.hostAssignments.length > 0) {
            const updatedAssignments = v.hostAssignments.map((assignment) => {
              if (duplicateIds.includes(assignment.hostName)) {
                updated = true;
                return { ...assignment, hostName: keepHostName, hostId: keepHostName };
              }
              return assignment;
            });
            v = { ...v, hostAssignments: updatedAssignments };
          }

          if (updated) {
            updates.push(`Visite ${v.visitDate} hôte mis à jour -> ${keepHostName}`);
          }

          return v;
        });

        // 2. Supprimer les doublons
        newState.hosts = prev.hosts.filter((h) => !duplicateIds.includes(h.nom));
        addToSyncQueue('DELETE_HOST', { count: duplicateIds.length, names: duplicateIds });
      } else if (type === 'visit') {
        // keepId est le visitId à garder
        // 1. Supprimer les autres visites
        newState.visits = prev.visits.filter(
          (v) => v.visitId === keepId || !duplicateIds.includes(v.visitId)
        );
        addToSyncQueue('DELETE_VISIT', { count: duplicateIds.length, visitIds: duplicateIds });
      } else if (type === 'archivedVisit') {
        // keepId est le visitId à garder
        // 1. Supprimer les doublons des visites actuelles ET archivées
        newState.visits = prev.visits.filter(
          (v) => v.visitId === keepId || !duplicateIds.includes(v.visitId)
        );
        newState.archivedVisits = prev.archivedVisits.filter(
          (v) => v.visitId === keepId || !duplicateIds.includes(v.visitId)
        );
        updates.push(`${duplicateIds.length} visite(s) archivée(s) supprimée(s)`);
      } else if (type === 'message') {
        // keepId est le message id à garder
        // 1. Supprimer les autres messages
        newState.speakerMessages = (prev.speakerMessages || []).filter(
          (m) => m.id === keepId || !duplicateIds.includes(m.id)
        );
        // addToSyncQueue('DELETE_MESSAGE', { count: duplicateIds.length, messageIds: duplicateIds }); // TODO: Implement DELETE_MESSAGE sync if needed
      }

      if (updates.length > 0) {
        setTimeout(
          () => addToast(`${updates.length} relation(s) mise(s) à jour lors de la fusion`, 'info'),
          0
        );
      }
      return newState;
    });
  };

  if (!loaded) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600' />
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
        cancelVisit,
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
