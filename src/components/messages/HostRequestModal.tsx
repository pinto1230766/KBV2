import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Visit } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/contexts/ToastContext';
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
  visitsNeedingHost
}) => {
  const { congregationProfile } = useData();
  const { settings } = useSettings();
  const { addToast } = useToast();
  
  const [selectedVisits, setSelectedVisits] = useState<Set<string>>(
    new Set(visitsNeedingHost.map(v => v.visitId))
  );
  const [message, setMessage] = useState('');

  // Générer le message quand les visites sélectionnées changent
  React.useEffect(() => {
    if (selectedVisits.size > 0) {
      generateMessage();
    }
  }, [selectedVisits]);

  const generateMessage = () => {
    const visits = visitsNeedingHost.filter(v => selectedVisits.has(v.visitId));
    const generated = generateHostRequestMessage(
      visits,
      congregationProfile,
      settings.language
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
      setSelectedVisits(new Set(visitsNeedingHost.map(v => v.visitId)));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      addToast('Message copié dans le presse-papier', 'success');
    } catch (error) {
      addToast('Erreur lors de la copie', 'error');
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
      title="Demande d'accueil groupée"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleCopy} 
            leftIcon={<Copy className="w-4 h-4" />}
            disabled={selectedVisits.size === 0}
          >
            Copier
          </Button>
          <Button 
            onClick={handleSendWhatsApp} 
            leftIcon={<Send className="w-4 h-4" />}
            disabled={selectedVisits.size === 0}
          >
            Envoyer (WhatsApp)
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Header avec compteur */}
        <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div>
            <h3 className="font-semibold text-orange-900 dark:text-orange-300">
              {visitsNeedingHost.length} visite{visitsNeedingHost.length > 1 ? 's' : ''} sans contact d'accueil
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
              Sélectionnez les visites pour lesquelles demander un contact
            </p>
          </div>
          <Badge variant="warning" size="md">
            {selectedVisits.size} sélectionnée{selectedVisits.size > 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Liste des visites avec checkboxes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Visites</h4>
            <button
              onClick={toggleAll}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              {selectedVisits.size === visitsNeedingHost.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            {visitsNeedingHost.map((visit) => (
              <label
                key={visit.visitId}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedVisits.has(visit.visitId)}
                  onChange={() => toggleVisit(visit.visitId)}
                  className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {visit.nom}
                    </p>
                    <Badge variant="default" size="sm">
                      {formatFullDate(visit.visitDate, settings.language)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {visit.congregation} • {visit.visitTime}
                  </p>
                  {(visit.talkTheme || getTalkTitle(visit.talkNoOrType)) && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      N°{visit.talkNoOrType} - {visit.talkTheme || getTalkTitle(visit.talkNoOrType)}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Aperçu du message */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Aperçu du message
          </h4>
          <div className="relative">
            <textarea
              className="w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedVisits.size === 0 ? "Sélectionnez au moins une visite pour générer le message..." : "Génération du message..."}
              disabled={selectedVisits.size === 0}
            />
            {selectedVisits.size > 0 && (
              <div className="absolute top-2 right-2">
                <Badge variant="success" size="sm">
                  <Check className="w-3 h-3 mr-1" />
                  Message prêt
                </Badge>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            💡 Vous pouvez modifier le message avant de l'envoyer
          </p>
        </div>
      </div>
    </Modal>
  );
};
