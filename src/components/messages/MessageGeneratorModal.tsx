import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useSettings } from '@/contexts/SettingsContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Visit, Speaker, Host, MessageType, CommunicationChannel, MessageRole } from '@/types';
import { getPrimaryHostName } from '@/utils/hostUtils';
import { generateMessage, generateBroadcastHostRequest, generateHostRequestMessage } from '@/utils/messageGenerator';
import { Copy, RefreshCw, Send, Save, BookOpen } from 'lucide-react';

interface MessageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  speaker?: Speaker | null;
  visit?: Visit | null;
  host?: Host | null;
  isGroupMessage?: boolean;
  initialChannel?: CommunicationChannel;
  initialType?: MessageType;
}

export const MessageGeneratorModal: React.FC<MessageGeneratorModalProps> = ({
  isOpen,
  onClose,
  speaker,
  visit,
  host,
  isGroupMessage = false,
  initialChannel = 'whatsapp',
  initialType = 'reminder-7',
}) => {
  const { settings } = useSettings();
  const { hosts: allHosts, congregationProfile, logCommunication } = useData();
  const { addToast } = useToast();
  const { t } = useTranslation();

  // Déterminer si on envoie à un hôte ou à un orateur
  const isHostMessage = !!host || isGroupMessage;
  
  // Fallback sur les données de la visite si l'orateur n'est pas trouvé
  const virtualSpeaker = !speaker && visit ? {
    nom: visit.nom,
    congregation: visit.congregation,
    telephone: visit.telephone,
    id: visit.id,
    gender: 'male' as const,
    talkHistory: [],
    email: undefined
  } : null;

  const targetEntity = host || speaker || virtualSpeaker;
  const targetName = isGroupMessage ? `${allHosts.length} hôtes` : (targetEntity?.nom || visit?.nom || '');

  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<CommunicationChannel>(initialChannel);
  const [type, setType] = useState<MessageType>(initialType);
  const [language, setLanguage] = useState(settings.language);
  const [isGenerating, setIsGenerating] = useState(false);

  // Gestion des templates
  const [messageTemplates, setMessageTemplates] = useState<
    Array<{
      id: string;
      name: string;
      content: string;
      type: MessageType;
      language: string;
      channel: string;
      createdAt: string;
    }>
  >([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  // Charger les templates depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kbv_message_templates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((t: any) => ({
          ...t,
          createdAt: typeof t.createdAt === 'string' ? t.createdAt : new Date(t.createdAt).toISOString(),
        }));
        setMessageTemplates(parsed);
      } catch (_error) {
        // Ignore erreurs de parsing
      }
    }
  }, []);

  // Générer le message initial lors de l'ouverture ou du changement de paramètres
  useEffect(() => {
    if (isOpen) {
      handleGenerate();
    }
  }, [isOpen, type, language]);

  // Synchroniser le canal si la prop initialChannel change
  useEffect(() => {
    if (initialChannel) {
      setChannel(initialChannel);
    }
  }, [initialChannel]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let generated = '';

      if (isHostMessage) {
        // Messages spécifiques aux hôtes
        if (isGroupMessage) {
          // Message groupé pour une visite spécifique
          if (visit && allHosts.length > 0) {
            if (type === 'visit_recap') {
                 // Cas spécifique pour le récapitulatif de visite
                 generated = generateMessage(
                  visit,
                  speaker || virtualSpeaker as Speaker,
                  null, // Pas d'hôte spécifique car c'est pour le groupe
                  congregationProfile,
                  type,
                  'host',
                  language,
                  undefined,
                  allHosts
                );
                setMessage(generated);
            } else if (channel === 'whatsapp_group') {
              // Pour le groupe WhatsApp, utiliser un message de groupe (Demande d'accueil par défaut)
              generated = generateHostRequestMessage(
                [visit],
                congregationProfile,
                language,
                undefined, // customTemplate
                false // isIndividualRequest = false pour message de groupe
              );
              setMessage(generated); // Message direct sans préfixe pour le groupe
            } else {
              // Pour broadcast individuel, message personnalisé
              generated = generateBroadcastHostRequest(
                visit,
                allHosts[0],
                congregationProfile,
                language
              );
              setMessage(
                `// APERÇU - Ce message sera personnalisé pour chaque hôte :\n\n${generated}`
              );
            }
          } else {
            // Message groupé générique
            generated = generateMessage(
              null,
              null,
              null,
              congregationProfile,
              type,
              'host',
              language,
              undefined,
              allHosts
            );
            setMessage(generated);
          }
          return; // Sortir après avoir défini le message
        } else if (host && visit) {
          // Message individuel à un hôte avec visite
          if (type === 'visit_recap') {
            // Nouveau type: Récapitulatif complet de la visite
            generated = generateMessage(
              visit,
              speaker || virtualSpeaker as Speaker,
              host,
              congregationProfile,
              type,
              'host',
              language,
              undefined,
              allHosts
            );
          } else if (type === 'host_request_message') {
            // Pour les demandes d'accueil individuelles, utiliser le modèle spécialisé
            generated = generateHostRequestMessage(
              [visit],
              congregationProfile,
              language,
              undefined, // customTemplate
              true, // isIndividualRequest
              host.nom
            );
          } else {
            const visitSpeaker =
              speaker || {
                nom: visit.nom,
                congregation: visit.congregation,
                telephone: visit.telephone,
              };
            generated = generateMessage(
              visit,
              visitSpeaker as Speaker,
              host,
              congregationProfile,
              type,
              'host',
              language,
              undefined,
              allHosts
            );
          }
        } else if (host) {
          // Message individuel à un hôte sans visite spécifique
          generated = generateMessage(
            null,
            null,
            host,
            congregationProfile,
            type,
            'host',
            language,
            undefined,
            allHosts
          );
        }
      } else if ((speaker || visit) && !isHostMessage) {
        // Message à un orateur
        const visitHost = allHosts.find((h) => h.nom === getPrimaryHostName(visit!));
        const currentSpeaker = speaker || {
          id: visit?.id || '',
          nom: visit?.nom || '',
          congregation: visit?.congregation || '',
          telephone: visit?.telephone || '',
          gender: 'male' as const,
          talkHistory: [],
        } as Speaker;

        generated = generateMessage(
          visit!,
          currentSpeaker,
          visitHost,
          congregationProfile,
          type as MessageType,
          'speaker',
          language,
          undefined,
          allHosts
        );
      }

      setMessage(generated);
    } catch (_error) {
      addToast(t('Erreur lors de la génération du message'), 'error');
    } finally {
      setIsGenerating(false);
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

  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !message.trim()) {
      addToast(t('Veuillez saisir un nom pour le modèle et un message'), 'warning');
      return;
    }

    setIsSavingTemplate(true);
    try {
      const newTemplate = {
        id: Date.now().toString(),
        name: templateName.trim(),
        content: message,
        type,
        language,
        channel,
        createdAt: new Date().toISOString(),
      };

      const updatedTemplates = [...messageTemplates, newTemplate];
      setMessageTemplates(updatedTemplates);

      // Sauvegarder dans localStorage
      localStorage.setItem('kbv_message_templates', JSON.stringify(updatedTemplates));

      setTemplateName('');
      addToast(t('Modèle de message sauvegardé'), 'success');
    } catch (_error) {
      addToast(t('Erreur lors de la sauvegarde du modèle'), 'error');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleLoadTemplate = (template: (typeof messageTemplates)[0]) => {
    setMessage(template.content);
    setType(template.type);
    setLanguage(template.language as 'fr' | 'cv' | 'pt');
    setChannel(template.channel as CommunicationChannel);
    setShowTemplates(false);
    addToast(`${t('Modèle')} "${template.name}" ${t('chargé')}`, 'info');
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = messageTemplates.filter((t) => t.id !== templateId);
    setMessageTemplates(updatedTemplates);
    localStorage.setItem('kbv_message_templates', JSON.stringify(updatedTemplates));
    addToast(t('Modèle supprimé'), 'success');
  };

  const handleSend = async () => {
    // Collecter les destinataires avec fallback sur la visite pour les orateurs
    const recipients = isGroupMessage && isHostMessage 
      ? allHosts 
      : [isHostMessage ? host : (speaker || virtualSpeaker)].filter(Boolean);

    if (!recipients.length) {
      addToast(t('Aucun destinataire trouvé'), 'warning');
      return;
    }

    const subject = encodeURIComponent(
      isHostMessage
        ? `Message de l'assemblée de Lyon`
        : `Visite à KBV Lyon - ${visit?.talkTheme || ''}`
    );

    // Fonction pour ouvrir WhatsApp avec fallback
    const openWhatsApp = (phone: string, message: string) => {
      const cleanPhone = phone.replace(/\D/g, '');
      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
      
      console.log('Opening WhatsApp URL:', waUrl);
      window.open(waUrl, '_blank');
      
      // Fallback: essayer avec le protocole direct après un court délai
      setTimeout(() => {
        const protocolUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
        window.location.href = protocolUrl;
      }, 800);
    };

    // Fonction pour ouvrir le groupe WhatsApp des hôtes (ou partager au groupe)
    const openWhatsAppGroup = (message: string) => {
      const encodedMessage = encodeURIComponent(message);
      
      // On utilise whatsapp://send pour permettre de choisir le groupe dans WhatsApp
      const protocolUrl = `whatsapp://send?text=${encodedMessage}`;
      console.log('Sharing to WhatsApp group:', protocolUrl);
      window.location.href = protocolUrl;

      // Fallback sur le lien d'invitation si le protocole échoue
      setTimeout(() => {
        const groupId = settings.whatsappGroupId || 'Di5J5Jl4VjU4e9QURFHsrf'; 
        const groupUrl = `https://chat.whatsapp.com/${groupId}`;
        window.open(groupUrl, '_blank');
      }, 1000);
    };

    if (isGroupMessage) {
      // Envoi groupé avec délai pour éviter les blocages
      addToast(`${t('Envoi groupé à')} ${recipients.length} ${t('destinataires...')}`, 'info');

      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i] as Host; // On sait que ce sont des hôtes
        if (!recipient) continue;

        // Générer le message dynamiquement pour chaque hôte si c'est un broadcast de visite
        // MAIS PA POUR LE RECAPITULATIF (qui est unique pour le groupe)
        const messageToSend =
          isGroupMessage && visit && type !== 'visit_recap' && channel !== 'whatsapp_group'
            ? generateBroadcastHostRequest(visit, recipient, congregationProfile, language)
            : message;

        if (channel === 'whatsapp' && recipient.telephone) {
          setTimeout(() => {
            openWhatsApp(recipient.telephone!, messageToSend);
          }, i * 1500); // Délai de 1.5 seconde entre chaque ouverture
        } else if (channel === 'whatsapp_group') {
          // Pour le groupe, envoyer seulement le premier message
          if (i === 0) {
            setTimeout(() => {
              openWhatsAppGroup(messageToSend);
            }, 500);
          }
          // On break car on envoie une seule fois au groupe
          break; 
        } else if (channel === 'email' && recipient.email) {
          const body = encodeURIComponent(messageToSend);
          setTimeout(() => {
            window.open(`mailto:${recipient.email}?subject=${subject}&body=${body}`, '_blank');
          }, i * 500);
        }
      }

      // Notification de fin différente selon si c'est un groupe ou broadcast
      if (channel === 'whatsapp_group') {
         setTimeout(() => {
            addToast(t('Message envoyé au groupe WhatsApp'), 'success');
            onClose();
         }, 1000);
      } else {
        setTimeout(
            () => {
            addToast(
                `${t('Messages envoyés à')} ${
                recipients.length
                } ${t('destinataires...').replace('...', '')}`,
                'success'
            );
            onClose();
            },
            recipients.length * 1500 + 1000
        );
      }
    } else {
      // Envoi individuel
      const recipient = recipients[0];
      if (!recipient) return;
      const body = encodeURIComponent(message);

      if (channel === 'whatsapp' && recipient.telephone) {
        openWhatsApp(recipient.telephone, message);
      } else if (channel === 'whatsapp_group' || channel === 'whatsapp') { 
         // Fallback si channel mismatch
        openWhatsAppGroup(message);
      } else if (channel === 'email' && (recipient as any).email) {
        window.open(`mailto:${(recipient as any).email}?subject=${subject}&body=${body}`, '_blank');
      } else if (recipient.telephone) {
        // SMS
        const smsBody = encodeURIComponent(message);
        window.open(`sms:${recipient.telephone}?body=${smsBody}`, '_blank');
      }

      // Consigner la communication
      if (visit) {
        const role = isHostMessage ? ('host' as MessageRole) : ('speaker' as MessageRole);
        logCommunication(visit.visitId, type, role);
      }

      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('Message pour')} ${targetName}`}
      size='lg'
      className='max-h-[90vh] overflow-hidden'
      footer={
        <>
          <Button variant='ghost' onClick={onClose}>
            {t('Annuler')}
          </Button>
          <Button variant='secondary' onClick={handleCopy} leftIcon={<Copy className='w-4 h-4' />}>
            {t('Copier')}
          </Button>
          <Button onClick={handleSend} leftIcon={<Send className='w-4 h-4' />}>
            {t('Envoyer')} (
            {channel === 'whatsapp' || channel === 'whatsapp_group' ? t('WhatsApp') : channel === 'email' ? t('Email') : t('SMS')})
          </Button>
        </>
      }
    >
      <div className='space-y-4'>
        {/* Toolbar */}
        <div className='flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700'>
          <div className='w-full sm:w-auto min-w-[150px]'>
            <Select
              label={t('Type')}
              options={
                isHostMessage
                  ? [
                      { value: 'host_request_message', label: t("Demande d'accueil") },
                      { value: 'confirmation', label: t('Confirmation') },
                      { value: 'preparation', label: t('Préparation') },
                       {value: 'reminder-7', label: t('Rappel (J-7)')},
                       {value: 'reminder-2', label: t('Rappel (J-2)')},
                       {value: 'thanks', label: t('Remerciements')},
                       {value: 'visit_recap', label: t('Récapitulatif Visite')},
                       {value: 'free_message', label: t('Message libre')},
                     ]
                  : [
                      { value: 'confirmation', label: t('Confirmation') },
                      { value: 'reminder-7', label: t('Rappel (J-7)') },
                      { value: 'reminder-2', label: t('Rappel (J-2)') },
                      { value: 'thanks', label: t('Remerciements') },
                      { value: 'preparation', label: t('Préparation') },
                    ]
              }
              value={type}
              onChange={(e) =>
                setType(e.target.value as MessageType | 'host_request_message' | 'free_message')
              }
            />
          </div>

          <div className='w-full sm:w-auto min-w-[150px]'>
            <Select
              label={t('Langue')}
              options={[
                { value: 'fr', label: t('Français') },
                { value: 'cv', label: t('Capverdien') },
                { value: 'pt', label: t('Português') },
              ]}
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'fr' | 'cv' | 'pt')}
            />
          </div>

          <div className='w-full sm:w-auto min-w-[150px]'>
            <Select
              label={t('Canal')}
              options={[
                { value: 'whatsapp', label: t('WhatsApp (Individuel)') },
                { value: 'whatsapp_group', label: t('WhatsApp (Groupe)') },
                { value: 'sms', label: t('SMS') },
                { value: 'email', label: t('Email') },
              ]}
              value={channel}
              onChange={(e) => setChannel(e.target.value as CommunicationChannel)}
            />
          </div>
        </div>

        {/* Template Actions */}
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowTemplates(!showTemplates)}
            leftIcon={<BookOpen className='w-4 h-4' />}
          >
            {t('Modèles')} ({messageTemplates.length})
          </Button>

          {showTemplates && (
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder={t('Nom du modèle...')}
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className='px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800'
              />
              <Button
                variant='outline'
                size='sm'
                onClick={handleSaveTemplate}
                isLoading={isSavingTemplate}
                leftIcon={<Save className='w-4 h-4' />}
              >
                {t('Sauvegarder')}
              </Button>
            </div>
          )}
        </div>

        {/* Templates List */}
        {showTemplates && messageTemplates.length > 0 && (
          <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 max-h-48 overflow-y-auto'>
            <h4 className='font-semibold text-sm mb-3'>{t('Modèles sauvegardés:')}</h4>
            <div className='space-y-2'>
              {messageTemplates.map((template) => (
                <div
                  key={template.id}
                  className='flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border'
                >
                  <div className='flex-1'>
                    <div className='font-medium text-sm'>{template.name}</div>
                    <div className='text-xs text-gray-500'>
                      {template.type} • {template.language} • {template.channel} •{' '}
                      {new Date(template.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='ghost' size='sm' onClick={() => handleLoadTemplate(template)}>
                      {t('Charger')}
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDeleteTemplate(template.id)}
                      className='text-red-600 hover:text-red-700'
                    >
                      {t('Suppr')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Area */}
        <div className='relative'>
          <textarea
            className='w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('Le message généré apparaîtra ici...')}
          />

          <div className='absolute bottom-4 right-4 flex gap-2'>
            <Button
              size='sm'
              variant='secondary'
              onClick={handleGenerate}
              isLoading={isGenerating}
              leftIcon={<RefreshCw className='w-4 h-4' />}
            >
              {t('Régénérer')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
