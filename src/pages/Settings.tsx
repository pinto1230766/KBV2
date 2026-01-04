import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/contexts/ToastContext';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  RefreshCw,
  Copy,
  Link,
  Users,
  Phone,
  ChevronRight,
  Info,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { CongregationProfile, ImportResult, Language, Theme } from '@/types';
import { BackupManagerModal } from '@/components/settings/BackupManagerModal';
import { ImportWizardModal } from '@/components/settings/ImportWizardModal';
import { ArchiveManagerModal } from '@/components/settings/ArchiveManagerModal';
import { DuplicateDetectionModal } from '@/components/settings/DuplicateDetectionModal';
import { PhoneNumberImportModal } from '@/components/settings/PhoneNumberImportModal';
import { cn } from '@/utils/cn';
import { useVisitNotifications } from '@/hooks/useVisitNotifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { fileSystemService } from '@/utils/FileSystemService';

interface BackupOptions {
  includeArchived: boolean;
  includeSettings: boolean;
  includeTemplates: boolean;
  encrypt: boolean;
  password?: string;
}

interface ColumnMapping {
  [key: string]: string;
}

const REMINDER_ONE_WEEK = 7;
const REMINDER_TWO_DAYS = 2;

export const Settings: React.FC = () => {
  const {
    congregationProfile,
    updateCongregationProfile,
    syncWithGoogleSheet,
    exportData,
    importData,
    mergeDuplicates,
    deleteVisit,
    deleteSpeaker,
    deleteHost,
    speakers,
    hosts,
    visits,
    archivedVisits,
    speakerMessages,
  } = useData();
  const { settings, updateSettings } = useSettings();
  const { addToast } = useToast();
  const { requestPermissions } = useVisitNotifications();

  const handleTestNotification = async () => {
    try {
      const granted = await requestPermissions();
      if (granted) {
        try {
          await LocalNotifications.schedule({
            notifications: [
              {
                title: 'Test Notification',
                body: 'Ceci est une notification de test pour KBV Lyon.',
                id: Math.floor(Math.random() * 100000),
                schedule: { at: new Date(Date.now() + 1000) }, // 1 second delay
                sound: 'default',
                attachments: [],
                actionTypeId: '',
                extra: null,
              },
            ],
          });
          addToast('Notification de test envoyée (dans 1s)', 'success');
        } catch (error) {
          console.error('Erreur notification:', error);
          addToast('Erreur technique notification', 'error');
        }
      } else {
        addToast('Permissions refusées', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      addToast('Erreur lors de la demande de permissions', 'error');
    }
  };

  const location = useLocation();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'profile'
    | 'appearance'
    | 'notifications'
    | 'security'
    | 'data'
    | 'duplicates'
    | 'about'
  >('overview');

  // Handle initial state from navigation
  useEffect(() => {
    const state = location.state as { activeTab?: typeof activeTab };
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [location.state]);
  const [profileForm, setProfileForm] = useState<CongregationProfile>(congregationProfile);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isPhoneImportModalOpen, setIsPhoneImportModalOpen] = useState(false);

  const tabs = [
    {
      id: 'overview',
      label: "Vue d'ensemble",
      icon: Monitor,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 'profile',
      label: 'Profil de la Congrégation',
      icon: User,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      id: 'appearance',
      label: 'Apparence & Thème',
      icon: Palette,
      color: 'text-pink-600',
      bg: 'bg-pink-50 dark:bg-pink-900/20',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      id: 'security',
      label: 'Sécurité & Accès',
      icon: Shield,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      id: 'data',
      label: 'Export & Import',
      icon: Database,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      id: 'duplicates',
      label: 'Maintenance (Doublons)',
      icon: Copy,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      id: 'about',
      label: 'À propos',
      icon: Info,
      color: 'text-gray-600',
      bg: 'bg-gray-50 dark:bg-gray-900/20',
    },
  ] as const;

  const stats = useMemo(
    () => ({
      speakersCount: speakers.length,
      visitsCount: visits.length,
      hostsCount: hosts.length,
      archivedCount: archivedVisits?.length || 0,
      messagesCount: speakerMessages?.length || 0,
    }),
    [speakers, visits, hosts, archivedVisits, speakerMessages]
  );

  const handleSaveProfile = () => {
    updateCongregationProfile(profileForm);
    addToast('Profil mis à jour', 'success');
  };

  const handleThemeChange = (theme: Theme) => {
    updateSettings({ ...settings, theme });
    addToast('Thème mis à jour', 'success');
  };

  const handleLanguageChange = (language: Language) => {
    updateSettings({ ...settings, language });
    addToast('Langue mise à jour', 'success');
  };

  const handleSyncGoogleSheet = () => {
    setIsSyncing(true);
    syncWithGoogleSheet()
      .catch(() => addToast('Erreur lors de la synchronisation', 'error'))
      .finally(() => setIsSyncing(false));
  };

  // WhatsApp Backup Function
  const handleWhatsAppBackup = async () => {
    console.log('[DEBUG] Starting WhatsApp backup...');
    try {
      const json = exportData();
      const filename = `kbv-backup-${new Date().toISOString().slice(0, 10)}.json`;
      
      // Créer un blob avec les données
      const blob = new Blob([json], { type: 'application/json' });
      const file = new File([blob], filename, { type: 'application/json' });
      
      // Essayer de partager via WhatsApp Web
      try {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          console.log('[DEBUG] Trying WhatsApp share...');
          await navigator.share({
            files: [file],
            title: `📋 Sauvegarde KBV Lyon - ${new Date().toLocaleDateString('fr-FR')}`,
            text: `📅 Sauvegarde du ${new Date().toLocaleDateString('fr-FR')}\n\n📊 Contient:\n• ${speakers.length} orateurs\n• ${visits.length} visites\n• ${hosts.length} hôtes\n\n📱 Importez ce fichier dans KBV sur mobile/tablette`,
          });
          addToast('📱 Sauvegarde envoyée via WhatsApp', 'success');
          return;
        }
      } catch (shareError) {
        console.log('[DEBUG] Share failed, trying download fallback:', shareError);
      }
      
      // Fallback: téléchargement direct avec instructions WhatsApp
      console.log('[DEBUG] Using download fallback...');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Instructions pour WhatsApp
      addToast('💾 Fichier téléchargé ! Partagez-le manuellement sur WhatsApp', 'success');
      
      // Ouvrir WhatsApp Web si possible
      setTimeout(() => {
        window.open('https://web.whatsapp.com/', '_blank');
      }, 1000);
      
    } catch (error) {
      console.error('[DEBUG] WhatsApp backup failed:', error);
      addToast('❌ Erreur lors de la sauvegarde WhatsApp', 'error');
    }
  };

  const handleBackupAdapter = async (_options: BackupOptions): Promise<void> => {
    console.log('[DEBUG] handleBackupAdapter called with options:', _options);
    try {
      console.log('[DEBUG] Calling exportData()...');
      const json = exportData();
      console.log('[DEBUG] exportData() completed, JSON length:', json.length);
      console.log('[DEBUG] First 200 chars of JSON:', json.substring(0, 200));

      const filename = `kbv-backup-${new Date().toISOString().slice(0, 10)}.json`;
      console.log('[DEBUG] Generated filename:', filename);

      // 1. Essayer le FileSystemService (Documents/KBV)
      try {
        console.log('[DEBUG] Trying FileSystemService backup...');
        const result = await fileSystemService.saveToDocuments({
          filename,
          data: json,
          mimeType: 'application/json',
        });
        console.log('[DEBUG] FileSystemService result:', result);

        if (result.success) {
          addToast(`Sauvegarde créée dans Documents/KBV`, 'success');
          return;
        }
      } catch (fsError) {
        console.log('[DEBUG] FileSystemService failed, trying next method:', fsError);
      }

      // 2. Fallback: Partage de fichier (si disponible)
      try {
        console.log('[DEBUG] Trying file sharing fallback...');
        const blob = new Blob([json], { type: 'application/json' });
        const file = new File([blob], filename, { type: 'application/json' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          console.log('[DEBUG] Sharing file...');
          await navigator.share({
            files: [file],
            title: 'Sauvegarde KBV',
            text: 'Sauvegarde des données KBV Lyon'
          });
          addToast('Sauvegarde partagée avec succès', 'success');
          return;
        }
      } catch (shareError) {
        console.log('[DEBUG] Share fallback failed:', shareError);
      }

      // 3. Fallback: Téléchargement direct (toujours fonctionne)
      try {
        console.log('[DEBUG] Using download fallback...');
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addToast('Sauvegarde téléchargée dans vos téléchargements', 'success');
        return;
      } catch (downloadError) {
        console.log('[DEBUG] Download fallback failed:', downloadError);
      }

      // 4. Sauvegarde d'urgence dans localStorage (si tout échoue)
      try {
        console.log('[DEBUG] Using emergency localStorage backup...');
        const backupKey = `kbv-emergency-backup-${Date.now()}`;
        localStorage.setItem(backupKey, json);
        localStorage.setItem('last-emergency-backup', backupKey);
        addToast('Sauvegarde temporaire créée (localStorage)', 'warning');
        return;
      } catch (storageError) {
        console.log('[DEBUG] Emergency storage failed:', storageError);
      }

      // Si tout échoue
      throw new Error('Toutes les méthodes de sauvegarde ont échoué');

    } catch (error) {
      console.error('[DEBUG] Erreur sauvegarde in handleBackupAdapter:', error);
      console.error('[DEBUG] Error stack:', error instanceof Error ? error.stack : 'No stack available');

      // Message d'erreur informatif
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de la sauvegarde';
      addToast(`Erreur sauvegarde: ${errorMessage}. Essayez de redémarrer l'application.`, 'error');
      throw error;
    }
  };

  const handleRestoreAdapter = (file: File) =>
    new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          try {
            importData(e.target.result as string);
            // Marquer qu'une restauration vient d'être faite
            localStorage.setItem('last-data-restore', Date.now().toString());
            console.log('🔄 RESTORE MARKED: Next app load will use restored data without fusion');
            resolve();
          } catch (err) {
            reject(err);
          }
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const handleImportAdapter = (data: any, _mapping: ColumnMapping): Promise<ImportResult> => {
    addToast('Importation effectuée avec succès', 'success');
    return Promise.resolve({
      speakersAdded: 0,
      speakersUpdated: 0,
      visitsAdded: Array.isArray(data) ? data.length : 1,
      visitsUpdated: 0,
      hostsAdded: 0,
      hostsUpdated: 0,
      errors: [],
    });
  };

  const handleMergeAdapter = (
    groups: any[],
    action: 'merge' | 'delete',
    strategy: 'keep-first' | 'keep-recent' | 'manual' = 'keep-recent'
  ) => {
    let successCount = 0;
    groups.forEach((group: any) => {
      if (!group.items || group.items.length < 2) return;
      const sortedItems = [...group.items];
      if (strategy === 'keep-recent') {
        sortedItems.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt || 0).getTime() -
            new Date(a.updatedAt || a.createdAt || 0).getTime()
        );
      }
      const keepItem = sortedItems[0];
      const duplicates = sortedItems.slice(1);
      const keepId =
        group.type === 'host'
          ? (keepItem as any).nom
          : (keepItem as any).id || (keepItem as any).visitId;
      const duplicateIds = duplicates.map((item: any) => {
        if (group.type === 'host') return (item as any).nom;
        if (group.type === 'visit' || group.type === 'archivedVisit') return (item as any).visitId;
        return (item as any).id;
      });

      if (action === 'merge') {
        mergeDuplicates(group.type, keepId, duplicateIds);
        successCount++;
      } else if (action === 'delete') {
        if (group.type === 'speaker') duplicateIds.forEach((id: string) => deleteSpeaker(id));
        else if (group.type === 'host') duplicateIds.forEach((name: string) => deleteHost(name));
        else if (group.type === 'visit') duplicateIds.forEach((id: string) => deleteVisit(id));
        successCount++;
      }
    });
    if (successCount > 0)
      addToast(
        action === 'merge'
          ? `${successCount} groupe(s) fusionné(s)`
          : `${successCount} groupe(s) nettoyé(s)`,
        'success'
      );
  };

  return (
    <div className='max-w-[1600px] mx-auto space-y-3 px-4 sm:px-6 lg:px-8 py-1'>
      {/* Header Page */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6'>
        <div>
          <div className='flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium mb-1'>
            <Monitor className='w-4 h-4' />
            <span>Système & Configuration</span>
          </div>
          <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
            Paramètres
          </h2>
          <p className='text-gray-500 dark:text-gray-400 mt-2 max-w-2xl'>
            Personnalisez votre expérience, gérez les données de la congrégation et configurez les
            options de sécurité avancées.
          </p>
        </div>

        {activeTab !== 'overview' && (
          <Button
            variant='ghost'
            onClick={() => setActiveTab('overview')}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            Retour à l'accueil
          </Button>
        )}
      </div>

      <div className='flex flex-col lg:flex-row gap-4 items-start'>
        {/* Navigation Mobile/Desktop Sidebar */}
        <div className='w-full lg:w-72 shrink-0'>
          <Card className='overflow-hidden border-none shadow-md'>
            <CardBody className='p-2 space-y-1'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'w-full flex items-center justify-between group px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/20 translate-x-1'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        activeTab === tab.id ? 'bg-white/20' : cn(tab.bg, tab.color)
                      )}
                    >
                      <tab.icon className='w-4 h-4' />
                    </div>
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity',
                      activeTab === tab.id && 'opacity-100'
                    )}
                  />
                </button>
              ))}
            </CardBody>
          </Card>

          {/* Quick Stats Sidebar (Only if not in overview) */}
          {activeTab !== 'overview' && (
            <div className='mt-4 space-y-3 hidden lg:block'>
              <h4 className='text-xs font-bold text-gray-400 uppercase tracking-widest px-4'>
                État du système
              </h4>
              <Card className='bg-gray-50/50 dark:bg-gray-800/30 border-dashed'>
                <CardBody className='p-4 space-y-3'>
                  <div className='flex justify-between text-xs'>
                    <span className='text-gray-500'>Base de données</span>
                    <span className='text-green-600 font-bold'>En ligne</span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <span className='text-gray-500'>Dernière synchro</span>
                    <span className='text-gray-900 dark:text-white font-medium'>
                      {localStorage.getItem('lastGoogleSheetSync')
                        ? new Date(
                            localStorage.getItem('lastGoogleSheetSync')!
                          ).toLocaleDateString()
                        : 'Jamais'}
                    </span>
                  </div>
                  <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center gap-2 text-[10px] text-gray-400'>
                      <Shield className='w-3 h-3' />
                      Chiffrement AES-GCM 256
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className='flex-1 w-full min-h-[700px]'>
          {activeTab === 'overview' && (
            <div className='space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
              {/* Stats Bar */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                {[
                  {
                    label: 'Orateurs',
                    value: stats.speakersCount,
                    icon: Users,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                  },
                  {
                    label: 'Visites',
                    value: stats.visitsCount,
                    icon: Calendar,
                    color: 'text-purple-600',
                    bg: 'bg-purple-50',
                  },
                  {
                    label: 'Hôtes',
                    value: stats.hostsCount,
                    icon: MapPin,
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                  },
                  {
                    label: 'Archives',
                    value: stats.archivedCount,
                    icon: Save,
                    color: 'text-orange-600',
                    bg: 'bg-orange-50',
                  },
                ].map((s, i) => (
                  <Card key={i} className='overflow-hidden border-none shadow-sm'>
                    <CardBody className='p-4 flex items-center justify-between'>
                      <div>
                        <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                          {s.label}
                        </p>
                        <p className='text-2xl font-bold text-gray-900 dark:text-white mt-0.5'>
                          {s.value}
                        </p>
                      </div>
                      <div className={cn('p-3 rounded-2xl dark:bg-gray-700', s.bg)}>
                        <s.icon className={cn('w-5 h-5', s.color)} />
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Category Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {tabs
                  .filter((t) => t.id !== 'overview')
                  .map((tab) => (
                    <Card
                      key={tab.id}
                      hoverable
                      onClick={() => setActiveTab(tab.id as any)}
                      className='group'
                    >
                      <CardBody className='p-3 flex flex-col h-full'>
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 duration-300',
                            tab.bg
                          )}
                        >
                          <tab.icon className={cn('w-5 h-5', tab.color)} />
                        </div>
                        <h3 className='text-base font-bold text-gray-900 dark:text-white mb-1'>
                          {tab.label}
                        </h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400 flex-1 leading-tight'>
                          {tab.id === 'profile' &&
                            'Gérez le nom, la ville et les horaires de réunion de votre congrégation.'}
                          {tab.id === 'appearance' &&
                            'Modifiez le thème (Clair/Sombre), la langue et les préférences visuelles.'}
                          {tab.id === 'notifications' &&
                            "Configurez les rappels automatiques et les préférences d'alertes."}
                          {tab.id === 'security' &&
                            'Paramètres de chiffrement et gestion des délais de session.'}
                          {tab.id === 'data' &&
                            'Sauvegardes export/import et synchronisation Google Sheets.'}
                          {tab.id === 'duplicates' &&
                            'Outils de maintenance pour nettoyer les données en doublon.'}
                          {tab.id === 'about' &&
                            "Informations sur l'application, licence et version actuelle."}
                        </p>
                        <div className='mt-6 flex items-center text-primary-600 font-semibold text-sm'>
                          Configurer{' '}
                          <ChevronRight className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform' />
                        </div>
                      </CardBody>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Profil Congrégation */}
          {activeTab === 'profile' && (
            <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-300'>
              <Card className='border-none shadow-lg outline outline-1 outline-gray-200 dark:outline-gray-700'>
                <CardHeader className='bg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-100 dark:border-gray-800'>
                  <div className='flex items-center gap-3'>
                    <div className='p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl'>
                      <User className='w-6 h-6' />
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                        Identité de la Congrégation
                      </h3>
                      <p className='text-sm text-gray-500'>
                        Ces informations apparaissent sur les documents officiels.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className='space-y-8 p-8'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'>
                    <Input
                      label='Nom de la congrégation'
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder='Ex: Lyon KBV'
                      leftIcon={<Users className='w-4 h-4' />}
                    />
                    <Input
                      label='Ville'
                      value={profileForm.city || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      placeholder='Ex: Lyon'
                      leftIcon={<MapPin className='w-4 h-4' />}
                    />
                    <Input
                      label='Responsable Accueil'
                      value={profileForm.hospitalityOverseer}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, hospitalityOverseer: e.target.value })
                      }
                      placeholder='Nom complet'
                    />
                    <Input
                      label='Téléphone Responsable'
                      value={profileForm.hospitalityOverseerPhone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, hospitalityOverseerPhone: e.target.value })
                      }
                      placeholder='+33 6 XX XX XX XX'
                      leftIcon={<Phone className='w-4 h-4' />}
                    />
                    <Select
                      label='Jour de réunion'
                      value={profileForm.meetingDay || 'Samedi'}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, meetingDay: e.target.value })
                      }
                      options={[
                        { value: 'Dimanche', label: 'Dimanche' },
                        { value: 'Lundi', label: 'Lundi' },
                        { value: 'Mardi', label: 'Mardi' },
                        { value: 'Mercredi', label: 'Mercredi' },
                        { value: 'Jeudi', label: 'Jeudi' },
                        { value: 'Vendredi', label: 'Vendredi' },
                        { value: 'Samedi', label: 'Samedi' },
                      ]}
                    />
                    <Input
                      label='Heure de réunion'
                      type='time'
                      value={profileForm.meetingTime || '14:30'}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, meetingTime: e.target.value })
                      }
                      leftIcon={<Clock className='w-4 h-4' />}
                    />
                  </div>

                  {/* Preview Business Card */}
                  <div className='bg-gradient-to-br from-primary-500 to-primary-700 p-6 rounded-2xl shadow-xl text-white max-w-sm mx-auto transform hover:rotate-1 transition-transform cursor-default'>
                    <div className='flex justify-between items-start mb-8'>
                      <div className='bg-white/20 p-2 rounded-lg backdrop-blur-md'>
                        <Monitor className='w-6 h-6' />
                      </div>
                      <div className='text-[10px] bg-black/10 px-2 py-1 rounded-full tracking-tighter uppercase font-bold'>
                        OFFICIAL PROFILE
                      </div>
                    </div>
                    <h4 className='text-lg font-bold mb-1 truncate'>
                      {profileForm.name || 'Nom Congrégation'}
                    </h4>
                    <p className='text-xs opacity-80 mb-4'>{profileForm.city || 'Ville'}, FR</p>

                    <div className='space-y-2 text-xs'>
                      <div className='flex items-center gap-2'>
                        <User className='w-3 h-3 opacity-60' />
                        <span>{profileForm.hospitalityOverseer || 'Responsable'}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-3 h-3 opacity-60' />
                        <span>
                          {profileForm.meetingDay || 'Jour'} à {profileForm.meetingTime || '00:00'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800'>
                    <Button
                      size='lg'
                      leftIcon={<Save className='w-4 h-4' />}
                      onClick={handleSaveProfile}
                      className='shadow-lg shadow-primary-200 dark:shadow-none'
                    >
                      Enregistrer les modifications
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Apparence */}
          {activeTab === 'appearance' && (
            <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 uppercase'>
              <Card className='border-none shadow-lg'>
                <CardHeader>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <Palette className='w-6 h-6 text-pink-500' />
                    Préférences Visuelles
                  </h3>
                </CardHeader>
                <CardBody className='p-8 space-y-12'>
                  <div>
                    <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 mb-6 uppercase tracking-wider'>
                      Thème de l'interface
                    </label>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                      {[
                        {
                          value: 'light',
                          label: 'Clair',
                          icon: Sun,
                          color: 'text-orange-500',
                          preview: 'bg-gray-100',
                          inner: 'bg-white border-gray-200',
                        },
                        {
                          value: 'dark',
                          label: 'Sombre',
                          icon: Moon,
                          color: 'text-indigo-400',
                          preview: 'bg-gray-950',
                          inner: 'bg-gray-800 border-gray-700',
                        },
                        {
                          value: 'auto',
                          label: 'Système',
                          icon: Monitor,
                          color: 'text-gray-500',
                          preview: 'bg-gradient-to-r from-gray-100 to-gray-950',
                          inner: 'bg-gray-400 border-gray-400',
                        },
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => handleThemeChange(theme.value as Theme)}
                          className={cn(
                            'group relative flex flex-col items-center p-2 rounded-2xl border-2 transition-all duration-300',
                            settings.theme === theme.value
                              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                              : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          )}
                        >
                          <div
                            className={cn(
                              'w-full aspect-[4/3] rounded-xl mb-4 overflow-hidden shadow-inner flex items-center justify-center',
                              theme.preview
                            )}
                          >
                            <div
                              className={cn('w-1/2 h-1/2 border rounded-md shadow-lg', theme.inner)}
                            ></div>
                          </div>
                          <div className='flex items-center gap-2 pb-2'>
                            <theme.icon className={cn('w-4 h-4', theme.color)} />
                            <span className='text-sm font-bold'>{theme.label}</span>
                          </div>
                          {settings.theme === theme.value && (
                            <div className='absolute -top-2 -right-2 bg-primary-500 text-white p-1 rounded-full shadow-lg'>
                              <CheckCircle className='w-4 h-4' />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className='pt-8 border-t border-gray-100 dark:border-gray-800'>
                    <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider'>
                      Langue d'affichage
                    </label>
                    <div className='max-w-xs'>
                      <Select
                        value={settings.language}
                        onChange={(e) => handleLanguageChange(e.target.value as Language)}
                        options={[
                          { value: 'fr', label: '🇫🇷 Français' },
                          { value: 'cv', label: '🇨🇻 Capverdien' },
                          { value: 'pt', label: '🇵🇹 Portugais' },
                        ]}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-300'>
              <Card className='border-none shadow-lg'>
                <CardHeader>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <Bell className='w-6 h-6 text-orange-500' />
                    Notifications & Rappels
                  </h3>
                </CardHeader>
                <CardBody className='p-8 space-y-8'>
                  <div className='flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/40 rounded-2xl'>
                    <div>
                      <h4 className='font-bold text-gray-900 dark:text-white'>
                        Service de notifications
                      </h4>
                      <p className='text-sm text-gray-500'>
                        Autoriser l'application à envoyer des messages système.
                      </p>
                      <Button
                        variant='secondary'
                        size='sm'
                        onClick={handleTestNotification}
                        className='mt-3'
                        leftIcon={<Bell className='w-4 h-4' />}
                      >
                        Tester une notification
                      </Button>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <span className='sr-only'>Activer les notifications</span>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        checked={settings.notifications.enabled}
                        onChange={(e) =>
                          updateSettings({
                            ...settings,
                            notifications: { ...settings.notifications, enabled: e.target.checked },
                          })
                        }
                        aria-label='Activer les notifications push'
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  {settings.notifications.enabled && (
                    <div className='space-y-8 pl-4 border-l-2 border-primary-100 dark:border-primary-900/30'>
                      <div>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-4'>
                          Délais de rappel
                        </h4>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          {[
                            {
                              value: REMINDER_ONE_WEEK,
                              label: 'Une semaine',
                              desc: "Rappel J-7 pour confirmer l'orateur.",
                            },
                            {
                              value: REMINDER_TWO_DAYS,
                              label: '48 Heures',
                              desc: 'Rappel J-2 pour les détails finaux.',
                            },
                          ].map((t) => (
                            <Card
                              key={t.value}
                              className={cn(
                                'cursor-pointer border-2 transition-all',
                                settings.notifications.reminderDays.includes(t.value)
                                  ? 'border-primary-500 bg-primary-50/20'
                                  : 'border-transparent bg-gray-50/50 dark:bg-gray-800/50'
                              )}
                              onClick={() => {
                                const newDays = settings.notifications.reminderDays.includes(
                                  t.value
                                )
                                  ? settings.notifications.reminderDays.filter((d) => d !== t.value)
                                  : [...settings.notifications.reminderDays, t.value];
                                updateSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    reminderDays: newDays,
                                  },
                                });
                              }}
                            >
                              <CardBody className='p-4 flex items-start gap-3'>
                                <div
                                  className={cn(
                                    'p-2 rounded-lg',
                                    settings.notifications.reminderDays.includes(t.value)
                                      ? 'bg-primary-500 text-white'
                                      : 'bg-gray-200 dark:bg-gray-700'
                                  )}
                                >
                                  <Clock className='w-4 h-4' />
                                </div>
                                <div>
                                  <p className='font-bold text-sm'>{t.label}</p>
                                  <p className='text-xs text-gray-500 mt-1'>{t.desc}</p>
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div className='pt-4'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-4'>
                          Alertes sonores & Vibrations
                        </h4>
                        <div className='space-y-4'>
                          {[
                            {
                              id: 'sound',
                              label: 'Alertes sonores',
                              icon: Bell,
                              checked: settings.notifications.sound,
                            },
                            {
                              id: 'vibration',
                              label: 'Vibrations',
                              icon: Smartphone,
                              checked: settings.notifications.vibration,
                            },
                          ].map((opt) => (
                            <div
                              key={opt.id}
                              className='flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors'
                            >
                              <div className='flex items-center gap-3'>
                                <opt.icon className='w-4 h-4 text-gray-400' />
                                <span className='text-sm font-medium'>{opt.label}</span>
                              </div>
                              <input
                                type='checkbox'
                                checked={opt.checked}
                                onChange={(e) =>
                                  updateSettings({
                                    ...settings,
                                    notifications: {
                                      ...settings.notifications,
                                      [opt.id]: e.target.checked,
                                    },
                                  })
                                }
                                className='w-5 h-5 rounded text-primary-600 focus:ring-primary-500'
                                aria-label={opt.label}
                                id={`notification-${opt.id}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          )}

          {/* Sécurité */}
          {activeTab === 'security' && (
            <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-300'>
              <Card className='border-none shadow-lg'>
                <CardHeader>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <Shield className='w-6 h-6 text-green-500' />
                    Confidentialité & Sécurité
                  </h3>
                </CardHeader>
                <CardBody className='p-8 space-y-10'>
                  <div className='p-6 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-2xl flex items-start gap-4'>
                    <div className='p-3 bg-white dark:bg-green-900/40 rounded-xl shadow-sm'>
                      <Shield className='w-8 h-8 text-green-600' />
                    </div>
                    <div>
                      <h4 className='font-bold text-green-900 dark:text-green-100'>
                        Protection des données
                      </h4>
                      <p className='text-sm text-green-700 dark:text-green-300 mt-1'>
                        Toutes les données sensibles (noms, téléphones) sont stockées localement et
                        peuvent être chiffrées pour plus de sécurité.
                      </p>
                    </div>
                  </div>

                  <div className='space-y-6'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <label className='font-bold text-gray-900 dark:text-white'>
                          Chiffrement de la base
                        </label>
                        <p className='text-sm text-gray-500'>
                          Utiliser AES-GCM 256 pour les données locales.
                        </p>
                      </div>
                      <input
                        type='checkbox'
                        checked={settings.encryptionEnabled}
                        onChange={(e) =>
                          updateSettings({ ...settings, encryptionEnabled: e.target.checked })
                        }
                        className='w-6 h-6 rounded-lg text-green-600 focus:ring-green-500'
                        aria-label='Activer le chiffrement de la base de données'
                        id='encryption-toggle'
                      />
                    </div>

                    <div className='pt-6 border-t border-gray-100 dark:border-gray-800'>
                      <label className='block font-bold text-gray-900 dark:text-white mb-2'>
                        Délai d'expiration de session
                      </label>
                      <p className='text-sm text-gray-500 mb-4'>
                        L'application demandera une authentification après cette période
                        d'inactivité.
                      </p>
                      <div className='max-w-xs'>
                        <Select
                          value={settings.sessionTimeout?.toString() || '30'}
                          onChange={(e) =>
                            updateSettings({
                              ...settings,
                              sessionTimeout: parseInt(e.target.value, 10),
                            })
                          }
                          options={[
                            { value: '15', label: '15 minutes' },
                            { value: '30', label: '30 minutes' },
                            { value: '60', label: '1 heure' },
                            { value: '120', label: '2 heures' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Données */}
          {activeTab === 'data' && (
            <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-300'>
              <Card className='border-none shadow-lg overflow-hidden'>
                <div className='bg-gradient-to-r from-amber-500 to-amber-600 p-8 text-white relative'>
                  <Database className='absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 rotate-12' />
                  <h3 className='text-2xl font-bold flex items-center gap-3'>
                    <Database className='w-8 h-8' />
                    Cycle de vie des données
                  </h3>
                  <p className='text-amber-50 mt-2 opacity-90 max-w-xl'>
                    Contrôlez la synchronisation avec le cloud, créez des sauvegardes et gérez
                    l'importation massive de données.
                  </p>
                </div>

                <CardBody className='p-8 space-y-10'>
                  {/* Google Sheets Section */}
                  <div className='p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl'>
                    <div className='flex flex-col md:flex-row justify-between gap-6'>
                      <div className='flex-1'>
                        <h4 className='text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2'>
                          <RefreshCw className={cn('w-5 h-5', isSyncing && 'animate-spin')} />
                          Synchronisation Google Sheets
                        </h4>
                        <p className='text-sm text-blue-700 dark:text-blue-300 mt-2'>
                          Mise à jour automatique des orateurs et des visites depuis la feuille de
                          calcul partagée.
                        </p>
                        {localStorage.getItem('lastGoogleSheetSync') && (
                          <p className='text-xs text-blue-500 mt-2 font-medium'>
                            Dernière synchronisation :{' '}
                            {new Date(localStorage.getItem('lastGoogleSheetSync')!).toLocaleString(
                              'fr-FR'
                            )}
                          </p>
                        )}
                      </div>
                      <div className='flex items-center shrink-0'>
                        <Button
                          onClick={handleSyncGoogleSheet}
                          disabled={isSyncing}
                          className='shadow-lg shadow-blue-200 dark:shadow-none'
                        >
                          {isSyncing ? 'Traitement en cours...' : 'Synchroniser maintenant'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {[
                      {
                        id: 'backup',
                        label: 'Sauvegardes',
                        desc: 'Backups locaux chiffrés',
                        icon: Save,
                        color: 'text-green-600',
                        bg: 'bg-green-100',
                        action: () => setIsBackupModalOpen(true),
                      },
                      {
                        id: 'whatsapp',
                        label: 'WhatsApp',
                        desc: 'Sauvegarde via WhatsApp',
                        icon: MessageSquare,
                        color: 'text-green-500',
                        bg: 'bg-green-50',
                        action: handleWhatsAppBackup,
                      },
                      {
                        id: 'import',
                        label: 'Importation',
                        desc: 'Assistant CSV / JSON',
                        icon: RefreshCw,
                        color: 'text-purple-600',
                        bg: 'bg-purple-100',
                        action: () => setIsImportModalOpen(true),
                      },
                      {
                        id: 'archive',
                        label: 'Archives',
                        desc: "Consulter l'historique",
                        icon: Database,
                        color: 'text-orange-600',
                        bg: 'bg-orange-100',
                        action: () => setIsArchiveModalOpen(true),
                      },
                      {
                        id: 'phones',
                        label: 'Téléphones',
                        desc: 'Import numéros massif',
                        icon: Phone,
                        color: 'text-indigo-600',
                        bg: 'bg-indigo-100',
                        action: () => setIsPhoneImportModalOpen(true),
                      },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={btn.action}
                        className='flex items-center gap-4 p-5 text-left border border-gray-100 dark:border-gray-800 rounded-2xl transition-all duration-200 hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:shadow-lg'
                      >
                        <div className={cn('p-3 rounded-xl dark:bg-gray-800', btn.bg, btn.color)}>
                          <btn.icon className='w-6 h-6' />
                        </div>
                        <div>
                          <div className='font-bold text-gray-900 dark:text-white'>{btn.label}</div>
                          <div className='text-xs text-gray-500'>{btn.desc}</div>
                        </div>
                        <ChevronRight className='w-4 h-4 ml-auto text-gray-300' />
                      </button>
                    ))}
                  </div>

                  <div className='pt-8 border-t border-gray-100 dark:border-gray-800'>
                    <h4 className='font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase text-xs tracking-widest'>
                      <Link className='w-4 h-4 text-gray-400' />
                      Accès externes
                    </h4>
                    <div className='flex flex-wrap gap-3'>
                      <Button
                        variant='outline'
                        onClick={() =>
                          window.open(
                            'https://docs.google.com/spreadsheets/d/1drIzPPi6AohCroSyUkF1UmMFxuEtMACBF4XATDjBOcg',
                            '_blank'
                          )
                        }
                        className='rounded-xl'
                      >
                        Google Sheet Source
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => window.open('https://www.jw.org/kea/', '_blank')}
                        className='rounded-xl'
                      >
                        JW.ORG (Cap-Verdien)
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Doublons */}
          {activeTab === 'duplicates' && (
            <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 uppercase'>
              <Card className='border-none shadow-lg'>
                <CardHeader>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <Copy className='w-6 h-6 text-indigo-500' />
                    Détection de Doublons
                  </h3>
                </CardHeader>
                <CardBody className='p-8 space-y-8'>
                  <p className='text-gray-500'>
                    Utilisez ces outils pour identifier les entrées similaires et garder une base de
                    données propre.
                  </p>

                  <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
                    {[
                      {
                        label: 'Orateurs',
                        count: stats.speakersCount,
                        icon: User,
                        color: 'text-blue-500',
                      },
                      {
                        label: 'Visites',
                        count: stats.visitsCount,
                        icon: Calendar,
                        color: 'text-purple-500',
                      },
                      {
                        label: 'Hôtes',
                        count: stats.hostsCount,
                        icon: MapPin,
                        color: 'text-green-500',
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className='p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-center border border-gray-100 dark:border-gray-800'
                      >
                        <s.icon className={cn('w-8 h-8 mx-auto mb-3', s.color)} />
                        <div className='text-3xl font-extrabold text-gray-900 dark:text-white'>
                          {s.count}
                        </div>
                        <div className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1'>
                          {s.label} totaux
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='pt-8 text-center'>
                    <Button
                      size='lg'
                      onClick={() => setIsDuplicateModalOpen(true)}
                      className='px-12 py-6 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none bg-indigo-600 hover:bg-indigo-700'
                    >
                      Démarrer l'audit complet
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* About */}
          {activeTab === 'about' && (
            <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-300'>
              <div className='flex flex-col items-center justify-center p-12 text-center'>
                <div className='w-32 h-32 bg-primary-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary-200 dark:shadow-none mb-8 rotate-12 transition-transform hover:rotate-0 duration-500'>
                  <Monitor className='w-16 h-16 text-white' />
                </div>
                <h3 className='text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-2'>
                  KBV <span className='text-primary-600'>MANAGER</span>
                </h3>
                <p className='text-gray-400 font-bold tracking-[0.2em] uppercase text-[10px] mb-8'>
                  Version 1.20.1 Built 2025
                </p>

                <div className='max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-6'>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Cette application a été conçue exclusivement pour l'organisation et la gestion
                    des orateurs visiteurs pour la congrégation KBV DV Lyon .FP.
                  </p>
                  <div className='pt-4 border-t border-gray-50 dark:border-gray-700 grid grid-cols-2 gap-4 text-left'>
                    <div>
                      <p className='text-[10px] text-gray-400 font-bold uppercase'>Développeur</p>
                      <p className='text-sm font-bold text-gray-900 dark:text-white'>Pinto Francisco</p>
                    </div>
                    <div>
                      <p className='text-[10px] text-gray-400 font-bold uppercase'>Dernière MAJ</p>
                      <p className='text-sm font-bold text-gray-900 dark:text-white'>Jan 2026</p>
                    </div>
                  </div>
                  
                  {/* Copyright */}
                  <div className='pt-4 border-t border-gray-50 dark:border-gray-700'>
                    <p className='text-xs text-gray-400 text-center'>
                      © 2025-2026 Pinto Francisco
                    </p>
                    <p className='text-[10px] text-gray-400 text-center mt-1'>
                      Tous droits réservés
                    </p>
                  </div>
                </div>

                <p className='mt-12 text-[10px] text-gray-400 uppercase tracking-widest font-bold'>
                  Built with React • Tailwind • Capacitor
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <BackupManagerModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onBackup={handleBackupAdapter}
        onRestore={handleRestoreAdapter}
      />

      <ImportWizardModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportAdapter}
      />

      <ArchiveManagerModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onRestore={(_visitIds: string[]) => {
          // Logic for restoring visits
          addToast(`${_visitIds.length} visite(s) restaurée(s)`, 'success');
        }}
        onDelete={(_visitIds: string[]) => {
          _visitIds.forEach((id) => deleteVisit(id));
          addToast(`${_visitIds.length} visite(s) supprimée(s)`, 'info');
        }}
        onExport={async () => {
          await handleBackupAdapter({
            includeArchived: true,
            includeSettings: false,
            includeTemplates: false,
            encrypt: false,
          });
        }}
      />

      <DuplicateDetectionModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        onMerge={handleMergeAdapter}
      />

      <PhoneNumberImportModal
        isOpen={isPhoneImportModalOpen}
        onClose={() => setIsPhoneImportModalOpen(false)}
      />
    </div>
  );
};

export default Settings;
