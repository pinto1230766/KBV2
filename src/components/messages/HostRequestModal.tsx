import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Visit, Language } from '@/types';
import { useData } from '@/contexts/DataContext';
import { hasHostAssigned } from '@/utils/hostUtils';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';
import { generateHostRequestMessage } from '@/utils/messageGenerator';
import { Send, Copy, Check } from 'lucide-react';
import { formatFullDate } from '@/utils/formatters';
import { getTalkTitle } from '@/data/talkTitles';

interface HostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitsNeedingHost: Visit[];
}

export const HostRequestModal: React.FC<HostRequestModalProps> = ({
  isOpen,
  onClose,
  visitsNeedingHost,
}) => {
  const { congregationProfile } = useData();
  const { settings } = useSettings();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [selectedVisits, setSelectedVisits] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [isIndividualRequest, setIsIndividualRequest] = useState(false);
  const [selectedHost, setSelectedHost] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(settings.language);

  // Générer le message quand les visites sélectionnées ou les paramètres changent
  React.useEffect(() => {
    if (selectedVisits.size > 0 || (isIndividualRequest && selectedVisits.size > 0)) {
      generateMessage();
    } else {
      setMessage('');
    }
  }, [selectedVisits, isIndividualRequest, selectedHost, selectedLanguage]);

  const generateMessage = () => {
    const visits = visitsNeedingHost.filter((v) => selectedVisits.has(v.visitId));

    if (visits.length === 0) return;

    const generated = generateHostRequestMessage(
      visits,
      congregationProfile,
      selectedLanguage,
      undefined, // customTemplate
      isIndividualRequest,
      selectedHost
    );

    setMessage(generated);
  };

  const toggleVisit = (visitId: string) => {
    const newSelected = new Set(selectedVisits);
    if (newSelected.has(visitId)) {
      newSelected.delete(visitId);
    } else {
      newSelected.add(visitId);
    }
    setSelectedVisits(newSelected);
  };

  const toggleAll = () => {
    if (selectedVisits.size === visitsNeedingHost.length) {
      setSelectedVisits(new Set());
    } else {
      setSelectedVisits(new Set(visitsNeedingHost.map((v) => v.visitId)));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      addToast(t('Message copié dans le presse-papier'), 'success');
    } catch (_error) {
      addToast(t('Erreur lors de la copie'), 'error');
    }
  };

  const handleSendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    // Envoyer au groupe KBV Lyon (vous pouvez configurer le numéro de groupe)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isIndividualRequest ? t("Demande d'accueil individuelle") : t("Demande d'accueil groupée")}
      size='lg'
      className='max-h-[90vh] overflow-hidden'
      footer={
        <>
          <Button variant='ghost' onClick={onClose}>
            {t('Annuler')}
          </Button>
          <Button
            variant='secondary'
            onClick={handleCopy}
            leftIcon={<Copy className='w-4 h-4' />}
            disabled={
              selectedVisits.size === 0 || (!isIndividualRequest && selectedVisits.size === 0)
            }
            title={
              !isIndividualRequest && selectedVisits.size === 0
                ? t('Sélectionnez au moins une visite')
                : ''
            }
          >
            {t('Copier')}
          </Button>
          <Button
            onClick={handleSendWhatsApp}
            leftIcon={<Send className='w-4 h-4' />}
            disabled={
              selectedVisits.size === 0 || (!isIndividualRequest && selectedVisits.size === 0)
            }
            title={
              !isIndividualRequest && selectedVisits.size === 0
                ? t('Sélectionnez au moins une visite')
                : ''
            }
          >
            {t('Envoyer sur WhatsApp')}
          </Button>
        </>
      }
    >
      <div className='space-y-6 max-h-[calc(90vh-12rem)] overflow-y-auto'>
        {/* Header avec compteur */}
        <div className='flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg'>
          <div>
            <h3 className='font-semibold text-orange-900 dark:text-orange-300'>
              {visitsNeedingHost.length} {visitsNeedingHost.length > 1 ? t('visites sans contact d\'accueil') : t('visite sans contact d\'accueil')}
            </h3>
            <p className='text-sm text-orange-700 dark:text-orange-400 mt-1'>
              {t('Sélectionnez les visites pour lesquelles demander un contact')}
            </p>
          </div>
          <Badge variant='warning' size='md'>
            {selectedVisits.size} {selectedVisits.size > 1 ? t('sélectionnées') : t('sélectionnée')}
          </Badge>
        </div>

        {/* Liste des visites */}
        <div className='space-y-4'>
          {/* Sélecteur de type de demande */}
          <div className='flex space-x-4 mb-4'>
            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                className='form-radio'
                checked={!isIndividualRequest}
                onChange={() => {
                  setIsIndividualRequest(false);
                  setSelectedHost('');
                }}
              />
              <span>{t('Demande groupée')}</span>
            </label>
            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                className='form-radio'
                checked={isIndividualRequest}
                onChange={() => setIsIndividualRequest(true)}
              />
              <span>{t('Demande individuelle')}</span>
            </label>
          </div>

          {/* Sélecteur de langue */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('Langue du message')}
            </label>
            <div className='flex space-x-4'>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='radio'
                  className='form-radio'
                  checked={selectedLanguage === 'fr'}
                  onChange={() => setSelectedLanguage('fr')}
                />
                <span>{t('🇫🇷 Français')}</span>
              </label>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='radio'
                  className='form-radio'
                  checked={selectedLanguage === 'cv'}
                  onChange={() => setSelectedLanguage('cv')}
                />
                <span>{t('🇨🇻 Capverdien')}</span>
              </label>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='radio'
                  className='form-radio'
                  checked={selectedLanguage === 'pt'}
                  onChange={() => setSelectedLanguage('pt')}
                />
                <span>{t('🇵🇹 Portugais')}</span>
              </label>
            </div>
          </div>

          {isIndividualRequest && (
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('Sélectionnez l\'hôte')}
              </label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                placeholder={t("Nom de l'hôte")}
                value={selectedHost}
                onChange={(e) => setSelectedHost(e.target.value)}
              />
            </div>
          )}

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-medium'>
                {isIndividualRequest ? t('Sélectionnez une visite') : t('Sélectionnez les visites')}
              </h3>
              {!isIndividualRequest && (
                <button onClick={toggleAll} className='text-sm text-blue-600 hover:underline'>
                  {selectedVisits.size === visitsNeedingHost.length
                    ? t('Tout désélectionner')
                    : t('Tout sélectionner')}
                </button>
              )}
            </div>

            <div className='max-h-64 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3'>
              {visitsNeedingHost.map((visit) => (
                <div
                  key={visit.visitId}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedVisits.has(visit.visitId)
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  } ${isIndividualRequest && selectedVisits.size > 0 && !selectedVisits.has(visit.visitId) ? 'opacity-50' : ''}`}
                  onClick={() => {
                    if (isIndividualRequest) {
                      const newSelected = new Set<string>();
                      newSelected.add(visit.visitId);
                      setSelectedVisits(newSelected);
                    } else {
                      toggleVisit(visit.visitId);
                    }
                  }}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>{visit.nom}</p>
                      <p className='text-sm text-gray-600'>
                        {formatFullDate(visit.visitDate)} à {visit.visitTime}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        {getTalkTitle(visit.talkNoOrType || '')}
                      </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                      {hasHostAssigned(visit) ? (
                        <Badge variant='success'>{t('Défini')}</Badge>
                      ) : (
                        <Badge variant='warning'>{t('À définir')}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Aperçu du message */}
        <div>
          <h4 className='font-medium text-gray-900 dark:text-white mb-2'>{t('Aperçu du message')}</h4>
          <div className='relative'>
            <textarea
              className='w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                selectedVisits.size === 0
                  ? t('Sélectionnez au moins une visite pour générer le message...')
                  : t('Génération du message...')
              }
              disabled={selectedVisits.size === 0}
            />
            {selectedVisits.size > 0 && (
              <div className='absolute top-2 right-2'>
                <Badge variant='success' size='sm'>
                  <Check className='w-3 h-3 mr-1' />
                  {t('Message prêt')}
                </Badge>
              </div>
            )}
          </div>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
            💡 {t('Vous pouvez modifier le message avant de l\'envoyer')}
          </p>
        </div>
      </div>
    </Modal>
  );
};
