import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Visit, Language } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';
import { generateHostRequestMessage } from '@/utils/messageGenerator';
import { Send, Copy, Check } from 'lucide-react';
import { formatFullDate } from '@/utils/formatters';
import { getTalkTitle } from '@/data/talkTitles';

interface GroupHostMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitsNeedingHost: Visit[];
}

export const GroupHostMessageModal: React.FC<GroupHostMessageModalProps> = ({
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
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(settings.language);
  const [copied, setCopied] = useState(false);

  // Générer le message quand les visites sélectionnées ou la langue changent
  React.useEffect(() => {
    if (selectedVisits.size > 0) {
      generateMessage();
    } else {
      setMessage('');
    }
  }, [selectedVisits, selectedLanguage]);

  // Reset copied state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCopied(false);
      // Auto-select all visits by default
      setSelectedVisits(new Set(visitsNeedingHost.map((v) => v.visitId)));
    }
  }, [isOpen, visitsNeedingHost]);

  const generateMessage = () => {
    const visits = visitsNeedingHost.filter((v) => selectedVisits.has(v.visitId));

    if (visits.length === 0) return;

    const generated = generateHostRequestMessage(
      visits,
      congregationProfile,
      selectedLanguage,
      undefined, // customTemplate
      false, // isIndividualRequest
      ''
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
      setCopied(true);
      addToast(t('Message copié dans le presse-papier'), 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (_error) {
      addToast(t('Erreur lors de la copie'), 'error');
    }
  };

  const handleCopyAndOpenWhatsApp = async () => {
    try {
      await navigator.clipboard.writeText(message);
      addToast(t('Message copié ! Ouvrez votre groupe WhatsApp et collez.'), 'success');
      window.open('https://wa.me/', '_blank');
      onClose();
    } catch (_error) {
      addToast(t('Erreur lors de la copie'), 'error');
    }
  };

  const characterCount = message.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('Message Groupé pour les Hôtes')}
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
            leftIcon={copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
            disabled={selectedVisits.size === 0}
          >
            {copied ? t('Copié !') : t('Copier')}
          </Button>
          <Button
            onClick={handleCopyAndOpenWhatsApp}
            leftIcon={<Send className='w-4 h-4' />}
            disabled={selectedVisits.size === 0}
          >
            {t('Copier & Ouvrir WhatsApp')}
          </Button>
        </>
      }
    >
      <div className='space-y-6 max-h-[calc(90vh-12rem)] overflow-y-auto'>
        {/* Header avec compteur */}
        <div className='flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg'>
          <div>
            <h3 className='font-semibold text-orange-900 dark:text-orange-300'>
              {visitsNeedingHost.length}{' '}
              {visitsNeedingHost.length > 1
                ? t("visites sans contact d'accueil")
                : t("visite sans contact d'accueil")}
            </h3>
            <p className='text-sm text-orange-700 dark:text-orange-400 mt-1'>
              {t('Sélectionnez les visites pour lesquelles demander un contact')}
            </p>
          </div>
          <Badge variant='warning' size='md'>
            {selectedVisits.size} {selectedVisits.size > 1 ? t('sélectionnées') : t('sélectionnée')}
          </Badge>
        </div>

        {/* Sélecteur de langue */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            {t('Langue du message')}
          </label>
          <div className='flex gap-3'>
            <label className='flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
              <input
                type='radio'
                className='form-radio text-primary-600'
                checked={selectedLanguage === 'fr'}
                onChange={() => setSelectedLanguage('fr')}
              />
              <span className='text-sm'>🇫🇷 {t('Français')}</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
              <input
                type='radio'
                className='form-radio text-primary-600'
                checked={selectedLanguage === 'cv'}
                onChange={() => setSelectedLanguage('cv')}
              />
              <span className='text-sm'>🇨🇻 {t('Capverdien')}</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
              <input
                type='radio'
                className='form-radio text-primary-600'
                checked={selectedLanguage === 'pt'}
                onChange={() => setSelectedLanguage('pt')}
              />
              <span className='text-sm'>🇵🇹 {t('Portugais')}</span>
            </label>
          </div>
        </div>

        {/* Liste des visites */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
              {t('Visites à inclure dans le message')}
            </h3>
            <button
              onClick={toggleAll}
              className='text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium'
            >
              {selectedVisits.size === visitsNeedingHost.length
                ? t('Tout désélectionner')
                : t('Tout sélectionner')}
            </button>
          </div>

          <div className='max-h-64 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3'>
            {visitsNeedingHost.map((visit) => (
              <div
                key={visit.visitId}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedVisits.has(visit.visitId)
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-300 dark:border-primary-700'
                    : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => toggleVisit(visit.visitId)}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        checked={selectedVisits.has(visit.visitId)}
                        onChange={() => toggleVisit(visit.visitId)}
                        className='form-checkbox text-primary-600 rounded'
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Sélectionner ${visit.nom}`}
                      />
                      <p className='font-semibold text-gray-900 dark:text-white'>{visit.nom}</p>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400 ml-6'>
                      {formatFullDate(visit.visitDate)} à {visit.visitTime}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-500 mt-1 ml-6'>
                      {getTalkTitle(visit.talkNoOrType || '')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aperçu et édition du message */}
        <div>
          <div className='flex items-center justify-between mb-2'>
            <h4 className='font-medium text-gray-900 dark:text-white'>{t('Message à envoyer')}</h4>
            {selectedVisits.size > 0 && (
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                {characterCount} {t('caractères')}
              </span>
            )}
          </div>
          <div className='relative'>
            <textarea
              className='w-full h-64 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none font-mono text-sm leading-relaxed'
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
              <div className='absolute top-3 right-3'>
                <Badge variant='success' size='sm'>
                  <Check className='w-3 h-3 mr-1' />
                  {t('Prêt')}
                </Badge>
              </div>
            )}
          </div>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1'>
            💡 {t("Vous pouvez modifier le message avant de l'envoyer")}
          </p>
        </div>
      </div>
    </Modal>
  );
};
