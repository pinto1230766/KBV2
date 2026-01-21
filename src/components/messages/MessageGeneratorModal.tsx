import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/contexts/SettingsContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Visit, Speaker, Host, MessageType, CommunicationChannel, MessageRole } from '@/types';
import { getPrimaryHostName } from '@/utils/hostUtils';
import { generateMessage, generateBroadcastHostRequest, generateHostRequestMessage } from '@/utils/messageGenerator';
import { Copy, RefreshCw, Send } from 'lucide-react';

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

  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<CommunicationChannel>(initialChannel);
  const [type] = useState<MessageType>(initialType);
  const [language, setLanguage] = useState(settings.language);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  // Déterminer si on envoie à un hôte ou à un orateur
  // Les types qui commencent par "host_" sont toujours pour les hôtes
  const isHostMessage = !!host || isGroupMessage || type.startsWith('host_');
  
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

  // Initialiser l'hôte sélectionné quand la visite change (pour thanks_hosts)
  useEffect(() => {
    if ((type === 'thanks_hosts' || type === 'host_thanks') && visit?.hostAssignments?.length && allHosts.length > 0) {
      const firstAssignedHost = allHosts.find(h => h.nom === visit.hostAssignments![0].hostName);
      setSelectedHost(firstAssignedHost || host || null);
    } else if (host) {
      setSelectedHost(host);
    } else {
      setSelectedHost(null);
    }
  }, [visit, allHosts, host, type]);

  const targetEntity = host || speaker || virtualSpeaker;
  const targetName = isGroupMessage ? `${allHosts.length} hôtes` : (targetEntity?.nom || visit?.nom || '');

  // Générer le message initial lors de l'ouverture ou du changement de paramètres
  useEffect(() => {
    if (isOpen && !isGenerating) {
      handleGenerate();
    }
  }, [isOpen, type, language, selectedHost]); // Ajouter selectedHost pour régénérer quand il change

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
        } else if ((selectedHost || host) && visit) {
          // Message individuel à un hôte avec visite
          const targetHost = selectedHost || host;
          if (type === 'visit_recap') {
            // Nouveau type: Récapitulatif complet de la visite
            generated = generateMessage(
              visit,
              speaker || virtualSpeaker as Speaker,
              targetHost,
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
              targetHost!.nom
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
              targetHost,
              congregationProfile,
              type,
              'host',
              language,
              undefined,
              allHosts
            );
          }
        } else if (selectedHost || host) {
          // Message individuel à un hôte sans visite spécifique
          const targetHost = selectedHost || host;
          generated = generateMessage(
            null,
            null,
            targetHost,
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
      <div className='space-y-2'>
        {/* Sélecteur de langue */}
        <div className='flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
          <span className='text-xs font-medium text-blue-900 dark:text-blue-100'>{t('Langue')}:</span>
          <div className='flex gap-2'>
            {[
              { value: 'fr', label: '🇫🇷 Français' },
              { value: 'cv', label: '🇨🇻 Capverdien' },
              { value: 'pt', label: '🇵🇹 Português' }
            ].map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value as 'fr' | 'cv' | 'pt')}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                  language === lang.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sélection de l'hôte pour les remerciements */}
        {(type === 'thanks_hosts' || type === 'host_thanks') && visit?.hostAssignments && visit.hostAssignments.length > 0 && (
          <div className='p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <label className='block text-xs font-medium text-gray-900 dark:text-white mb-1'>
              {t('Sélectionner l\'hôte à remercier')} :
            </label>
            <select
              value={selectedHost?.nom || ''}
              onChange={(e) => {
                const host = allHosts.find(h => h.nom === e.target.value);
                setSelectedHost(host || null);
              }}
              title={t('Sélectionner l\'hôte à remercier')}
              aria-label={t('Sélectionner l\'hôte à remercier')}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            >
              <option value=''>{t('Choisir un hôte...')}</option>
              {/* Hôtes principaux */}
              {visit.hostAssignments.map((assignment) => {
                const host = allHosts.find(h => h.nom === assignment.hostName);
                if (!host) return null;
                return (
                  <option key={`main-${host.nom}`} value={host.nom}>
                    {host.nom} - {assignment.role === 'accommodation' ? '🏠 Hébergement' : assignment.role === 'meals' ? '🍽️ Repas' : assignment.role === 'transport' ? '🚗 Transport' : '📋 Autre'}
                  </option>
                );
              })}
              {/* Hôtes des accompagnants */}
              {visit.companions?.map((companion) => 
                companion.hostAssignments?.map((assignment) => {
                  const host = allHosts.find(h => h.nom === assignment.hostName);
                  if (!host) return null;
                  return (
                    <option key={`companion-${companion.id}-${host.nom}`} value={host.nom}>
                      {host.nom} - {assignment.role === 'accommodation' ? '🏠' : assignment.role === 'meals' ? '🍽️' : assignment.role === 'transport' ? '🚗' : '📋'} ({companion.name})
                    </option>
                  );
                })
              )}
            </select>
          </div>
        )}

        {/* Message Area */}
        <div className='relative'>
          <textarea
            className='w-full h-40 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-xs'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('Le message généré apparaîtra ici...')}
          />

          <div className='absolute bottom-2 right-2 flex gap-2'>
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
