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
import { processSheetRows, mergeVisitsIdempotent, backfillExternalIds } from '@/utils/googleSheetSync';
import { useToast } from './ToastContext';
import { useSyncQueue } from '../hooks/useSyncQueue';
import { useOfflineMode } from '../hooks/useOfflineMode';
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

  const loadData = async () => {
    try {
      // Migration automatique si nécessaire
      await storage.migrateToCapacitor();

      const saved = await storage.get<AppData>('kbv-app-data');
      const lastRestoreTimestamp = localStorage.getItem('last-data-restore');

      // Vérifier si une restauration a été faite récemment (dans les 5 dernières minutes)
      const isRecentRestore = lastRestoreTimestamp &&
        (Date.now() - parseInt(lastRestoreTimestamp)) < (5 * 60 * 1000); // 5 minutes

      if (isRecentRestore) {
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

  // Load - Charger depuis le stockage ou depuis le fichier JSON initial
  useEffect(() => {
    loadData();
  }, []);

  // Migration: Ajouter externalId aux visites existantes
  useEffect(() => {
    if (loaded && data.visits.length > 0) {
      const migratedVisits = backfillExternalIds(data.visits);
      const needsMigration = migratedVisits.some((v, i) => 
        v.externalId && !data.visits[i]?.externalId
      );
      
      if (needsMigration) {
        setData((prev) => ({ ...prev, visits: migratedVisits }));

              // Dedupe: Remove duplicate visits based on externalId
              const uniqueVisits = migratedVisits.reduce((acc, visit) => {
                        if (!visit.externalId) {
                                    acc.push(visit);
                                    return acc;
                                  }
                        const duplicate = acc.find(v => v.externalId === visit.externalId);
                        if (!duplicate) {
                                    acc.push(visit);
                                  }
                        return acc;
                      }, [] as Visit[]);

              if (uniqueVisits.length < migratedVisits.length) {
                        setData((prev) => ({ ...prev, visits: uniqueVisits }));
                      }
      }
    }
  }, [loaded]);

  // Gestion de la Sauvegarde Automatique (Hebdomadaire)
  useEffect(() => {
    const checkAutoBackup = async () => {
      // On ne sauvegarde que si on a des données chargées
      if (data.visits.length === 0) return;

      try {
        const lastBackupStr = (await storage.get('lastAutoBackup')) as string;
        const now = Date.now();
        const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
        
        // Si pas de backup ou plus vieux qu'une semaine
        if (!lastBackupStr || (now - new Date(lastBackupStr).getTime() > ONE_WEEK_MS)) {
          // Création du backup
          const backupKey = `auto_backup_${new Date().toISOString().split('T')[0]}`;
          await storage.set(backupKey, data);
          await storage.set('lastAutoBackup', new Date().toISOString());
          
          addToast('Sauvegarde automatique hebdomadaire effectuée.', 'success');
        }
      } catch (error) {
        console.error('Echec sauvegarde auto:', error);
      }
    };

    // On attend un peu que tout soit stable (ex: 5s après montage/chargement)
    const timer = setTimeout(checkAutoBackup, 5000);
    return () => clearTimeout(timer);
  }, [data.visits.length]); // Déclenché quand le nombre de visites change (chargement initial)


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
    setData((d) => {
      const updatedVisits = d.visits.map((v) => {
        if (v.visitId === visit.visitId) {
          return visit;
        }
        return v;
      });
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
    // 1. Sauvegarde automatique de sécurité avant la synchro
    if (data.visits.length > 0) {
        // Idéalement on garde une version datée, mais pour l'instant on force une persistence
        await storage.set('kbv-app-data-backup-pre-sync', data);
    }

    const googleSheetId = '1drIzPPi6AohCroSyUkF1UmMFxuEtMACBF4XATDjBOcg';
    const range = 'A:E';
    const sheetGidsToTry = ['490509024', '1817293373', '936069614', '1474640023'];

    const allRows: any[] = [];
    let cols: any = null;
    const successfulGids: string[] = [];

    // 2. Récupération des données brutes (Extract)
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
      }
    }

    if (allRows.length === 0) {
      setTimeout(() => addToast('Impossible de récupérer des données depuis les onglets spécifiés.', 'error'), 0);
      return;
    }

    try {
        // 3. Transformation & Filtrage (Transform)
        // On délègue toute la complexité métier à l'utilitaire dédié
        // NOTE: On passe data.speakers (état actuel) pour la résolution stable des IDs
        // Attention: data peut être "stale" dans la closure, mais ici on est dans une fonction async déclenchée par UI.
        // Pour être sûr, on pourrait utiliser le state setter pattern, mais processSheetRows est pure.
        
        // Comme on est dans DataContext, on a accès à "data" qui est le state du rendu courant.
        // S'il y a eu des updates concurrents c'est rare, mais acceptable pour la lecture.
        
        const cleanVisits = processSheetRows(allRows, cols, data.speakers, data.congregationProfile);
        
        if (cleanVisits.length === 0) {
            setTimeout(() => addToast('Aucune visite valide trouvée après filtrage.', 'warning'), 0);
            return;
        }

        // 4. Chargement & Fusion (Load)
        let stats = { added: 0, updated: 0, deleted: 0 };
        
        setData((prev) => {
            // Utilitaire de fusion idempotent
            const result = mergeVisitsIdempotent(prev.visits, cleanVisits);
            stats = result.stats;

            // Mise à jour des speakers si des nouveaux ont été créés par processSheetRows
            // processSheetRows renvoie des visites avec des IDs. Si l'ID n'existait pas dans prev.speakers, il faut créer le speaker.
            // Cependant, processSheetRows ne retourne QUE des visits.
            // IL MANQUE L'ETAPE DE CREATION DES SPEAKERS MANQUANTS DANS MON UTILITAIRE !
            // Je dois corriger cela : processSheetRows devrait retourner { visits, newSpeakers } ou je dois déduire.
            
            // DEDUCTION DES SPEAKERS MANQUANTS :
            const currentSpeakerIds = new Set(prev.speakers.map(s => s.id));
            const newSpeakersToAdd: Speaker[] = [];
            
            cleanVisits.forEach(v => {
                if (!currentSpeakerIds.has(v.id)) {
                    // C'est un nouveau speaker détecté par le parsing (qui a généré un ID)
                    currentSpeakerIds.add(v.id);
                    newSpeakersToAdd.push({
                        id: v.id,
                        nom: v.nom,
                        congregation: v.congregation,
                        telephone: v.telephone,
                        gender: 'male', // Défaut
                        talkHistory: [],
                        email: '',
                        notes: '',
                        tags: [],
                    });
                }
            });

            return {
                ...prev,
                speakers: [...prev.speakers, ...newSpeakersToAdd],
                visits: result.mergedVisits,
            };
        });

        // Feedback utilisateur
        localStorage.setItem('lastGoogleSheetSync', new Date().toISOString());
        
        let msg = `Synchronisation terminée !\n+ ${stats.added} ajout(s)\n~ ${stats.updated} mise(s) à jour`;
        if (stats.deleted > 0) msg += `\n- ${stats.deleted} doublons supprimés`;
        
        setTimeout(() => addToast(msg, 'success', 8000), 0);

    } catch (error) {
      console.error('Error syncing with Google Sheet:', error);
      setTimeout(() => addToast(`Erreur de synchronisation: ${error instanceof Error ? error.message : 'Inconnue'}.`, 'error'), 0);
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
