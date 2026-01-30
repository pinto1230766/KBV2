import React from 'react';
import { useVisitEditor } from '../VisitEditorContext';
import { MessageType, Visit } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { CommunicationTimeline } from '@/components/messages/CommunicationTimeline';
import { CheckCircle, FileText, Clock, Star, Home, Edit3, TrendingUp, MessageSquare } from 'lucide-react';

export interface MessagesTabProps {
  onOpenMessageModal?: (params: { type: MessageType; isGroup?: boolean; channel?: any; visit: Visit }) => void;
}

const PRESETS: Array<{ type: MessageType; label: string; icon: React.ElementType; isGroup?: boolean; channel?: any }> = [
  { type: 'confirmation', label: 'Confirmation', icon: CheckCircle },
  { type: 'preparation', label: 'Préparation', icon: FileText },
  { type: 'reminder-7', label: 'Rappel J-7', icon: Clock },
  { type: 'reminder-2', label: 'Rappel J-2', icon: Clock },
  { type: 'thanks', label: 'Remerciements (orateur)', icon: Star },
  { type: 'host_thanks', label: 'Remerciements (hôte)', icon: Star },
  { type: 'host_request_message', label: 'Demande Accueil', icon: Home, isGroup: true, channel: 'whatsapp_group' },
  { type: 'visit_recap', label: 'Récapitulatif visite', icon: FileText, isGroup: true, channel: 'whatsapp_group' },
  { type: 'free_message', label: 'Message libre', icon: Edit3 },
];

export const MessagesTab: React.FC<MessagesTabProps> = ({ onOpenMessageModal }) => {
  const { visit } = useVisitEditor();
  const disabled = !onOpenMessageModal;

  // Calculer les stats de communication
  const communicationStats = React.useMemo(() => {
    if (!visit.communicationStatus) return { sent: 0, total: 5, rate: 0 };
    
    const steps = ['confirmation', 'preparation', 'reminder-7', 'reminder-2', 'thanks'];
    const completed = steps.filter(step => 
      visit.communicationStatus?.[step]?.speaker || visit.communicationStatus?.[step]?.host
    ).length;
    
    return {
      sent: completed,
      total: steps.length,
      rate: Math.round((completed / steps.length) * 100)
    };
  }, [visit.communicationStatus]);

  return (
    <div className='space-y-6'>
      {/* Section Statistiques */}
      <Card className='border-none shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'>
        <CardBody className='p-4'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
              <TrendingUp className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h3 className='font-bold text-gray-900 dark:text-white'>Suivi des communications</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {communicationStats.sent}/{communicationStats.total} messages envoyés
              </p>
            </div>
            <div className='ml-auto text-right'>
              <span className={`text-2xl font-black ${
                communicationStats.rate === 100 
                  ? 'text-green-600 dark:text-green-400' 
                  : communicationStats.rate > 50 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
              }`}>
                {communicationStats.rate}%
              </span>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className='w-full bg-white dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner'>
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                communicationStats.rate === 100 
                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                  : communicationStats.rate > 50 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
              }`}
              style={{ width: `${communicationStats.rate}%` }}
            />
          </div>
          
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
            Progression du workflow de communication pour cette visite
          </p>
        </CardBody>
      </Card>

      {/* Section Presets de messages */}
      <div>
        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2'>
          <MessageSquare className='w-4 h-4' />
          Modèles de messages
        </h4>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
          {PRESETS.map((preset) => (
            <Button
              key={preset.type}
              variant='outline'
              className='flex items-center justify-start gap-3 w-full'
              leftIcon={<preset.icon className='w-4 h-4' />}
              disabled={disabled}
              onClick={() =>
                onOpenMessageModal?.({
                  type: preset.type,
                  isGroup: preset.isGroup,
                  channel: preset.channel ?? (preset.isGroup ? 'whatsapp_group' : 'whatsapp'),
                  visit,
                })
              }
            >
              {preset.label}
            </Button>
          ))}
        </div>
        {disabled && (
          <p className='text-xs text-gray-500 mt-2'>Connectez un handler de message pour activer ces actions.</p>
        )}
      </div>

      {/* Section Historique */}
      <Card className='border-none shadow-sm'>
        <CardBody className='p-4'>
          <CommunicationTimeline visit={visit} />
        </CardBody>
      </Card>
    </div>
  );
};
