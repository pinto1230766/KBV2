import React, { useState } from 'react';
import {
  Save,
  Download,
  Upload,
  Clock,
  HardDrive,
  Shield,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';

interface BackupManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackup: (options: BackupOptions) => Promise<void>;
  onRestore: (file: File) => Promise<void>;
}

interface BackupOptions {
  includeArchived: boolean;
  includeSettings: boolean;
  includeTemplates: boolean;
  encrypt: boolean;
  password?: string;
}

interface BackupHistory {
  id: string;
  date: string;
  size: number;
  itemsCount: number;
  encrypted: boolean;
}

export const BackupManagerModal: React.FC<BackupManagerModalProps> = ({
  isOpen,
  onClose,
  onBackup,
  onRestore,
}) => {
  const [activeTab, setActiveTab] = useState<'backup' | 'restore' | 'history'>('backup');
  const [includeArchived, setIncludeArchived] = useState(true);
  const [includeSettings, setIncludeSettings] = useState(true);
  const [includeTemplates, setIncludeTemplates] = useState(true);
  const [encrypt, setEncrypt] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Simuler l'historique des sauvegardes (à remplacer par les vraies données)
  const backupHistory: BackupHistory[] = [
    {
      id: '1',
      date: new Date().toISOString(),
      size: 2048576,
      itemsCount: 150,
      encrypted: true,
    },
  ];

  const handleCreateBackup = async () => {
    if (encrypt && password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    setIsCreating(true);
    try {
      const options: BackupOptions = {
        includeArchived,
        includeSettings,
        includeTemplates,
        encrypt,
        password: encrypt ? password : undefined,
      };

      await onBackup(options);

      // Réinitialiser le formulaire
      setPassword('');
      setConfirmPassword('');
      setIsCreating(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setIsCreating(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) return;

    if (
      confirm(
        '⚠️ La restauration remplacera toutes les données actuelles. Êtes-vous sûr de vouloir continuer ?'
      )
    ) {
      try {
        await onRestore(selectedFile);
        onClose();
      } catch (error) {
        console.error('Erreur lors de la restauration:', error);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Gestion des sauvegardes' size='lg'>
      <div className='space-y-6'>
        {/* Onglets */}
        <div className='flex gap-2 border-b border-gray-200 dark:border-gray-700'>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'backup'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Save className='w-4 h-4 inline mr-2' />
            Créer une sauvegarde
          </button>
          <button
            onClick={() => setActiveTab('restore')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'restore'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Upload className='w-4 h-4 inline mr-2' />
            Restaurer
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Clock className='w-4 h-4 inline mr-2' />
            Historique
          </button>
        </div>

        {/* Contenu - Créer une sauvegarde */}
        {activeTab === 'backup' && (
          <div className='space-y-6'>
            <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
              <div className='flex items-start gap-3'>
                <HardDrive className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
                <div className='text-sm text-blue-800 dark:text-blue-300'>
                  <strong>Sauvegarde locale :</strong> Les données seront exportées dans un fichier
                  JSON téléchargeable. Conservez ce fichier en lieu sûr pour pouvoir restaurer vos
                  données en cas de besoin.
                </div>
              </div>
            </div>

            {/* Options de sauvegarde */}
            <div className='space-y-3'>
              <h4 className='font-medium text-gray-900 dark:text-white'>Données à inclure</h4>

              <label className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer'>
                <input
                  type='checkbox'
                  checked={includeArchived}
                  onChange={(e) => setIncludeArchived(e.target.checked)}
                  className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                />
                <div className='flex-1'>
                  <span className='text-sm font-medium text-gray-900 dark:text-white'>
                    Visites archivées
                  </span>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Inclure l'historique complet des visites passées
                  </p>
                </div>
              </label>

              <label className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer'>
                <input
                  type='checkbox'
                  checked={includeSettings}
                  onChange={(e) => setIncludeSettings(e.target.checked)}
                  className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                />
                <div className='flex-1'>
                  <span className='text-sm font-medium text-gray-900 dark:text-white'>
                    Paramètres de l'application
                  </span>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Thème, langue, notifications, etc.
                  </p>
                </div>
              </label>

              <label className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer'>
                <input
                  type='checkbox'
                  checked={includeTemplates}
                  onChange={(e) => setIncludeTemplates(e.target.checked)}
                  className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                />
                <div className='flex-1'>
                  <span className='text-sm font-medium text-gray-900 dark:text-white'>
                    Templates personnalisés
                  </span>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Modèles de messages et configurations personnalisées
                  </p>
                </div>
              </label>
            </div>

            {/* Chiffrement */}
            <div className='space-y-3'>
              <label className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer'>
                <input
                  type='checkbox'
                  checked={encrypt}
                  onChange={(e) => setEncrypt(e.target.checked)}
                  className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                />
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <Shield className='w-4 h-4 text-primary-600' />
                    <span className='text-sm font-medium text-gray-900 dark:text-white'>
                      Chiffrer la sauvegarde
                    </span>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    Protéger les données sensibles avec un mot de passe
                  </p>
                </div>
              </label>

              {encrypt && (
                <div className='space-y-3 pl-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Mot de passe
                    </label>
                    <input
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      placeholder='Entrez un mot de passe'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Confirmer le mot de passe
                    </label>
                    <input
                      type='password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      placeholder='Confirmez le mot de passe'
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              variant='primary'
              onClick={handleCreateBackup}
              disabled={isCreating || (encrypt && (!password || password !== confirmPassword))}
              className='w-full'
            >
              <Download className='w-4 h-4 mr-2' />
              {isCreating ? 'Création en cours...' : 'Créer et télécharger la sauvegarde'}
            </Button>
          </div>
        )}

        {/* Contenu - Restaurer */}
        {activeTab === 'restore' && (
          <div className='space-y-6'>
            <div className='p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg'>
              <div className='flex items-start gap-3'>
                <AlertTriangle className='w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5' />
                <div className='text-sm text-orange-800 dark:text-orange-300'>
                  <strong>Attention :</strong> La restauration remplacera toutes les données
                  actuelles. Assurez-vous d'avoir créé une sauvegarde récente avant de continuer.
                </div>
              </div>
            </div>

            <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8'>
              <div className='text-center'>
                <Upload className='w-12 h-12 mx-auto mb-4 text-gray-400' />
                <h4 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                  Sélectionner un fichier de sauvegarde
                </h4>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                  Fichier JSON (.json) exporté précédemment
                </p>
                <input
                  type='file'
                  accept='.json'
                  onChange={handleFileSelect}
                  className='hidden'
                  id='backup-file'
                />
                <label htmlFor='backup-file'>
                  <span className='inline-flex items-center justify-center px-4 py-2 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg cursor-pointer transition-colors'>
                    Parcourir
                  </span>
                </label>
              </div>
            </div>

            {selectedFile && (
              <div className='p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <CheckCircle className='w-5 h-5 text-green-600' />
                    <div>
                      <div className='font-medium text-green-900 dark:text-green-200'>
                        {selectedFile.name}
                      </div>
                      <div className='text-sm text-green-800 dark:text-green-300'>
                        {formatFileSize(selectedFile.size)}
                      </div>
                    </div>
                  </div>
                  <Button variant='danger' onClick={handleRestore}>
                    Restaurer
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contenu - Historique */}
        {activeTab === 'history' && (
          <div className='space-y-4'>
            {backupHistory.length === 0 ? (
              <div className='text-center py-12'>
                <Clock className='w-16 h-16 mx-auto mb-4 text-gray-400' />
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  Aucune sauvegarde
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  Créez votre première sauvegarde pour sécuriser vos données
                </p>
              </div>
            ) : (
              backupHistory.map((backup) => (
                <Card key={backup.id}>
                  <CardBody>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='p-3 bg-primary-100 dark:bg-primary-900 rounded-lg'>
                          <HardDrive className='w-6 h-6 text-primary-600' />
                        </div>
                        <div>
                          <div className='font-medium text-gray-900 dark:text-white'>
                            {new Date(backup.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <div className='text-sm text-gray-600 dark:text-gray-400'>
                            {backup.itemsCount} éléments • {formatFileSize(backup.size)}
                            {backup.encrypted && (
                              <Badge variant='default' className='ml-2'>
                                <Shield className='w-3 h-3 mr-1' />
                                Chiffré
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant='outline' size='sm'>
                        <Download className='w-4 h-4' />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Actions */}
        <div className='flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button variant='secondary' onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
