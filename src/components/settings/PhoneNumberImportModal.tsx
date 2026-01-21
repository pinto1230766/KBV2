import React, { useState } from 'react';
import { X, Upload, Phone, Users, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Speaker } from '@/types';
import { processPhoneNumberUpdate } from '@/utils/phoneNumberUpdater';

interface PhoneNumberImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImportResult {
  speakersUpdated: number;
  hostsUpdated: number;
  speakerDetails: string[];
  hostDetails: string[];
  errors: string[];
}

export function PhoneNumberImportModal({ isOpen, onClose }: PhoneNumberImportModalProps) {
  const { speakers, hosts, updateSpeaker, updateHost } = useData();
  const [importData, setImportData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
        setShowPreview(true);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) return;

    setIsLoading(true);
    try {
      const jsonData = JSON.parse(importData);

      // Utiliser la fonction de traitement
      const { updatedSpeakers, updatedHosts, report } = processPhoneNumberUpdate(jsonData, {
        speakers,
        hosts,
      });

      // Appliquer les mises à jour via le DataContext - CORRECTION: comparer par ID et par téléphone manquant
      const speakerUpdates: Speaker[] = [];

      // Trouver les orateurs qui ont besoin d'être mis à jour
      speakers.forEach((existingSpeaker) => {
        const updatedSpeaker = updatedSpeakers.find((us) => us.id === existingSpeaker.id);
        if (
          updatedSpeaker &&
          (!existingSpeaker.telephone || existingSpeaker.telephone.trim() === '') &&
          updatedSpeaker.telephone &&
          updatedSpeaker.telephone.trim() !== ''
        ) {
          speakerUpdates.push(updatedSpeaker);
        }
      });

      // Trouver les hôtes qui ont besoin d'être mis à jour
      const hostUpdates = hosts.filter((existingHost) => {
        const updatedHost = updatedHosts.find((uh) => uh.nom === existingHost.nom);
        return (
          updatedHost &&
          (!existingHost.telephone || existingHost.telephone.trim() === '') &&
          updatedHost.telephone &&
          updatedHost.telephone.trim() !== ''
        );
      });

      console.log('🔄 Mise à jour des orateurs:', speakerUpdates.length);
      console.log('🔄 Mise à jour des hôtes:', hostUpdates.length);

      // Mettre à jour les orateurs UN PAR UN pour forcer la réactualisation
      for (const updatedSpeaker of speakerUpdates) {
        console.log(`📱 Mise à jour orateur: ${updatedSpeaker.nom} -> ${updatedSpeaker.telephone}`);
        updateSpeaker(updatedSpeaker);
        // Petit délai pour laisser le temps au state de se mettre à jour
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Mettre à jour les hôtes UN PAR UN
      for (const updatedHost of hostUpdates) {
        console.log(`🏠 Mise à jour hôte: ${updatedHost.nom} -> ${updatedHost.telephone}`);
        updateHost(updatedHost.nom, { telephone: updatedHost.telephone });
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Forcer une réactualisation des données après un court délai
      setTimeout(() => {
        // Utiliser un dispatch d'événement pour notifier les composants
        window.dispatchEvent(
          new CustomEvent('phoneNumbersUpdated', {
            detail: {
              speakersUpdated: speakerUpdates.length,
              hostsUpdated: hostUpdates.length,
            },
          })
        );
      }, 100);

      setResult({
        speakersUpdated: report.speakersUpdated,
        hostsUpdated: report.hostsUpdated,
        speakerDetails: report.speakerDetails,
        hostDetails: report.hostDetails,
        errors: [],
      });
    } catch (error) {
      setResult({
        speakersUpdated: 0,
        hostsUpdated: 0,
        speakerDetails: [],
        hostDetails: [],
        errors: [error instanceof Error ? error.message : 'Erreur lors du parsing JSON'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setImportData('');
    setResult(null);
    setShowPreview(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <div className='flex items-center space-x-3'>
            <Phone className='h-6 w-6 text-blue-600' />
            <h2 className='text-xl font-semibold text-gray-900'>Import des Numéros de Téléphone</h2>
          </div>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
            aria-label='Fermer'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
          {!result ? (
            <div className='space-y-6'>
              {/* Instructions */}
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <h3 className='font-medium text-blue-900 mb-2'>📋 Instructions</h3>
                <ul className='text-sm text-blue-800 space-y-1'>
                  <li>
                    • Sélectionnez un fichier JSON contenant les orateurs et hôtes avec leurs
                    numéros
                  </li>
                  <li>• Le fichier doit contenir les champs "speakers", "visits" et/ou "hosts"</li>
                  <li>• Seuls les numéros manquants seront ajoutés (pas de remplacement)</li>
                  <li>• Un rapport détaillé des modifications sera affiché</li>
                </ul>
              </div>

              {/* File Upload */}
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Sélectionner un fichier JSON
                  </label>
                  <div className='flex items-center space-x-4'>
                    <input
                      type='file'
                      accept='.json'
                      onChange={handleFileUpload}
                      title='Sélectionner un fichier JSON contenant les numéros de téléphone'
                      className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                    />
                    <Upload className='h-5 w-5 text-gray-400' aria-hidden='true' />
                  </div>
                </div>

                {/* Manual Input */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Ou coller le contenu JSON
                  </label>
                  <textarea
                    value={importData}
                    onChange={(e) => {
                      setImportData(e.target.value);
                      setShowPreview(e.target.value.trim().length > 0);
                    }}
                    placeholder='Collez ici le contenu JSON avec les numéros de téléphone...'
                    className='w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm'
                  />
                </div>

                {/* Preview */}
                {showPreview && importData.trim() && (
                  <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                    <h4 className='font-medium text-gray-900 mb-2'>👁️ Aperçu des données</h4>
                    <div className='text-sm text-gray-600'>
                      {(() => {
                        try {
                          const parsed = JSON.parse(importData);
                          const speakerCount =
                            parsed.speakers?.filter((s: any) => s.telephone?.trim()).length || 0;
                          const visitCount =
                            parsed.visits?.filter((v: any) => v.telephone?.trim()).length || 0;
                          const hostCount =
                            parsed.hosts?.filter((h: any) => h.telephone?.trim()).length || 0;

                          return (
                            <div className='space-y-2'>
                              <div className='flex items-center space-x-2'>
                                <Users className='h-4 w-4' />
                                <span>Orateurs avec numéros: {speakerCount}</span>
                              </div>
                              <div className='flex items-center space-x-2'>
                                <MapPin className='h-4 w-4' />
                                <span>Visites avec numéros: {visitCount}</span>
                              </div>
                              <div className='flex items-center space-x-2'>
                                <Phone className='h-4 w-4' />
                                <span>Hôtes avec numéros: {hostCount}</span>
                              </div>
                            </div>
                          );
                        } catch {
                          return <span className='text-red-600'>❌ JSON invalide</span>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Import Button */}
                {showPreview && importData.trim() && (
                  <div className='flex justify-end space-x-3'>
                    <button
                      onClick={() => {
                        setImportData('');
                        setShowPreview(false);
                      }}
                      className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={isLoading}
                      className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                      {isLoading ? '⏳ Import en cours...' : '📱 Importer les numéros'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Results */
            <div className='space-y-6'>
              {/* Summary */}
              <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                <div className='flex items-center space-x-2 mb-3'>
                  <CheckCircle className='h-5 w-5 text-green-600' />
                  <h3 className='font-medium text-green-900'>Import terminé avec succès!</h3>
                </div>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='text-green-800'>
                    <span className='font-medium'>{result.speakersUpdated}</span> orateurs mis à
                    jour
                  </div>
                  <div className='text-green-800'>
                    <span className='font-medium'>{result.hostsUpdated}</span> hôtes mis à jour
                  </div>
                </div>
              </div>

              {/* Speaker Updates */}
              {result.speakerDetails.length > 0 && (
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>📱 Orateurs mis à jour</h4>
                  <div className='bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto'>
                    <ul className='space-y-1 text-sm'>
                      {result.speakerDetails.map((detail, index) => (
                        <li key={index} className='text-gray-700'>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Host Updates */}
              {result.hostDetails.length > 0 && (
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>🏠 Hôtes mis à jour</h4>
                  <div className='bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto'>
                    <ul className='space-y-1 text-sm'>
                      {result.hostDetails.map((detail, index) => (
                        <li key={index} className='text-gray-700'>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <AlertCircle className='h-5 w-5 text-red-600' />
                    <h4 className='font-medium text-red-900'>Erreurs</h4>
                  </div>
                  <ul className='space-y-1 text-sm text-red-800'>
                    {result.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Close Button */}
              <div className='flex justify-end'>
                <button
                  onClick={handleClose}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors'
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
