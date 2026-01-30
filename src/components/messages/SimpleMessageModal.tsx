import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/contexts/SettingsContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { Visit, Speaker, Host, CommunicationChannel } from '@/types';
import { generateMessage, generateHostRequestMessage } from '@/utils/messageGenerator';
import { detectLanguageFromCongregation } from '@/utils/languageDetection';
import { Copy, Send, RefreshCw } from 'lucide-react';

interface SimpleMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit?: Visit;
  speaker?: Speaker;
  host?: Host;
  action: string; // Action déterminant le type de message (confirm_speaker, find_hosts, etc.)
}

export const SimpleMessageModal: React.FC<SimpleMessageModalProps> = ({
  isOpen,
  onClose,
  visit,
  speaker,
  host: _host, // Préfixe avec _ pour indiquer paramètre intentionnellement non utilisé
  action,
}) => {
  const { settings } = useSettings();
  const { congregationProfile, hosts: allHosts, logCommunication } = useData();
  const { addToast } = useToast();

  const [message, setMessage] = useState('');
  const channel: CommunicationChannel = 'whatsapp'; // Hardcodé pour cette implémentation
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-détection intelligente de la langue
  const detectedLanguage = React.useMemo(() => {
    if (visit) {
      return detectLanguageFromCongregation(visit.congregation);
    }
    return settings.language;
  }, [visit, settings.language]);

  // Titre et description selon l'action
  const getModalConfig = (action: string) => {
    switch (action) {
      case 'confirm_speaker':
        return {
          title: 'Confirmer l\'orateur',
          description: 'Envoyer le message de présentation et confirmation de visite',
          recipient: visit?.nom || 'Orateur'
        };
      case 'find_hosts':
        return {
          title: 'Rechercher des hôtes',
          description: 'Demander aux volontaires de se proposer pour l\'accueil',
          recipient: 'Groupe WhatsApp Lyon'
        };
      case 'send_group_request':
        return {
          title: 'Demande groupe',
          description: 'Envoyer la demande d\'hôtes au groupe WhatsApp',
          recipient: 'Groupe WhatsApp Lyon'
        };
      case 'send_all_messages':
        return {
          title: 'Diffuser le planning',
          description: 'Envoyer planning à l\'orateur, groupe et hôtes',
          recipient: 'Tous les destinataires'
        };
      case 'reminder_week':
        return {
          title: 'Rappel J-7',
          description: 'Rappel une semaine avant la visite',
          recipient: visit?.nom || 'Orateur'
        };
      case 'reminder_final':
        return {
          title: 'Dernier rappel',
          description: 'Rappel final avant la visite',
          recipient: visit?.nom || 'Orateur'
        };
      case 'send_thanks':
        return {
          title: 'Remerciements',
          description: 'Envoyer les remerciements post-visite',
          recipient: visit?.nom || 'Orateur'
        };
      default:
        return {
          title: 'Message',
          description: 'Envoyer un message',
          recipient: 'Destinataire'
        };
    }
  };

  const config = getModalConfig(action);

  // Générer le message selon l'action
  useEffect(() => {
    if (isOpen && action && visit) {
      generateMessageForAction();
    }
  }, [isOpen, action, visit]);

  const generateMessageForAction = async () => {
    if (!visit) return;

    setIsGenerating(true);
    try {
      let generated = '';

      // Fallback pour orateur si speaker n'est pas fourni
      const virtualSpeaker: Speaker = speaker || {
        id: visit.id,
        nom: visit.nom,
        congregation: visit.congregation,
        telephone: visit.telephone || '',
        gender: 'male' as const,
        talkHistory: [],
      };

      switch (action) {
        case 'confirm_speaker':
          generated = generateMessage(
            visit,
            virtualSpeaker,
            null, // Pas d'hôte spécifique
            congregationProfile,
            'confirmation',
            'speaker',
            detectedLanguage,
            undefined,
            allHosts
          );
          break;

        case 'find_hosts':
        case 'send_group_request':
          generated = generateHostRequestMessage(
            [visit],
            congregationProfile,
            detectedLanguage,
            undefined,
            false // Message de groupe
          );
          break;

        case 'send_all_messages':
          // Pour diffusion complète, générer un message récapitulatif
          generated = generateMessage(
            visit,
            virtualSpeaker,
            null,
            congregationProfile,
            'visit_recap',
            'host', // Type récapitulatif
            detectedLanguage,
            undefined,
            allHosts
          );
          break;

        case 'reminder_week':
          generated = generateMessage(
            visit,
            virtualSpeaker,
            null,
            congregationProfile,
            'reminder-7',
            'speaker',
            detectedLanguage,
            undefined,
            allHosts
          );
          break;

        case 'reminder_final':
          generated = generateMessage(
            visit,
            virtualSpeaker,
            null,
            congregationProfile,
            'reminder-2',
            'speaker',
            detectedLanguage,
            undefined,
            allHosts
          );
          break;

        case 'send_thanks':
          generated = generateMessage(
            visit,
            virtualSpeaker,
            null,
            congregationProfile,
            'thanks',
            'speaker',
            detectedLanguage,
            undefined,
            allHosts
          );
          break;

        default:
          generated = 'Message non configuré pour cette action';
      }

      setMessage(generated);
    } catch (error) {
      console.error('Erreur génération message:', error);
      addToast('Erreur lors de la génération du message', 'error');
    } finally {
      setIsGenerating(false);
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

  const handleSend = async () => {
    if (!visit) return;

    try {
      // Logique d'envoi selon l'action et le canal
      if (channel === 'whatsapp') {
        // Ouvrir WhatsApp avec le message
        const phone = getRecipientPhone();
        if (phone) {
          const encodedMessage = encodeURIComponent(message);
          const waUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
          window.open(waUrl, '_blank');
        } else {
          // Pour les messages de groupe ou sans numéro spécifique
          const encodedMessage = encodeURIComponent(message);
          const waUrl = `whatsapp://send?text=${encodedMessage}`;
          window.location.href = waUrl;
        }
      }

      // Consigner la communication
      if (action.includes('speaker') || action.includes('reminder') || action.includes('thanks')) {
        const messageType = mapActionToMessageType(action);
        logCommunication(visit.visitId, messageType, 'speaker');
      }

      addToast('Message envoyé avec succès', 'success');
      onClose();
    } catch (error) {
      console.error('Erreur envoi message:', error);
      addToast('Erreur lors de l\'envoi du message', 'error');
    }
  };

  const getRecipientPhone = (): string | null => {
    if (action.includes('speaker') || action.includes('reminder') || action.includes('thanks')) {
      return visit?.telephone || null;
    }
    // Pour les messages de groupe, pas de numéro spécifique
    return null;
  };

  const mapActionToMessageType = (action: string): any => {
    switch (action) {
      case 'confirm_speaker': return 'confirmation';
      case 'reminder_week': return 'reminder-7';
      case 'reminder_final': return 'reminder-2';
      case 'send_thanks': return 'thanks';
      default: return 'free_message';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      size='md'
      className='max-h-[90vh] overflow-hidden'
      footer={
        <>
          <Button variant='ghost' onClick={onClose}>
            Annuler
          </Button>
          <Button variant='secondary' onClick={handleCopy} leftIcon={<Copy className='w-4 h-4' />}>
            Copier
          </Button>
          <Button onClick={handleSend} leftIcon={<Send className='w-4 h-4' />}>
            Envoyer WhatsApp
          </Button>
        </>
      }
    >
      <div className='space-y-4'>
        {/* En-tête avec destinataire */}
        <div className='p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-900 dark:text-white'>
                Destinataire: {config.recipient}
              </p>
              <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                {config.description}
              </p>
            </div>
            <div className='flex gap-2'>
              <div className='text-xs text-gray-500 dark:text-gray-500 px-2 py-1 bg-white dark:bg-gray-800 rounded'>
                WhatsApp
              </div>
              <div className='text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded font-medium'>
                {detectedLanguage === 'fr' ? '🇫🇷' : detectedLanguage === 'cv' ? '🇨🇻' : '🇵🇹'}
                {detectedLanguage.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className='relative'>
          <textarea
            className='w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isGenerating ? 'Génération du message...' : 'Le message apparaîtra ici...'}
            disabled={isGenerating}
          />

          <div className='absolute bottom-4 right-4'>
            <Button
              size='sm'
              variant='secondary'
              onClick={generateMessageForAction}
              isLoading={isGenerating}
              leftIcon={<RefreshCw className='w-4 h-4' />}
            >
              Régénérer
            </Button>
          </div>
        </div>

        {/* Info utile */}
        <div className='text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg'>
          💡 Vous pouvez modifier le message avant l'envoi. Le message sera ouvert dans WhatsApp pour finalisation.
        </div>
      </div>
    </Modal>
  );
};