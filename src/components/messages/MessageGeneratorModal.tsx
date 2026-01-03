import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useSettings } from '@/contexts/SettingsContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Visit, Speaker, Host, MessageType, CommunicationChannel } from '@/types';
import { getPrimaryHostName } from '@/utils/hostUtils';
import { generateMessage } from '@/utils/messageGenerator';
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
  const { hosts: allHosts, congregationProfile } = useData();
  const { addToast } = useToast();
  const { t } = useTranslation();

  // Déterminer si on envoie à un hôte ou à un orateur
  const isHostMessage = !!host || isGroupMessage;
  const targetEntity = host || speaker;
  const targetName = isGroupMessage ? `${allHosts.length} hôtes` : targetEntity?.nom || '';

  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<CommunicationChannel>(initialChannel);
  const [type, setType] = useState<MessageType | 'host_request_message' | 'free_message'>(
    initialType
  );
  const [language, setLanguage] = useState(settings.language);
  const [isGenerating, setIsGenerating] = useState(false);

  // Gestion des templates
  const [messageTemplates, setMessageTemplates] = useState<
    Array<{
      id: string;
      name: string;
      content: string;
      type: MessageType | 'host_request_message' | 'free_message';
      language: string;
      channel: CommunicationChannel;
      createdAt: Date;
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
          createdAt: new Date(t.createdAt),
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

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let generated = '';

      if (isHostMessage) {
        // Messages spécifiques aux hôtes
        if (isGroupMessage) {
          // Message groupé - utiliser les modèles traduits
          generated = generateMessage(
            null,
            null,
            null,
            congregationProfile,
            type as MessageType,
            'host',
            language,
            true // isGroupMessage
          );
        } else if (host && visit) {
          // Message individuel à un hôte avec visite
          const visitSpeaker = speaker || { nom: visit.nom, congregation: visit.congregation, telephone: visit.telephone };
          generated = generateMessage(
            visit,
            visitSpeaker as Speaker,
            host,
            congregationProfile,
            type as MessageType,
            'host',
            language
          );
        } else if (host) {
          // Message individuel à un hôte sans visite spécifique
          generated = generateMessage(
            null,
            null,
            host,
            congregationProfile,
            type as MessageType,
            'host',
            language
          );
        }
      } else if (speaker && visit) {
        // Message à un orateur
        const visitHost = allHosts.find((h) => h.nom === getPrimaryHostName(visit));
        generated = generateMessage(
          visit,
          speaker,
          visitHost,
          congregationProfile,
          type as MessageType,
          'speaker',
          language
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
        createdAt: new Date(),
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
    setChannel(template.channel);
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
    const recipients =
      isGroupMessage && isHostMessage ? allHosts : [isHostMessage ? host : speaker].filter(Boolean);

    if (!recipients.length) return;

    const subject = encodeURIComponent(
      isHostMessage
        ? `Message de l'assemblée de Lyon`
        : `Visite à KBV Lyon - ${visit?.talkTheme || ''}`
    );
    const body = encodeURIComponent(message);

    if (isGroupMessage) {
      // Envoi groupé avec délai pour éviter les blocages
      addToast(`${t('Envoi groupé à')} ${recipients.length} ${t('destinataires...')}`, 'info');

      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        if (!recipient) continue;

        if (channel === 'whatsapp' && recipient.telephone) {
          const encodedMessage = encodeURIComponent(message);
          const phone = recipient.telephone.replace(/\D/g, '');
          setTimeout(() => {
            window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
          }, i * 1000); // Délai de 1 seconde entre chaque ouverture
        } else if (channel === 'email' && recipient.email) {
          setTimeout(() => {
            window.open(`mailto:${recipient.email}?subject=${subject}&body=${body}`, '_blank');
          }, i * 500); // Délai de 0.5 seconde pour les emails
        }
      }

      setTimeout(
        () => {
          addToast(
            `${t('Messages envoyés à')} ${recipients.length} ${t('destinataires...').replace('...', '')}`,
            'success'
          );
          onClose();
        },
        recipients.length * 1000 + 1000
      );
    } else {
      // Envoi individuel
      const recipient = recipients[0];
      if (!recipient) return;

      if (channel === 'whatsapp' && recipient.telephone) {
        const encodedMessage = encodeURIComponent(message);
        const phone = recipient.telephone.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
      } else if (channel === 'email' && recipient.email) {
        window.open(`mailto:${recipient.email}?subject=${subject}&body=${body}`, '_blank');
      } else if (recipient.telephone) {
        // SMS
        const smsBody = encodeURIComponent(message);
        window.open(`sms:${recipient.telephone}?body=${smsBody}`, '_blank');
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
            {channel === 'whatsapp' ? t('WhatsApp') : channel === 'email' ? t('Email') : t('SMS')})
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
                      { value: 'thanks', label: t('Remerciements') },
                      { value: 'free_message', label: t('Message libre') },
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
                { value: 'whatsapp', label: t('WhatsApp') },
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
                      {template.createdAt.toLocaleDateString()}
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
