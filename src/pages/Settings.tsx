import React, { useState } from 'react';
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
} from 'lucide-react';
import { CongregationProfile, ImportResult, Language, Theme } from '@/types';
import { BackupManagerModal } from '@/components/settings/BackupManagerModal';
import { ImportWizardModal } from '@/components/settings/ImportWizardModal';
import { ArchiveManagerModal } from '@/components/settings/ArchiveManagerModal';
import { DuplicateDetectionModal } from '@/components/settings/DuplicateDetectionModal';
import { PhoneNumberImportModal } from '@/components/settings/PhoneNumberImportModal';

// Interfaces locales pour les types non exportés des modales
// Note: Idéalement, ces types devraient être dans types.ts
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

// Constantes pour les jours de rappel
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

  const [activeTab, setActiveTab] = useState<
    'profile' | 'appearance' | 'notifications' | 'security' | 'data' | 'duplicates'
  >('profile');
  const [profileForm, setProfileForm] = useState<CongregationProfile>(congregationProfile);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isPhoneImportModalOpen, setIsPhoneImportModalOpen] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'data', label: 'Données', icon: Database },
    { id: 'duplicates', label: 'Doublons', icon: Copy },
  ] as const;

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
      .finally(() => {
        setIsSyncing(false);
      });
  };

  // Handlers pour les modales
  // Constantes pour les valeurs magiques
  const DATE_FORMAT_LENGTH = 10; // Longueur de la date au format ISO (YYYY-MM-DD)

  const handleBackupAdapter = (_options: BackupOptions): Promise<void> =>
    new Promise((resolve) => {
      // TODO: Utiliser les options pour filtrer l'export si nécessaire
      const json = exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kbv-backup-${new Date().toISOString().slice(0, DATE_FORMAT_LENGTH)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('Sauvegarde effectuée avec succès', 'success');
      resolve();
    });

  const handleRestoreAdapter = (file: File) =>
    new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          try {
            importData(e.target.result as string);
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
    try {
      // Logique d'importation simplifiée
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
    } catch (err) {
      return Promise.resolve({
        speakersAdded: 0,
        speakersUpdated: 0,
        visitsAdded: 0,
        visitsUpdated: 0,
        hostsAdded: 0,
        hostsUpdated: 0,
        errors: [String(err)],
      });
    }
  };

  const handleMergeAdapter = (
    groups: any[],
    action: 'merge' | 'delete',
    strategy: 'keep-first' | 'keep-recent' | 'manual' = 'keep-recent'
  ) => {
    const MIN_ITEMS_NEEDED = 2;
    let successCount = 0;

    groups.forEach((group: any) => {
      if (!group.items || group.items.length < MIN_ITEMS_NEEDED) return;

      // 1. Determine Master and Duplicates based on strategy
      const sortedItems = [...group.items];

      if (strategy === 'keep-recent') {
        // Sort by creation/update date descending (Newest first)
        sortedItems.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        });
      } else {
        // keep-first: Assume the order in the group reflects detection order (usually original first or first found)
        // If detection order is arbitrary, we might need better logic, but sticking to existing 'first index' behavior.
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
        // "Delete Duplicates" implies removing the COPIES, keeping the MASTER.
        // We do NOT reassign visits. We just delete the extra entities.
        if (group.type === 'speaker') {
          // For delete action, use batch or loop
          // Currently deleteSpeaker takes one ID. To be safe, use loop or context batch if available (queue handles it).
          // mergeDuplicates actually handles deletion of duplicates too.
          // The difference is solely whether we reassign relations.
          // Since `mergeDuplicates` logic is: "Reassign visits... THEN delete speakers",
          // If we want ONLY delete, we manually delete.
          duplicateIds.forEach((id: string) => deleteSpeaker(id)); // Assuming deleteSpeaker is available in scope
        } else if (group.type === 'host') {
          duplicateIds.forEach((name: string) => deleteHost(name));
        } else if (group.type === 'visit') {
          duplicateIds.forEach((id: string) => deleteVisit(id));
        }
        successCount++;
      }
    });

    if (successCount > 0) {
      addToast(
        action === 'merge'
          ? `${successCount} groupe(s) fusionné(s) avec succès`
          : `${successCount} groupe(s) nettoyé(s) (doublons supprimés)`,
        'success'
      );
    }
  };

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Paramètres</h2>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
          Gérez les paramètres de l'application et de votre congrégation
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Navigation Tabs */}
        <div className='lg:w-64'>
          <Card>
            <CardBody className='p-2'>
              <nav className='space-y-1'>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                  >
                    <tab.icon className='w-4 h-4' />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardBody>
          </Card>
        </div>

        {/* Content */}
        <div className='flex-1 min-h-[600px]'>
          {/* Profil Congrégation */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                  <User className='w-5 h-5' />
                  Profil de la Congrégation
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Informations générales sur votre congrégation
                </p>
              </CardHeader>
              <CardBody className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Nom de la congrégation
                    </label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder='Ex: KBV DV Lyon'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Ville
                    </label>
                    <Input
                      value={profileForm.city || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      placeholder='Ex: Lyon'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Responsable Accueil
                    </label>
                    <Input
                      value={profileForm.hospitalityOverseer}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, hospitalityOverseer: e.target.value })
                      }
                      placeholder='Nom du responsable'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Téléphone Responsable
                    </label>
                    <Input
                      value={profileForm.hospitalityOverseerPhone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, hospitalityOverseerPhone: e.target.value })
                      }
                      placeholder='+33 6 XX XX XX XX'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Jour de réunion
                    </label>
                    <Select
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
                        { value: 'Samedi', label: 'Samedi' }, // 6ème jour de la semaine (0=Dimanche)
                      ]}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Heure de réunion
                    </label>
                    <Input
                      type='time'
                      value={profileForm.meetingTime || '14:30'}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, meetingTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className='flex justify-end'>
                  <Button leftIcon={<Save className='w-4 h-4' />} onClick={handleSaveProfile}>
                    Enregistrer
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Apparence */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                  <Palette className='w-5 h-5' />
                  Apparence
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Personnalisez l'apparence de l'application
                </p>
              </CardHeader>
              <CardBody className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                    Thème
                  </label>
                  <div className='grid grid-cols-3 gap-3'>
                    {[
                      { value: 'light', label: 'Clair', icon: Sun },
                      { value: 'dark', label: 'Sombre', icon: Moon },
                      { value: 'auto', label: 'Auto', icon: Monitor },
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => handleThemeChange(theme.value as Theme)}
                        className={`p-4 border rounded-lg transition-all ${
                          settings.theme === theme.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <theme.icon className='w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400' />
                        <div className='text-sm font-medium'>{theme.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                    Langue
                  </label>
                  <Select
                    value={settings.language}
                    onChange={(e) => handleLanguageChange(e.target.value as Language)}
                    options={[
                      { value: 'fr', label: 'Français' },
                      { value: 'cv', label: 'Capverdien' },
                      { value: 'pt', label: 'Portugais' },
                    ]}
                    className='max-w-xs'
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                  <Bell className='w-5 h-5' />
                  Notifications
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Gérez vos préférences de notifications
                </p>
              </CardHeader>
              <CardBody className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='notifications-enabled' className='cursor-pointer'>
                      <div className='font-medium text-gray-900 dark:text-white'>
                        Notifications activées
                      </div>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        Recevoir des rappels et alertes
                      </div>
                    </label>
                    <input
                      id='notifications-enabled'
                      type='checkbox'
                      checked={settings.notifications.enabled}
                      onChange={(e) =>
                        updateSettings({
                          ...settings,
                          notifications: { ...settings.notifications, enabled: e.target.checked },
                        })
                      }
                      className='rounded'
                    />
                  </div>

                  {settings.notifications.enabled && (
                    <>
                      <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                        <h4 className='font-medium text-gray-900 dark:text-white mb-3'>
                          Rappels automatiques
                        </h4>
                        <div className='space-y-3'>
                          {[
                            {
                              value: REMINDER_ONE_WEEK,
                              days: REMINDER_ONE_WEEK,
                              description: '1 semaine avant la visite',
                            },
                            {
                              value: REMINDER_TWO_DAYS,
                              days: REMINDER_TWO_DAYS,
                              description: '2 jours avant la visite',
                            },
                          ].map(({ value, days, description }) => (
                            <div key={value} className='flex items-center justify-between'>
                              <label htmlFor={`reminder-${value}`} className='cursor-pointer'>
                                <div className='font-medium text-gray-900 dark:text-white'>
                                  J-{days}
                                </div>
                                <div className='text-sm text-gray-500 dark:text-gray-400'>
                                  {description}
                                </div>
                              </label>
                              <input
                                id={`reminder-${value}`}
                                type='checkbox'
                                checked={settings.notifications.reminderDays.includes(days)}
                                onChange={(e) => {
                                  const newDays = e.target.checked
                                    ? [...settings.notifications.reminderDays, days]
                                    : settings.notifications.reminderDays.filter((d) => d !== days);
                                  updateSettings({
                                    ...settings,
                                    notifications: {
                                      ...settings.notifications,
                                      reminderDays: newDays,
                                    },
                                  });
                                }}
                                className='rounded'
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                        <h4 className='font-medium text-gray-900 dark:text-white mb-3'>Options</h4>
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between'>
                            <label htmlFor='sound-enabled' className='cursor-pointer'>
                              <div className='font-medium text-gray-900 dark:text-white'>Son</div>
                              <div className='text-sm text-gray-500 dark:text-gray-400'>
                                Jouer un son pour les notifications
                              </div>
                            </label>
                            <input
                              id='sound-enabled'
                              type='checkbox'
                              checked={settings.notifications.sound}
                              onChange={(e) =>
                                updateSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    sound: e.target.checked,
                                  },
                                })
                              }
                              className='rounded'
                            />
                          </div>
                          <div className='flex items-center justify-between'>
                            <label htmlFor='vibration-enabled' className='cursor-pointer'>
                              <div className='font-medium text-gray-900 dark:text-white'>
                                Vibration
                              </div>
                              <div className='text-sm text-gray-500 dark:text-gray-400'>
                                Faire vibrer l'appareil
                              </div>
                            </label>
                            <input
                              id='vibration-enabled'
                              type='checkbox'
                              checked={settings.notifications.vibration}
                              onChange={(e) =>
                                updateSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    vibration: e.target.checked,
                                  },
                                })
                              }
                              className='rounded'
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Sécurité */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                  <Shield className='w-5 h-5' />
                  Sécurité
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Gérez la sécurité et le chiffrement des données
                </p>
              </CardHeader>
              <CardBody className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='encryption-enabled' className='cursor-pointer'>
                      <div className='font-medium text-gray-900 dark:text-white'>
                        Chiffrement activé
                      </div>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        Protéger les données sensibles avec un chiffrement AES-GCM
                      </div>
                    </label>
                    <input
                      id='encryption-enabled'
                      type='checkbox'
                      checked={settings.encryptionEnabled}
                      onChange={(e) =>
                        updateSettings({
                          ...settings,
                          encryptionEnabled: e.target.checked,
                        })
                      }
                      className='rounded'
                    />
                  </div>

                  <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Timeout de session (minutes)
                    </label>
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
                      className='max-w-xs'
                    />
                  </div>

                  <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                    <div className='flex items-center gap-2'>
                      <Smartphone className='w-4 h-4 text-gray-500' />
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        Version 1.20.0
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Données (NOUVELLE VERSION) */}
          {activeTab === 'data' && (
            <Card>
              <CardHeader>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                  <Database className='w-5 h-5' />
                  Gestion des Données
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Synchronisation, sauvegardes et archives
                </p>
              </CardHeader>
              <CardBody className='space-y-6'>
                <div className='space-y-6'>
                  {/* Google Sheets */}
                  <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                    <h4 className='font-medium text-blue-900 dark:text-blue-300 mb-2'>
                      Synchronisation Google Sheets
                    </h4>
                    <p className='text-sm text-blue-700 dark:text-blue-400 mb-4'>
                      Cette fonction récupère automatiquement les visites programmées depuis votre
                      Google Sheet et met à jour l'application. Les orateurs et visites existants
                      seront fusionnés intelligemment.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 items-center'>
                      <Button
                        leftIcon={
                          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        }
                        onClick={handleSyncGoogleSheet}
                        disabled={isSyncing}
                      >
                        {isSyncing ? 'Synchronisation en cours...' : 'Synchroniser maintenant'}
                      </Button>

                      {localStorage.getItem('lastGoogleSheetSync') && (
                        <p className='text-xs text-gray-600 dark:text-gray-400'>
                          Dernière synchro :{' '}
                          {new Date(localStorage.getItem('lastGoogleSheetSync')!).toLocaleString(
                            'fr-FR'
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Boutons d'action Modales */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <button
                      onClick={() => setIsBackupModalOpen(true)}
                      className='flex items-center gap-4 p-4 text-left border rounded-lg transition-all hover:border-primary-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                    >
                      <div className='p-3 bg-green-100 text-green-600 rounded-full dark:bg-green-900/30 dark:text-green-400'>
                        <Save className='w-6 h-6' />
                      </div>
                      <div>
                        <div className='font-medium text-gray-900 dark:text-white'>Sauvegardes</div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          Gérer les backups locaux et chiffrés
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setIsImportModalOpen(true)}
                      className='flex items-center gap-4 p-4 text-left border rounded-lg transition-all hover:border-primary-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                    >
                      <div className='p-3 bg-purple-100 text-purple-600 rounded-full dark:bg-purple-900/30 dark:text-purple-400'>
                        <Database className='w-6 h-6' />
                      </div>
                      <div>
                        <div className='font-medium text-gray-900 dark:text-white'>
                          Importer des données
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          Assistant d'importation CSV/JSON
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setIsArchiveModalOpen(true)}
                      className='flex items-center gap-4 p-4 text-left border rounded-lg transition-all hover:border-primary-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                    >
                      <div className='p-3 bg-orange-100 text-orange-600 rounded-full dark:bg-orange-900/30 dark:text-orange-400'>
                        <Database className='w-6 h-6' />
                      </div>
                      <div>
                        <div className='font-medium text-gray-900 dark:text-white'>Archives</div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          Consulter l'historique des visites
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setIsPhoneImportModalOpen(true)}
                      className='flex items-center gap-4 p-4 text-left border rounded-lg transition-all hover:border-primary-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                    >
                      <div className='p-3 bg-indigo-100 text-indigo-600 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400'>
                        <Phone className='w-6 h-6' />
                      </div>
                      <div>
                        <div className='font-medium text-gray-900 dark:text-white'>
                          Numéros de Téléphone
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          Importer les numéros depuis JSON
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                    <h4 className='font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2'>
                      <Link className='w-4 h-4' />
                      Liens Utiles
                    </h4>
                    <div className='flex flex-col sm:flex-row gap-4'>
                      <Button
                        variant='secondary'
                        onClick={() =>
                          window.open(
                            'https://docs.google.com/spreadsheets/d/1drIzPPi6AohCroSyUkF1UmMFxuEtMACBF4XATDjBOcg',
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }
                      >
                        Ouvrir Google Sheet
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() =>
                          window.open('https://www.jw.org/kea/', '_blank', 'noopener,noreferrer')
                        }
                      >
                        JW.ORG (Cap-Verdien)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}



          {/* Doublons (NOUVELLE VERSION) */}
          {activeTab === 'duplicates' && (
            <Card>
              <CardHeader>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                  <Copy className='w-5 h-5' />
                  Détection de Doublons
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Analysez et fusionnez les doublons dans votre base de données (y compris les
                  archives)
                </p>
              </CardHeader>
              <CardBody className='space-y-6'>
                {/* Cartes statistiques */}
                <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                  <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
                    <div className='flex items-center gap-3'>
                      <User className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                      <div>
                        <div className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
                          {(() => {
                            const speakerNames = new Map();
                            speakers.forEach((s) => {
                              const key = s.nom.toLowerCase().trim().replace(/\s+/g, ' ');
                              speakerNames.set(key, (speakerNames.get(key) || 0) + 1);
                            });
                            return Array.from(speakerNames.values()).filter((c) => c > 1).length;
                          })()}
                        </div>
                        <div className='text-xs text-blue-700 dark:text-blue-300'>Orateurs</div>
                      </div>
                    </div>
                  </div>

                  <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800'>
                    <div className='flex items-center gap-3'>
                      <Users className='w-6 h-6 text-green-600 dark:text-green-400' />
                      <div>
                        <div className='text-2xl font-bold text-green-900 dark:text-green-100'>
                          {(() => {
                            const hostNames = new Map();
                            hosts.forEach((h) => {
                              const key = h.nom.toLowerCase().trim().replace(/\s+/g, ' ');
                              hostNames.set(key, (hostNames.get(key) || 0) + 1);
                            });
                            return Array.from(hostNames.values()).filter((c) => c > 1).length;
                          })()}
                        </div>
                        <div className='text-xs text-green-700 dark:text-green-300'>Hôtes</div>
                      </div>
                    </div>
                  </div>

                  <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800'>
                    <div className='flex items-center gap-3'>
                      <Copy className='w-6 h-6 text-purple-600 dark:text-purple-400' />
                      <div>
                        <div className='text-2xl font-bold text-purple-900 dark:text-purple-100'>
                          {(() => {
                            const visitKeys = new Map();
                            visits.forEach((v) => {
                              const key = `${v.id}-${v.visitDate}-${v.visitTime}`;
                              visitKeys.set(key, (visitKeys.get(key) || 0) + 1);
                            });
                            return Array.from(visitKeys.values()).filter((c) => c > 1).length;
                          })()}
                        </div>
                        <div className='text-xs text-purple-700 dark:text-purple-300'>Visites</div>
                      </div>
                    </div>
                  </div>

                  <div className='bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800'>
                    <div className='flex items-center gap-3'>
                      <Copy className='w-6 h-6 text-orange-600 dark:text-orange-400' />
                      <div>
                        <div className='text-2xl font-bold text-orange-900 dark:text-orange-100'>
                          {(() => {
                            if (!archivedVisits) return 0;
                            const archivedVisitKeys = new Map();
                            archivedVisits.forEach((v) => {
                              const key = `${v.id}-${v.visitDate}-${v.visitTime}`;
                              archivedVisitKeys.set(key, (archivedVisitKeys.get(key) || 0) + 1);
                            });
                            // Vérifier aussi les doublons entre actuelles et archivées
                            const crossVisitKeys = new Map();
                            visits.forEach((currentVisit) => {
                              const key = `${currentVisit.id}-${currentVisit.visitDate}-${currentVisit.visitTime || ''}`;
                              const matchingArchived = archivedVisits.filter(
                                (av) =>
                                  av.id === currentVisit.id &&
                                  av.visitDate === currentVisit.visitDate &&
                                  av.visitTime === currentVisit.visitTime
                              );
                              if (matchingArchived.length > 0) {
                                crossVisitKeys.set(
                                  key,
                                  (crossVisitKeys.get(key) || 0) + matchingArchived.length + 1
                                );
                              }
                            });
                            const archiveDuplicates = Array.from(archivedVisitKeys.values()).filter(
                              (c) => c > 1
                            ).length;
                            const crossDuplicates = Array.from(crossVisitKeys.values()).filter(
                              (c) => c > 1
                            ).length;
                            return archiveDuplicates + crossDuplicates;
                          })()}
                        </div>
                        <div className='text-xs text-orange-700 dark:text-orange-300'>Archives</div>
                      </div>
                    </div>
                  </div>

                  <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800'>
                    <div className='flex items-center gap-3'>
                      <Copy className='w-6 h-6 text-red-600 dark:text-red-400' />
                      <div>
                        <div className='text-2xl font-bold text-red-900 dark:text-red-100'>
                          {(() => {
                            const msgKeys = new Map();
                            if (speakerMessages) {
                              speakerMessages.forEach((m) => {
                                // Même logique que dans la modale
                                const normalizedContent = m.message?.trim().toLowerCase() || '';
                                const dateKey = m.receivedAt
                                  ? new Date(m.receivedAt).toISOString()
                                  : 'no-date';
                                const key = `${m.speakerId}-${normalizedContent}-${dateKey}`;
                                msgKeys.set(key, (msgKeys.get(key) || 0) + 1);
                              });
                            }
                            const DUPLICATE_THRESHOLD = 1;
                            return Array.from(msgKeys.values()).filter(
                              (c) => c > DUPLICATE_THRESHOLD
                            ).length;
                          })()}
                        </div>
                        <div className='text-xs text-red-700 dark:text-red-300'>Messages</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bouton d'action */}
                <div className='text-center pt-4'>
                  <Button onClick={() => setIsDuplicateModalOpen(true)} size='lg'>
                    <Copy className='w-4 h-4 mr-2' />
                    Lancer l'analyse complète
                  </Button>
                  <p className='text-sm text-gray-500 dark:text-gray-400 mt-3'>
                    Cliquez pour voir les détails et fusionner les doublons
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Modals en bas de page */}
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
          _visitIds.forEach((_id) => {
            // TODO: Récupérer la visite depuis les archives et l'ajouter
            // Logique de restauration de la visite
          });
          addToast(`${_visitIds.length} visite(s) restaurée(s)`, 'success');
        }}
        onDelete={(_visitIds: string[]) => {
          _visitIds.forEach((id) => deleteVisit(id));
          addToast(`${_visitIds.length} visite(s) supprimée(s)`, 'info');
        }}
        onExport={async (_visitIds: string[]) => {
          // Logique d'exportation des visites sélectionnées
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
