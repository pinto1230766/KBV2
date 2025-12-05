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
  Key,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  RefreshCw
} from 'lucide-react';
import { CongregationProfile, Language, Theme } from '@/types';

export const Settings: React.FC = () => {
  const { congregationProfile, updateCongregationProfile, syncWithGoogleSheet } = useData();
  const { settings, updateSettings } = useSettings();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'security' | 'data' | 'ai'>('profile');
  const [profileForm, setProfileForm] = useState<CongregationProfile>(congregationProfile);
  const [isSyncing, setIsSyncing] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'data', label: 'Données', icon: Database },
    { id: 'ai', label: 'IA', icon: Key }
  ];

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

  const handleSyncGoogleSheet = async () => {
    setIsSyncing(true);
    try {
      await syncWithGoogleSheet();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Gérez les paramètres de l'application et de votre congrégation
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Tabs */}
        <div className="lg:w-64">
          <Card>
            <CardBody className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardBody>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-[600px]">
          {/* Profil Congrégation */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profil de la Congrégation
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Informations générales sur votre congrégation
                </p>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom de la congrégation
                    </label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Ex: KBV DV Lyon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ville
                    </label>
                    <Input
                      value={profileForm.city || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      placeholder="Ex: Lyon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Responsable Accueil
                    </label>
                    <Input
                      value={profileForm.hospitalityOverseer}
                      onChange={(e) => setProfileForm({ ...profileForm, hospitalityOverseer: e.target.value })}
                      placeholder="Nom du responsable"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone Responsable
                    </label>
                    <Input
                      value={profileForm.hospitalityOverseerPhone}
                      onChange={(e) => setProfileForm({ ...profileForm, hospitalityOverseerPhone: e.target.value })}
                      placeholder="+33 6 XX XX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Jour de réunion
                    </label>
                    <Select
                      value={profileForm.meetingDay || 'Samedi'}
                      onChange={(e) => setProfileForm({ ...profileForm, meetingDay: e.target.value })}
                      options={[
                        { value: 'Dimanche', label: 'Dimanche' },
                        { value: 'Lundi', label: 'Lundi' },
                        { value: 'Mardi', label: 'Mardi' },
                        { value: 'Mercredi', label: 'Mercredi' },
                        { value: 'Jeudi', label: 'Jeudi' },
                        { value: 'Vendredi', label: 'Vendredi' },
                        { value: 'Samedi', label: 'Samedi' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Heure de réunion
                    </label>
                    <Input
                      type="time"
                      value={profileForm.meetingTime || '14:30'}
                      onChange={(e) => setProfileForm({ ...profileForm, meetingTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSaveProfile}>
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Apparence
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Personnalisez l'apparence de l'application
                </p>
              </CardHeader>
              <CardBody className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Thème
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Clair', icon: Sun },
                      { value: 'dark', label: 'Sombre', icon: Moon },
                      { value: 'auto', label: 'Auto', icon: Monitor }
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
                        <theme.icon className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                        <div className="text-sm font-medium">{theme.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Langue
                  </label>
                  <Select
                    value={settings.language}
                    onChange={(e) => handleLanguageChange(e.target.value as Language)}
                    options={[
                      { value: 'fr', label: 'Français' },
                      { value: 'cv', label: 'Capverdien' },
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Español' }
                    ]}
                    className="max-w-xs"
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Gérez vos préférences de notifications
                </p>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="notifications-enabled" className="cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-white">Notifications activées</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Recevoir des rappels et alertes
                      </div>
                    </label>
                    <input
                      id="notifications-enabled"
                      type="checkbox"
                      checked={settings.notifications.enabled}
                      onChange={(e) => updateSettings({
                        ...settings,
                        notifications: { ...settings.notifications, enabled: e.target.checked }
                      })}
                      className="rounded"
                    />
                  </div>

                  {settings.notifications.enabled && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Rappels automatiques</h4>
                        <div className="space-y-3">
                          {[7, 2].map((days: number) => (
                            <div key={days} className="flex items-center justify-between">
                              <label htmlFor={`reminder-${days}`} className="cursor-pointer">
                                <div className="font-medium text-gray-900 dark:text-white">J-{days}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Rappel {days} jour{days > 1 ? 's' : ''} avant la visite
                                </div>
                              </label>
                              <input
                                id={`reminder-${days}`}
                                type="checkbox"
                                checked={settings.notifications.reminderDays.includes(days)}
                                onChange={(e) => {
                                  const newDays = e.target.checked
                                    ? [...settings.notifications.reminderDays, days]
                                    : settings.notifications.reminderDays.filter(d => d !== days);
                                  updateSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, reminderDays: newDays }
                                  });
                                }}
                                className="rounded"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Options</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label htmlFor="sound-enabled" className="cursor-pointer">
                              <div className="font-medium text-gray-900 dark:text-white">Son</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Jouer un son pour les notifications</div>
                            </label>
                            <input
                              id="sound-enabled"
                              type="checkbox"
                              checked={settings.notifications.sound}
                              onChange={(e) => updateSettings({
                                ...settings,
                                notifications: { ...settings.notifications, sound: e.target.checked }
                              })}
                              className="rounded"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <label htmlFor="vibration-enabled" className="cursor-pointer">
                              <div className="font-medium text-gray-900 dark:text-white">Vibration</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Faire vibrer l'appareil</div>
                            </label>
                            <input
                              id="vibration-enabled"
                              type="checkbox"
                              checked={settings.notifications.vibration}
                              onChange={(e) => updateSettings({
                                ...settings,
                                notifications: { ...settings.notifications, vibration: e.target.checked }
                              })}
                              className="rounded"
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Sécurité
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Gérez la sécurité et le chiffrement des données
                </p>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="encryption-enabled" className="cursor-pointer">
                      <div className="font-medium text-gray-900 dark:text-white">Chiffrement activé</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Protéger les données sensibles avec un chiffrement AES-GCM
                      </div>
                    </label>
                    <input
                      id="encryption-enabled"
                      type="checkbox"
                      checked={settings.encryptionEnabled}
                      onChange={(e) => updateSettings({
                        ...settings,
                        encryptionEnabled: e.target.checked
                      })}
                      className="rounded"
                    />
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timeout de session (minutes)
                    </label>
                    <Select
                      value={settings.sessionTimeout?.toString() || '30'}
                      onChange={(e) => updateSettings({
                        ...settings,
                        sessionTimeout: parseInt(e.target.value)
                      })}
                      options={[
                        { value: '15', label: '15 minutes' },
                        { value: '30', label: '30 minutes' },
                        { value: '60', label: '1 heure' },
                        { value: '120', label: '2 heures' }
                      ]}
                      className="max-w-xs"
                    />
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Version 1.10.0
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Données */}
          {activeTab === 'data' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Synchronisation des Données
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Synchroniser les visites depuis Google Sheets
                </p>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Synchronisation Google Sheets</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                      Cette fonction récupère automatiquement les visites programmées depuis votre Google Sheet et met à jour l'application. 
                      Les orateurs et visites existants seront fusionnés intelligemment.
                    </p>
                    <Button 
                      leftIcon={<RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />}
                      onClick={handleSyncGoogleSheet}
                      disabled={isSyncing}
                    >
                      {isSyncing ? 'Synchronisation en cours...' : 'Synchroniser maintenant'}
                    </Button>
                  </div>

                  {localStorage.getItem('lastGoogleSheetSync') && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Dernière synchronisation :{' '}
                        <span className="font-medium">
                          {new Date(localStorage.getItem('lastGoogleSheetSync')!).toLocaleString('fr-FR')}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}


          {/* IA */}
          {activeTab === 'ai' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration IA
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Paramètres de l'assistant IA Gemini pour la génération de messages
                </p>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Section 1: Activation */}
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <label htmlFor="ai-enabled" className="cursor-pointer">
                    <div className="font-medium text-blue-900 dark:text-blue-300">Assistant IA activé</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">
                      Utiliser Gemini pour générer des messages personnalisés
                    </div>
                  </label>
                  <input
                    id="ai-enabled"
                    type="checkbox"
                    checked={settings.aiSettings.enabled}
                    onChange={(e) => updateSettings({
                      ...settings,
                      aiSettings: { ...settings.aiSettings, enabled: e.target.checked }
                    })}
                    className="rounded"
                  />
                </div>

                {settings.aiSettings.enabled && (
                  <>
                    {/* Section 2: Configuration API */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Connexion API</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Clé API Gemini
                        </label>
                        <Input
                          type="password"
                          value={settings.aiSettings.apiKey || ''}
                          onChange={(e) => updateSettings({
                            ...settings,
                            aiSettings: { ...settings.aiSettings, apiKey: e.target.value }
                          })}
                          placeholder="AIza..."
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Obtenez votre clé sur{' '}
                          <a 
                            href="https://makersuite.google.com/app/apikey" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            Google AI Studio
                          </a>
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Modèle
                        </label>
                        <Select
                          value={settings.aiSettings.model}
                          onChange={(e) => updateSettings({
                            ...settings,
                            aiSettings: { ...settings.aiSettings, model: e.target.value }
                          })}
                          options={[
                            { value: 'gemini-pro', label: 'Gemini Pro (Recommandé)' },
                            { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
                            { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Rapide)' }
                          ]}
                          className="max-w-xs"
                        />
                      </div>
                    </div>

                    {/* Section 3: Paramètres de génération */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Paramètres de génération</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Créativité (Température): {settings.aiSettings.temperature.toFixed(1)}
                        </label>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500">Précis</span>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.aiSettings.temperature}
                            onChange={(e) => updateSettings({
                              ...settings,
                              aiSettings: { ...settings.aiSettings, temperature: parseFloat(e.target.value) }
                            })}
                            className="flex-1"
                          />
                          <span className="text-xs text-gray-500">Créatif</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Valeur recommandée: 0.7 pour un équilibre entre précision et créativité
                        </p>
                      </div>
                    </div>

                    {/* Section 4: Informations */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">💡 Conseils d'utilisation</h4>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                          <li>Gemini Pro est recommandé pour la plupart des usages</li>
                          <li>Gemini 1.5 Flash est plus rapide mais moins précis</li>
                          <li>Une température de 0.7 offre un bon équilibre</li>
                          <li>Votre clé API est stockée de manière sécurisée</li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          )}


        </div>
      </div>
    </div>
  );
};
