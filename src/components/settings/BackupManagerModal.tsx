import React, { useState, useEffect } from 'react';
import {
  Save,
  Download,
  Upload,
  Clock,
  HardDrive,
  Shield,
  CheckCircle,
  AlertTriangle,
  Trash2,
  FolderOpen,
  Share2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { useToast } from '@/contexts/ToastContext';
import { fileSystemService } from '@/utils/FileSystemService';

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
  const [backupHistory, setBackupHistory] = useState<BackupHistory[]>([]);
  const [kbvFolderPath, setKbvFolderPath] = useState<string>('Documents/KBV');
  const [savedFiles, setSavedFiles] = useState<string[]>([]);
  const { addToast } = useToast();

  // Charger l'historique des sauvegardes et le chemin du dossier
  useEffect(() => {
    const loadBackupHistory = async () => {
      try {
        const stored = localStorage.getItem('kbv_backup_history');
        if (stored) {
          const history = JSON.parse(stored);
          setBackupHistory(history);
        }

        // Obtenir le chemin du dossier KBV
        const path = await fileSystemService.getKBVFolderPath();
        setKbvFolderPath(path);

        // Lister les fichiers dans le dossier KBV
        const files = await fileSystemService.listKBVFiles();
        setSavedFiles(files.filter(f => f.endsWith('.json')));
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique:", error);
      }
    };

    if (isOpen) {
      loadBackupHistory();
    }
  }, [isOpen]);

  // Sauvegarder l'historique dans localStorage
  const saveBackupHistory = (history: BackupHistory[]) => {
    try {
      localStorage.setItem('kbv_backup_history', JSON.stringify(history));
      setBackupHistory(history);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'historique:", error);
    }
  };

  const handleCreateBackup = async () => {
    if (encrypt && password !== confirmPassword) {
      addToast('Les mots de passe ne correspondent pas', 'error');
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

      // Créer la sauvegarde
      await onBackup(options);

      // Ajouter à l'historique
      const newBackup: BackupHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        size: 0,
        itemsCount: 0,
        encrypted: encrypt,
      };

      const updatedHistory = [newBackup, ...backupHistory].slice(0, 10);
      saveBackupHistory(updatedHistory);

      addToast(`Sauvegarde créée dans ${kbvFolderPath}`, 'success');

      setPassword('');
      setConfirmPassword('');
      setIsCreating(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      addToast('Erreur lors de la création de la sauvegarde', 'error');
      setIsCreating(false);
    }
  };

  // Télécharger une sauvegarde depuis l'historique
  const handleDownloadFromHistory = async (backup: BackupHistory) => {
    try {
      // Essayer de récupérer la sauvegarde depuis localStorage
      const backupData = localStorage.getItem(`backup_${backup.id}`);

      if (backupData) {
        // Si on a les données en cache, les télécharger directement
        const blob = new Blob([backupData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kbv-backup-${new Date(backup.date).toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addToast('Sauvegarde téléchargée', 'success');
      } else {
        // Sinon, recréer la sauvegarde
        addToast('Recréation de la sauvegarde...', 'info');
        await handleCreateBackup();
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      addToast('Erreur lors du téléchargement de la sauvegarde', 'error');
    }
  };

  // Partager un fichier de sauvegarde
  const handleShareBackup = async (filename: string) => {
    try {
      await fileSystemService.shareFile(filename, 'Partager la sauvegarde KBV');
      addToast('Fichier partagé', 'success');
    } catch (error) {
      console.error('Erreur partage:', error);
      addToast('Erreur lors du partage', 'error');
    }
  };

  // Supprimer une sauvegarde de l'historique
  const handleDeleteBackup = (backupId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette sauvegarde de l'historique ?")) {
      try {
        const updatedHistory = backupHistory.filter((b) => b.id !== backupId);
        saveBackupHistory(updatedHistory);
        localStorage.removeItem(`backup_${backupId}`);
        addToast("Sauvegarde supprimée de l'historique", 'success');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        addToast('Erreur lors de la suppression', 'error');
      }
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
                <FolderOpen className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
                <div className='text-sm text-blue-800 dark:text-blue-300'>
                  <strong>Emplacement de sauvegarde :</strong> Les fichiers seront enregistrés dans<br/>
                  <code className='bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs font-mono mt-1 inline-block'>
                    {kbvFolderPath}
                  </code>
                  <p className='mt-2'>Vous pourrez les retrouver facilement dans l'application Fichiers de votre tablette.</p>
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

            <div className='space-y-3'>
              <Button
                variant='primary'
                onClick={handleCreateBackup}
                disabled={isCreating || (encrypt && (!password || password !== confirmPassword))}
                className='w-full'
              >
                <Save className='w-4 h-4 mr-2' />
                {isCreating ? 'Création en cours...' : 'Créer la sauvegarde'}
              </Button>
              <p className='text-xs text-center text-gray-500'>
                Le fichier sera enregistré dans Documents/KBV/
              </p>
            </div>
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
            {/* Fichiers sauvegardés dans Documents/KBV */}
            {savedFiles.length > 0 && (
              <div className='mb-6'>
                <div className='flex items-center gap-2 mb-3'>
                  <FolderOpen className='w-4 h-4 text-primary-600' />
                  <h4 className='font-semibold text-gray-900 dark:text-white'>
                    Sauvegardes dans {kbvFolderPath}
                  </h4>
                </div>
                <div className='space-y-2'>
                  {savedFiles.map((filename) => (
                    <Card key={filename} className='bg-green-50 dark:bg-green-900/10'>
                      <CardBody>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-4'>
                            <div className='p-3 bg-green-100 dark:bg-green-900 rounded-lg'>
                              <Save className='w-6 h-6 text-green-600' />
                            </div>
                            <div>
                              <div className='font-medium text-gray-900 dark:text-white'>
                                {filename}
                              </div>
                              <div className='text-xs text-gray-600 dark:text-gray-400'>
                                Sauvegardé dans Documents/KBV
                              </div>
                            </div>
                          </div>
                          <div className='flex gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleShareBackup(filename)}
                              title='Partager cette sauvegarde'
                            >
                              <Share2 className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={async () => {
                                if (confirm('Supprimer ce fichier ?')) {
                                  try {
                                    await fileSystemService.deleteFromDocuments(filename);
                                    setSavedFiles(savedFiles.filter(f => f !== filename));
                                    addToast('Fichier supprimé', 'success');
                                  } catch (error) {
                                    addToast('Erreur lors de la suppression', 'error');
                                  }
                                }
                              }}
                              title='Supprimer'
                              className='text-red-600 hover:text-red-700 hover:border-red-300'
                            >
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Historique local */}
            {backupHistory.length === 0 && savedFiles.length === 0 ? (
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
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDownloadFromHistory(backup)}
                          title='Télécharger cette sauvegarde'
                        >
                          <Download className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDeleteBackup(backup.id)}
                          title="Supprimer de l'historique"
                          className='text-red-600 hover:text-red-700 hover:border-red-300'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
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
