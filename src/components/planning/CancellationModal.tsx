import React, { useState } from 'react';
import { XCircle, Calendar, MessageSquare, RotateCcw, Send, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Visit } from '@/types';
import { getPrimaryHostName } from '@/utils/hostUtils';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit;
  onCancel: (cancellationData: CancellationData) => void;
}

export interface CancellationData {
  visitId: string;
  reason: CancellationReason;
  customReason?: string;
  notifySpeaker: boolean;
  notifyHost: boolean;
  proposeReschedule: boolean;
  suggestedNewDate?: string;
  internalNotes?: string;
  cancelledBy: string;
  cancelledAt: string;
}

type CancellationReason =
  | 'speaker_unavailable'
  | 'host_unavailable'
  | 'congregation_conflict'
  | 'weather'
  | 'health'
  | 'emergency'
  | 'duplicate'
  | 'other';

const CANCELLATION_REASONS: { value: CancellationReason; label: string; icon: string }[] = [
  { value: 'speaker_unavailable', label: 'Orateur indisponible', icon: '👤' },
  { value: 'host_unavailable', label: 'Hôte indisponible', icon: '🏠' },
  { value: 'congregation_conflict', label: 'Conflit de congrégation', icon: '⚠️' },
  { value: 'weather', label: 'Conditions météo', icon: '🌧️' },
  { value: 'health', label: 'Raisons de santé', icon: '🏥' },
  { value: 'emergency', label: 'Urgence', icon: '🚨' },
  { value: 'duplicate', label: 'Doublon détecté', icon: '📋' },
  { value: 'other', label: 'Autre raison', icon: '📝' },
];

export const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  visit,
  onCancel,
}) => {
  const [selectedReason, setSelectedReason] = useState<CancellationReason | null>(null);
  const [customReason, setCustomReason] = useState('');
  const [notifySpeaker, setNotifySpeaker] = useState(true);
  const [notifyHost, setNotifyHost] = useState(true);
  const [proposeReschedule, setProposeReschedule] = useState(false);
  const [suggestedNewDate, setSuggestedNewDate] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) return;

    const cancellationData: CancellationData = {
      visitId: visit.visitId,
      reason: selectedReason,
      customReason: selectedReason === 'other' ? customReason : undefined,
      notifySpeaker,
      notifyHost,
      proposeReschedule,
      suggestedNewDate: proposeReschedule ? suggestedNewDate : undefined,
      internalNotes,
      cancelledBy: 'Coordinateur', // À remplacer par l'utilisateur connecté
      cancelledAt: new Date().toISOString(),
    };

    onCancel(cancellationData);
    onClose();
  };

  const getNotificationPreview = () => {
    const reason = CANCELLATION_REASONS.find((r) => r.value === selectedReason);
    return `Bonjour ${visit.nom},\n\nNous sommes au regret de vous informer que la visite prévue le ${new Date(visit.visitDate).toLocaleDateString('fr-FR')} doit être annulée.\n\nRaison : ${reason?.label}${selectedReason === 'other' && customReason ? ` - ${customReason}` : ''}\n\n${proposeReschedule && suggestedNewDate ? `Nous vous proposons de reprogrammer cette visite le ${new Date(suggestedNewDate).toLocaleDateString('fr-FR')}.\n\n` : ''}Nous vous contacterons prochainement pour convenir d'une nouvelle date.\n\nCordialement,\nKBV Lyon`;
  };

  if (showConfirmation) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Confirmer l'annulation" size='md' className='max-h-[90vh] overflow-hidden'>
        <div className='space-y-6'>
          <div className='flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
            <AlertTriangle className='w-6 h-6 text-red-600 flex-shrink-0 mt-1' />
            <div>
              <h4 className='font-semibold text-red-900 dark:text-red-200 mb-2'>
                Attention : Action irréversible
              </h4>
              <p className='text-sm text-red-800 dark:text-red-300'>
                Vous êtes sur le point d'annuler définitivement cette visite. Cette action ne peut
                pas être annulée.
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Orateur</span>
              <span className='font-medium text-gray-900 dark:text-white'>{visit.nom}</span>
            </div>
            <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Date</span>
              <span className='font-medium text-gray-900 dark:text-white'>
                {new Date(visit.visitDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Raison</span>
              <span className='font-medium text-gray-900 dark:text-white'>
                {CANCELLATION_REASONS.find((r) => r.value === selectedReason)?.label}
              </span>
            </div>
          </div>

          {(notifySpeaker || notifyHost) && (
            <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
              <div className='flex items-center gap-2 mb-2'>
                <Send className='w-4 h-4 text-blue-600' />
                <span className='font-medium text-blue-900 dark:text-blue-200'>
                  Notifications à envoyer
                </span>
              </div>
              <ul className='text-sm text-blue-800 dark:text-blue-300 space-y-1'>
                {notifySpeaker && <li>• Notification à l'orateur ({visit.nom})</li>}
                {notifyHost && <li>• Notification à l'hôte ({getPrimaryHostName(visit) || 'Non assigné'})</li>}
              </ul>
            </div>
          )}

          <div className='flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700'>
            <Button variant='secondary' onClick={() => setShowConfirmation(false)}>
              Retour
            </Button>
            <Button variant='danger' onClick={handleSubmit}>
              <XCircle className='w-4 h-4 mr-2' />
              Confirmer l'annulation
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Annuler une visite' size='lg' className='max-h-[90vh] overflow-hidden'>
      <div className='space-y-6 max-h-[calc(90vh-8rem)] overflow-y-auto'>
        {/* Informations de la visite */}
        <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <div className='flex items-center gap-3 mb-3'>
            <Calendar className='w-5 h-5 text-primary-600' />
            <div>
              <h4 className='font-semibold text-gray-900 dark:text-white'>{visit.nom}</h4>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                à {new Date(visit.visitDate) >= new Date('2026-01-19') ? '11:30' : visit.visitTime}
              </p>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div>
              <span className='text-gray-500 dark:text-gray-400'>Discours :</span>
              <span className='ml-2 text-gray-900 dark:text-white'>{visit.talkNoOrType}</span>
            </div>
            <div>
              <span className='text-gray-500 dark:text-gray-400'>Hôte :</span>
              <span className='ml-2 text-gray-900 dark:text-white'>{getPrimaryHostName(visit) || 'Non assigné'}</span>
            </div>
          </div>
        </div>

        {/* Raison de l'annulation */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
            Raison de l'annulation *
          </label>
          <div className='grid grid-cols-2 gap-3'>
            {CANCELLATION_REASONS.map((reason) => (
              <button
                key={reason.value}
                onClick={() => setSelectedReason(reason.value)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  selectedReason === reason.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className='flex items-center gap-2'>
                  <span className='text-2xl'>{reason.icon}</span>
                  <span className='text-sm font-medium text-gray-900 dark:text-white'>
                    {reason.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Raison personnalisée */}
        {selectedReason === 'other' && (
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Précisez la raison
            </label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              rows={3}
              placeholder="Décrivez la raison de l'annulation..."
            />
          </div>
        )}

        {/* Options de notification */}
        <div className='space-y-3'>
          <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>Notifications</h4>
          <label className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer'>
            <input
              type='checkbox'
              checked={notifySpeaker}
              onChange={(e) => setNotifySpeaker(e.target.checked)}
              className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
            />
            <div className='flex-1'>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                Notifier l'orateur
              </span>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Envoyer un message d'annulation à {visit.nom}
              </p>
            </div>
          </label>
          <label className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer'>
            <input
              type='checkbox'
              checked={notifyHost}
              onChange={(e) => setNotifyHost(e.target.checked)}
              className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
            />
            <div className='flex-1'>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                Notifier l'hôte
              </span>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Envoyer un message d'annulation à {getPrimaryHostName(visit) || 'l\'hôte'}
              </p>
            </div>
          </label>
        </div>

        {/* Proposition de reprogrammation */}
        <div className='space-y-3'>
          <label className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer'>
            <input
              type='checkbox'
              checked={proposeReschedule}
              onChange={(e) => setProposeReschedule(e.target.checked)}
              className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
            />
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <RotateCcw className='w-4 h-4 text-primary-600' />
                <span className='text-sm font-medium text-gray-900 dark:text-white'>
                  Proposer une reprogrammation
                </span>
              </div>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                Suggérer une nouvelle date dans le message d'annulation
              </p>
            </div>
          </label>

          {proposeReschedule && (
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Nouvelle date proposée
              </label>
              <input
                type='date'
                value={suggestedNewDate}
                onChange={(e) => setSuggestedNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                aria-label='Nouvelle date proposée'
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>
          )}
        </div>

        {/* Notes internes */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Notes internes (optionnel)
          </label>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            rows={2}
            placeholder="Notes pour l'équipe (non envoyées aux participants)..."
          />
        </div>

        {/* Prévisualisation du message */}
        {(notifySpeaker || notifyHost) && selectedReason && (
          <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
            <div className='flex items-center gap-2 mb-2'>
              <MessageSquare className='w-4 h-4 text-blue-600' />
              <span className='text-sm font-medium text-blue-900 dark:text-blue-200'>
                Aperçu du message
              </span>
            </div>
            <pre className='text-xs text-blue-800 dark:text-blue-300 whitespace-pre-wrap font-sans'>
              {getNotificationPreview()}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className='flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant='danger'
            onClick={() => setShowConfirmation(true)}
            disabled={!selectedReason || (selectedReason === 'other' && !customReason)}
          >
            <XCircle className='w-4 h-4 mr-2' />
            Annuler la visite
          </Button>
        </div>
      </div>
    </Modal>
  );
};
