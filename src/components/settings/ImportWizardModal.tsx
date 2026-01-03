import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, Download } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { ImportResult } from '@/types';

interface ImportWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any, mapping: ColumnMapping) => Promise<ImportResult>;
}

interface ColumnMapping {
  [key: string]: string; // clé = colonne source, valeur = champ cible
}

type ImportStep = 'upload' | 'mapping' | 'preview' | 'import' | 'result';

const AVAILABLE_FIELDS = {
  speakers: [
    { key: 'nom', label: 'Nom', required: true },
    { key: 'congregation', label: 'Congrégation', required: true },
    { key: 'telephone', label: 'Téléphone', required: false },
    { key: 'email', label: 'Email', required: false },
    { key: 'gender', label: 'Genre (male/female/couple)', required: false },
  ],
  visits: [
    { key: 'nom', label: 'Nom orateur', required: true },
    { key: 'visitDate', label: 'Date (YYYY-MM-DD)', required: true },
    { key: 'visitTime', label: 'Heure (HH:MM)', required: true },
    { key: 'talkNoOrType', label: 'N° discours', required: false },
    { key: 'talkTheme', label: 'Thème discours', required: false },
    { key: 'host', label: 'Hôte', required: false },
    { key: 'status', label: 'Statut', required: false },
  ],
  hosts: [
    { key: 'nom', label: 'Nom', required: true },
    { key: 'telephone', label: 'Téléphone', required: false },
    { key: 'email', label: 'Email', required: false },
    { key: 'address', label: 'Adresse', required: false },
    { key: 'gender', label: 'Genre (male/female/couple)', required: false },
  ],
};

export const ImportWizardModal: React.FC<ImportWizardModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [importType, setImportType] = useState<'speakers' | 'visits' | 'hosts'>('speakers');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Parser le fichier CSV
    const text = await selectedFile.text();
    const lines = text.split('\n').filter((line) => line.trim());

    if (lines.length === 0) return;

    // Extraire les colonnes (première ligne)
    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    setColumns(headers);

    // Parser les données
    const data = lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    setParsedData(data);
    setCurrentStep('mapping');
  };

  const handleMappingChange = (sourceColumn: string, targetField: string) => {
    setMapping((prev) => ({
      ...prev,
      [sourceColumn]: targetField,
    }));
  };

  const handleImport = async () => {
    setCurrentStep('import');

    try {
      // Transformer les données selon le mapping
      const transformedData = parsedData.map((row) => {
        const transformed: any = {};
        Object.entries(mapping).forEach(([sourceCol, targetField]) => {
          if (targetField && row[sourceCol]) {
            transformed[targetField] = row[sourceCol];
          }
        });
        return transformed;
      });

      const result = await onImport(transformedData, mapping);
      setImportResult(result);
      setCurrentStep('result');
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
    }
  };

  const getMappingProgress = () => {
    const requiredFields = AVAILABLE_FIELDS[importType].filter((f) => f.required);
    const mappedRequired = requiredFields.filter((f) => Object.values(mapping).includes(f.key));
    return `${mappedRequired.length}/${requiredFields.length}`;
  };

  const canProceed = () => {
    const requiredFields = AVAILABLE_FIELDS[importType].filter((f) => f.required);
    return requiredFields.every((f) => Object.values(mapping).includes(f.key));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assistant d'importation" size='xl' className='max-h-[90vh] overflow-hidden'>
      <div className='space-y-6 max-h-[calc(90vh-8rem)] overflow-y-auto'>
        {/* Indicateur de progression */}
        <div className='flex items-center justify-between'>
          {['upload', 'mapping', 'preview', 'import', 'result'].map((step, index) => (
            <React.Fragment key={step}>
              <div
                className={`flex items-center gap-2 ${
                  currentStep === step
                    ? 'text-primary-600'
                    : ['upload', 'mapping', 'preview'].indexOf(currentStep) > index
                      ? 'text-green-600'
                      : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    currentStep === step
                      ? 'bg-primary-100 dark:bg-primary-900/20'
                      : ['upload', 'mapping', 'preview'].indexOf(currentStep) > index
                        ? 'bg-green-100 dark:bg-green-900/20'
                        : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {index + 1}
                </div>
                <span className='text-sm font-medium hidden md:inline'>
                  {step === 'upload' && 'Fichier'}
                  {step === 'mapping' && 'Mapping'}
                  {step === 'preview' && 'Aperçu'}
                  {step === 'import' && 'Import'}
                  {step === 'result' && 'Résultat'}
                </span>
              </div>
              {index < 4 && <ArrowRight className='w-4 h-4 text-gray-400' />}
            </React.Fragment>
          ))}
        </div>

        {/* Étape 1: Upload */}
        {currentStep === 'upload' && (
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                Type de données à importer
              </label>
              <div className='grid grid-cols-3 gap-3'>
                {[
                  { value: 'speakers' as const, label: 'Orateurs', icon: '👤' },
                  { value: 'visits' as const, label: 'Visites', icon: '📅' },
                  { value: 'hosts' as const, label: 'Hôtes', icon: '🏠' },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setImportType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      importType === type.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className='text-3xl mb-2'>{type.icon}</div>
                    <div className='font-medium text-gray-900 dark:text-white'>{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12'>
              <div className='text-center'>
                <Upload className='w-16 h-16 mx-auto mb-4 text-gray-400' />
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                  Sélectionner un fichier CSV
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                  Fichier CSV avec en-têtes de colonnes
                </p>
                <input
                  type='file'
                  accept='.csv'
                  onChange={handleFileSelect}
                  className='hidden'
                  id='csv-file'
                />
                <label htmlFor='csv-file'>
                  <span className='inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg cursor-pointer transition-colors'>
                    <Upload className='w-4 h-4 mr-2' />
                    Parcourir
                  </span>
                </label>
              </div>
            </div>

            <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
              <div className='flex items-start gap-3'>
                <FileText className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
                <div className='text-sm text-blue-800 dark:text-blue-300'>
                  <strong>Format attendu :</strong> Fichier CSV avec la première ligne contenant les
                  noms de colonnes. Les colonnes seront mappées à l'étape suivante.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Étape 2: Mapping */}
        {currentStep === 'mapping' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
              <div>
                <h4 className='font-medium text-gray-900 dark:text-white'>{file?.name}</h4>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {parsedData.length} ligne(s) détectée(s)
                </p>
              </div>
              <Badge variant='default'>Champs requis : {getMappingProgress()}</Badge>
            </div>

            <div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-3'>
                Mapper les colonnes
              </h4>
              <div className='space-y-3'>
                {columns.map((column) => (
                  <div key={column} className='flex items-center gap-3'>
                    <div className='flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                      <span className='text-sm font-medium text-gray-900 dark:text-white'>
                        {column}
                      </span>
                    </div>
                    <ArrowRight className='w-4 h-4 text-gray-400' />
                    <select
                      value={mapping[column] || ''}
                      onChange={(e) => handleMappingChange(column, e.target.value)}
                      aria-label={`Mapper la colonne ${column}`}
                      className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    >
                      <option value=''>-- Ignorer --</option>
                      {AVAILABLE_FIELDS[importType].map((field) => (
                        <option key={field.key} value={field.key}>
                          {field.label} {field.required && '*'}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex gap-3 justify-end'>
              <Button variant='secondary' onClick={() => setCurrentStep('upload')}>
                Retour
              </Button>
              <Button
                variant='primary'
                onClick={() => setCurrentStep('preview')}
                disabled={!canProceed()}
              >
                Aperçu
                <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 3: Aperçu */}
        {currentStep === 'preview' && (
          <div className='space-y-6'>
            <div className='p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
              <div className='flex items-center gap-2 mb-2'>
                <CheckCircle className='w-5 h-5 text-green-600' />
                <span className='font-medium text-green-900 dark:text-green-200'>
                  Prêt à importer
                </span>
              </div>
              <p className='text-sm text-green-800 dark:text-green-300'>
                {parsedData.length}{' '}
                {importType === 'speakers'
                  ? 'orateur(s)'
                  : importType === 'visits'
                    ? 'visite(s)'
                    : 'hôte(s)'}{' '}
                seront importé(s)
              </p>
            </div>

            <div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-3'>
                Aperçu des données (5 premières lignes)
              </h4>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead className='bg-gray-50 dark:bg-gray-800'>
                    <tr>
                      {AVAILABLE_FIELDS[importType]
                        .filter((f) => Object.values(mapping).includes(f.key))
                        .map((field) => (
                          <th
                            key={field.key}
                            className='px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300'
                          >
                            {field.label}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 5).map((row, index) => (
                      <tr key={index} className='border-t border-gray-200 dark:border-gray-700'>
                        {AVAILABLE_FIELDS[importType]
                          .filter((f) => Object.values(mapping).includes(f.key))
                          .map((field) => {
                            const sourceCol = Object.keys(mapping).find(
                              (k) => mapping[k] === field.key
                            );
                            return (
                              <td
                                key={field.key}
                                className='px-4 py-2 text-gray-900 dark:text-white'
                              >
                                {sourceCol ? row[sourceCol] : '-'}
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='flex gap-3 justify-end'>
              <Button variant='secondary' onClick={() => setCurrentStep('mapping')}>
                Retour
              </Button>
              <Button variant='primary' onClick={handleImport}>
                <Download className='w-4 h-4 mr-2' />
                Lancer l'importation
              </Button>
            </div>
          </div>
        )}

        {/* Étape 4: Import en cours */}
        {currentStep === 'import' && (
          <div className='py-12 text-center'>
            <div className='w-16 h-16 mx-auto mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin'></div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              Importation en cours...
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Veuillez patienter pendant le traitement des données
            </p>
          </div>
        )}

        {/* Étape 5: Résultat */}
        {currentStep === 'result' && importResult && (
          <div className='space-y-6'>
            <div className='text-center py-8'>
              <CheckCircle className='w-20 h-20 mx-auto mb-4 text-green-500' />
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                Importation terminée !
              </h3>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <Card>
                <CardBody className='text-center'>
                  <div className='text-3xl font-bold text-green-600'>
                    {importResult.speakersAdded +
                      importResult.visitsAdded +
                      importResult.hostsAdded}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Ajouté(s)</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody className='text-center'>
                  <div className='text-3xl font-bold text-blue-600'>
                    {importResult.speakersUpdated +
                      importResult.visitsUpdated +
                      importResult.hostsUpdated}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Mis à jour</div>
                </CardBody>
              </Card>
            </div>

            {importResult.errors.length > 0 && (
              <div className='p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg'>
                <div className='flex items-start gap-3'>
                  <AlertTriangle className='w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5' />
                  <div>
                    <h4 className='font-medium text-orange-900 dark:text-orange-200 mb-2'>
                      {importResult.errors.length} erreur(s) détectée(s)
                    </h4>
                    <ul className='text-sm text-orange-800 dark:text-orange-300 space-y-1'>
                      {importResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className='flex gap-3 justify-end'>
              <Button variant='primary' onClick={onClose}>
                Terminer
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
