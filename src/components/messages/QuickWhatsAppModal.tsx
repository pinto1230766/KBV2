import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Visit, Host, MessageType} from '@/types';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/contexts/ToastContext';
import {
  MessageSquare,
  CheckCircle,
  Copy,
  ExternalLink,
  User,
  Users,
  Calendar,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  generateMessage,
  generateWhatsAppUrl,
  copyToClipboard,
} from '@/utils/messageGenerator';
import { getPrimaryHostName } from '@/utils/hostUtils';

interface QuickWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit;
  messageType: string;
}

export const QuickWhatsAppModal: React.FC<QuickWhatsAppModalProps> = ({
  isOpen,
  onClose,
  visit,
  messageType,
}) => {
  const { speakers, hosts, updateVisit, congregationProfile } = useData();
  const { settings } = useSettings();
  const { addToast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const speaker = useMemo(() => {
    return speakers.find((s) => s.id === visit.id) || null;
  }, [speakers, visit.id]);

  const host = useMemo(() => {
    const hostName = getPrimaryHostName(visit);
    return hosts.find((h) => h.nom === hostName) || null;
  }, [hosts, visit]);

  const messageInfo = useMemo(() => {
    const visitDate = new Date(visit.visitDate);
    const formattedDate = format(visitDate, 'EEEE d MMMM yyyy', { locale: fr });

    let title = '';
    let description = '';
    let targetType: 'speaker' | 'host' | 'group' = 'speaker';
    let targetName = speaker?.nom || visit.nom;
    let targetPhone = speaker?.telephone || visit.telephone || '';
    let message = '';
    let msgType: MessageType = 'confirmation';

    switch (messageType) {
      case 'confirmation':
      case 'confirm_speaker':
        title = 'Confirmation de visite';
        description = `Confirmer la visite du ${formattedDate}`;
        targetType = 'speaker';
        msgType = 'confirmation';
        message = generateMessage(visit, speaker, host, congregationProfile, msgType, 'speaker', 'fr', undefined, hosts);
        break;

      case 'preparation':
      case 'plan_logistics':
        title = 'Préparation / Logistique';
        description = `Envoyer les informations logistiques`;
        targetType = 'speaker';
        msgType = 'preparation';
        message = generateMessage(visit, speaker, host, congregationProfile, msgType, 'speaker', 'fr', undefined, hosts);
        break;

      case 'reminder':
      case 'reminder_week':
      case 'reminder_final':
      case 'reminder-7':
      case 'reminder-2':
        title = 'Rappel de visite';
        description = `Rappeler la visite à venir`;
        targetType = 'speaker';
        msgType = 'reminder-7';
        message = generateMessage(visit, speaker, host, congregationProfile, msgType, 'speaker', 'fr', undefined, hosts);
        break;

      case 'thanks':
      case 'send_thanks':
        title = 'Remerciements';
        description = `Remercier l'orateur pour sa visite`;
        targetType = 'speaker';
        msgType = 'thanks';
        message = generateMessage(visit, speaker, host, congregationProfile, msgType, 'speaker', 'fr', undefined, hosts);
        break;

      case 'host_request':
      case 'find_hosts':
      case 'send_group_request':
        title = 'Demande d\'accueil (Groupe)';
        description = `Demander des volontaires pour l'accueil`;
        targetType = 'group';
        targetName = 'Groupe des hôtes';
        targetPhone = settings.whatsappGroupId || '';
        msgType = 'host_request';
        message = generateMessage(visit, speaker, host, congregationProfile, msgType, 'host', 'fr', undefined, hosts);
        break;

      case 'host_thanks':
        title = 'Remerciements hôtes';
        description = `Remercier les hôtes`;
        targetType = 'host';
        targetName = host?.nom || 'Hôte';
        targetPhone = host?.telephone || '';
        message = `Bonjour ${host?.nom || ''},\n\nMerci beaucoup pour votre accueil de ${visit.nom} le ${formattedDate}.\n\nVotre hospitalité est très appréciée !`;
        break;

      case 'visit_recap': {
        title = 'Récapitulatif visite (Groupe)';
        description = `Envoyer le planning au groupe`;
        targetType = 'group';
        targetName = 'Groupe des hôtes';
        targetPhone = settings.whatsappGroupId || '';
        const hostAssignmentsText = visit.hostAssignments?.map(a => {
          const assignedHost = hosts.find((h: Host) => h.nom === a.hostName);
          return `• ${a.role === 'accommodation' ? '🏠' : a.role === 'meals' ? '🍽️' : '🚗'} ${a.hostName} (${assignedHost?.telephone || 'N/A'})`;
        }).join('\n') || 'Aucun hôte assigné';
        message = `📅 VISITE DU ${formattedDate.toUpperCase()}\n\n👤 Orateur: ${visit.nom}\n📍 Congrégation: ${visit.congregation}\n🎤 Discours: ${visit.talkTheme || 'N/A'}\n\n🏠 ACCUEIL:\n${hostAssignmentsText}\n\nMerci à tous !`;
        break;
      }

      default:
        title = 'Message';
        description = 'Envoyer un message';
        message = `Bonjour,\n\nConcernant la visite du ${formattedDate}...`;
    }

    return { title, description, targetType, targetName, targetPhone, message };
  }, [messageType, visit, speaker, host, settings, congregationProfile, hosts]);

  const handleOpenWhatsApp = () => {
    if (!messageInfo.targetPhone) {
      addToast('Numéro de téléphone non disponible', 'error');
      return;
    }
    const url = generateWhatsAppUrl(messageInfo.targetPhone, messageInfo.message);
    window.open(url, '_blank');
  };

  const handleCopyMessage = async () => {
    const success = await copyToClipboard(messageInfo.message);
    if (success) {
      addToast('Message copié dans le presse-papiers', 'success');
    } else {
      addToast('Erreur lors de la copie', 'error');
    }
  };

  const handleMarkAsSent = async () => {
    setIsSending(true);
    try {
      const updatedStatus = { ...visit.communicationStatus };
      const now = new Date().toISOString();

      switch (messageType) {
        case 'confirmation':
        case 'confirm_speaker':
          updatedStatus.confirmation = { ...updatedStatus.confirmation, speaker: now };
          break;
        case 'preparation':
        case 'plan_logistics':
          updatedStatus.preparation = { ...updatedStatus.preparation, speaker: now };
          break;
        case 'reminder':
        case 'reminder_week':
        case 'reminder_final':
        case 'reminder-7':
        case 'reminder-2':
          updatedStatus.reminder = { ...updatedStatus.reminder, speaker: now };
          break;
        case 'thanks':
        case 'send_thanks':
          updatedStatus.thanks = { ...updatedStatus.thanks, speaker: now };
          break;
        case 'host_request':
        case 'find_hosts':
        case 'send_group_request':
          updatedStatus.host_request = { ...updatedStatus.host_request, group: now };
          break;
        case 'host_thanks':
          updatedStatus.thanks = { ...updatedStatus.thanks, host: now };
          break;
        case 'visit_recap':
          updatedStatus.visit_recap = { ...updatedStatus.visit_recap, group: now };
          break;
      }

      await updateVisit({ ...visit, communicationStatus: updatedStatus });
      addToast('Message marqué comme envoyé ✓', 'success');
      onClose();
    } catch (_error) {
      addToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const getTargetIcon = () => {
    switch (messageInfo.targetType) {
      case 'speaker':
        return <User className='w-5 h-5 text-blue-500' />;
      case 'host':
        return <User className='w-5 h-5 text-teal-500' />;
      case 'group':
        return <Users className='w-5 h-5 text-green-500' />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='' size='lg' padding='none' hideCloseButton>
      <div className='bg-white dark:bg-gray-900'>
        {/* Header */}
        <div className='bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-white/20 rounded-xl'>
              <MessageSquare className='w-6 h-6' />
            </div>
            <div>
              <h2 className='text-lg font-bold'>{messageInfo.title}</h2>
              <p className='text-sm text-white/80'>{messageInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Visit Info */}
        <div className='p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold'>
              {visit.nom.charAt(0)}
            </div>
            <div className='flex-1'>
              <h3 className='font-bold text-gray-900 dark:text-white'>{visit.nom}</h3>
              <p className='text-sm text-gray-500'>{visit.congregation}</p>
            </div>
            <div className='text-right text-sm'>
              <div className='flex items-center gap-1 text-gray-600 dark:text-gray-400'>
                <Calendar className='w-4 h-4' />
                {format(new Date(visit.visitDate), 'd MMM yyyy', { locale: fr })}
              </div>
              <div className='flex items-center gap-1 text-gray-600 dark:text-gray-400'>
                <Clock className='w-4 h-4' />
                {visit.visitTime}
              </div>
            </div>
          </div>
        </div>

        {/* Target */}
        <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3'>
            {getTargetIcon()}
            <div>
              <p className='text-xs text-gray-500 uppercase font-bold'>Destinataire</p>
              <p className='font-medium text-gray-900 dark:text-white'>{messageInfo.targetName}</p>
              {messageInfo.targetPhone ? (
                <p className='text-sm text-gray-500'>{messageInfo.targetPhone}</p>
              ) : (
                <p className='text-sm text-red-500'>⚠️ Numéro non disponible</p>
              )}
            </div>
          </div>
        </div>

        {/* Message Preview */}
        <div className='p-4'>
          <div className='flex items-center justify-between mb-2'>
            <p className='text-xs text-gray-500 uppercase font-bold'>Aperçu du message</p>
            <button
              onClick={handleCopyMessage}
              className='text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1'
            >
              <Copy className='w-3 h-3' /> Copier
            </button>
          </div>
          <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 max-h-48 overflow-y-auto'>
            <pre className='text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans'>
              {messageInfo.message}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className='p-4 bg-gray-50 dark:bg-gray-800 flex flex-col gap-2'>
          <Button
            onClick={handleOpenWhatsApp}
            disabled={!messageInfo.targetPhone}
            className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3'
            leftIcon={<ExternalLink className='w-5 h-5' />}
          >
            Ouvrir WhatsApp
          </Button>
          
          <div className='flex gap-2'>
            <Button variant='ghost' onClick={onClose} className='flex-1'>
              Annuler
            </Button>
            <Button
              variant='secondary'
              onClick={handleMarkAsSent}
              isLoading={isSending}
              className='flex-1'
              leftIcon={<CheckCircle className='w-4 h-4' />}
            >
              Marquer comme envoyé
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
