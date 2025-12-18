import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useSettings } from '@/contexts/SettingsContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { Visit, Speaker, MessageType, CommunicationChannel } from '@/types';
import { generateMessage, generateWithAI } from '@/utils/messageGenerator';
import { Copy, RefreshCw, Send, Wand2 } from 'lucide-react';

interface MessageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  speaker: Speaker;
  visit: Visit;
  initialChannel?: CommunicationChannel;
  initialType?: MessageType;
}

export const MessageGeneratorModal: React.FC<MessageGeneratorModalProps> = ({
  isOpen,
  onClose,
  speaker,
  visit,
  initialChannel = 'whatsapp',
  initialType = 'reminder-7'
}) => {
  const { settings } = useSettings();
  const { hosts, congregationProfile } = useData();
  const { addToast } = useToast();

  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<CommunicationChannel>(initialChannel);
  const [type, setType] = useState<MessageType>(initialType);
  const [language, setLanguage] = useState(settings.language);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);

  const handleAIGenerate = async (action: 'rewrite' | 'shorten' | 'expand' | 'formal' | 'friendly') => {
    if (!settings.aiSettings.apiKey) {
      addToast("Veuillez configurer la clé API dans les paramètres", "error");
      return;
    }

    setIsGenerating(true);
    setShowAIOptions(false);
    try {
      const result = await generateWithAI(
        message,
        action,
        settings.aiSettings.apiKey,
        settings.aiSettings.temperature
      );
      setMessage(result);
      addToast("Message amélioré par l'IA", "success");
    } catch (error) {
      console.error(error);
      addToast("Erreur lors de la génération IA", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Générer le message initial lors de l'ouverture ou du changement de paramètres
  useEffect(() => {
    if (isOpen) {
      handleGenerate();
    }
  }, [isOpen, type, language]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const host = hosts.find(h => h.nom === visit.host);

      const generated = generateMessage(
        visit,
        speaker,
        host,
        congregationProfile,
        type,
        'speaker', // On écrit à l'orateur par défaut
        language
      );
      setMessage(generated);
    } catch (error) {
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

  const handleSend = () => {
    if (channel === 'whatsapp') {
      const encodedMessage = encodeURIComponent(message);
      const phone = speaker.telephone?.replace(/\D/g, '') || '';
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    } else if (channel === 'email') {
      const subject = encodeURIComponent(`Visite à KBV Lyon - ${visit.talkTheme}`);
      const body = encodeURIComponent(message);
      window.open(`mailto:${speaker.email}?subject=${subject}&body=${body}`, '_blank');
    } else {
      // SMS
      const body = encodeURIComponent(message);
      window.open(`sms:${speaker.telephone}?body=${body}`, '_blank');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Message pour ${speaker.nom}`}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="secondary" onClick={handleCopy} leftIcon={<Copy className="w-4 h-4" />}>
            Copier
          </Button>
          <Button onClick={handleSend} leftIcon={<Send className="w-4 h-4" />}>
            Envoyer ({channel === 'whatsapp' ? 'WhatsApp' : channel === 'email' ? 'Email' : 'SMS'})
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="w-full sm:w-auto min-w-[150px]">
            <Select
              label="Type"
              options={[
                { value: 'confirmation', label: 'Confirmation' },
                { value: 'reminder-7', label: 'Rappel (J-7)' },
                { value: 'reminder-2', label: 'Rappel (J-2)' },
                { value: 'thanks', label: 'Remerciements' },
                { value: 'preparation', label: 'Préparation' },
                { value: 'host_request', label: "Demande d'accueil" },
              ]}
              value={type}
              onChange={(e) => setType(e.target.value as MessageType)}
            />
          </div>

          <div className="w-full sm:w-auto min-w-[150px]">
            <Select
              label="Langue"
              options={[
                { value: 'fr', label: 'Français' },
                { value: 'cv', label: 'Capverdien' },
                { value: 'pt', label: 'Português' },
              ]}
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
            />
          </div>

          <div className="w-full sm:w-auto min-w-[150px]">
            <Select
              label="Canal"
              options={[
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'sms', label: 'SMS' },
                { value: 'email', label: 'Email' },
              ]}
              value={channel}
              onChange={(e) => setChannel(e.target.value as CommunicationChannel)}
            />
          </div>
        </div>

        {/* Message Area */}
        <div className="relative">
          <textarea
            className="w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Le message généré apparaîtra ici..."
          />

          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleGenerate}
              isLoading={isGenerating}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Régénérer
            </Button>
            {settings.aiSettings.enabled && (
              <div className="relative">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                  leftIcon={<Wand2 className="w-4 h-4" />}
                  onClick={() => setShowAIOptions(!showAIOptions)}
                >
                  Améliorer avec IA
                </Button>

                {showAIOptions && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <button onClick={() => handleAIGenerate('rewrite')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Réécrire</button>
                    <button onClick={() => handleAIGenerate('shorten')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Raccourcir</button>
                    <button onClick={() => handleAIGenerate('expand')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Développer</button>
                    <button onClick={() => handleAIGenerate('formal')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Plus formel</button>
                    <button onClick={() => handleAIGenerate('friendly')} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Plus amical</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
