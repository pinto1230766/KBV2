import React from 'react';
import { Visit } from '@/types';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
  Users,
  UserCheck,
  Calendar,
  AlertTriangle,
  Zap,
  Heart,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'sent' | 'received' | 'automated' | 'response';
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  icon: React.ComponentType<any>;
  iconColor: string;
  bgColor: string;
  channel?: string;
  role?: string;
}

interface CommunicationTimelineProps {
  visit: Visit;
  className?: string;
}

export const CommunicationTimeline: React.FC<CommunicationTimelineProps> = ({
  visit,
  className,
}) => {
  // Extract timeline events from visit communication status
  const timelineEvents = React.useMemo(() => {
    const events: TimelineEvent[] = [];

    if (!visit.communicationStatus) return events;

    // Define message type mappings
    const messageTypes: Record<string, { title: string; description: string; icon: React.ComponentType<any>; channel: string }> = {
      confirmation: {
        title: 'Confirmation orateur',
        description: 'Message de confirmation envoyé à l\'orateur',
        icon: UserCheck,
        channel: 'whatsapp',
      },
      preparation: {
        title: 'Préparation logistique',
        description: 'Détails d\'hébergement et transport envoyés',
        icon: Calendar,
        channel: 'whatsapp',
      },
      'reminder-7': {
        title: 'Rappel J-7',
        description: 'Rappel automatique une semaine avant la visite',
        icon: Clock,
        channel: 'whatsapp',
      },
      'reminder-2': {
        title: 'Rappel J-2',
        description: 'Rappel automatique deux jours avant la visite',
        icon: AlertTriangle,
        channel: 'whatsapp',
      },
      thanks: {
        title: 'Remerciements',
        description: 'Message de remerciements après la visite',
        icon: Heart,
        channel: 'whatsapp',
      },
      host_thanks: {
        title: 'Remerciements hôtes',
        description: 'Remerciements envoyés aux hôtes',
        icon: Heart,
        channel: 'whatsapp',
      },
      host_request: {
        title: 'Demande d\'hébergement',
        description: 'Recherche d\'hôtes pour l\'accueil',
        icon: Users,
        channel: 'group',
      },
      host_request_individual: {
        title: 'Contact hôte individuel',
        description: 'Message personnalisé envoyé à un hôte',
        icon: MessageSquare,
        channel: 'whatsapp',
      },
      visit_recap: {
        title: 'Récapitulatif visite',
        description: 'Résumé complet de la visite envoyé',
        icon: Send,
        channel: 'whatsapp',
      },
    };

    // Extract events from communicationStatus
    Object.entries(visit.communicationStatus).forEach(([messageType, roles]) => {
      if (typeof roles === 'object' && roles !== null) {
        Object.entries(roles as Record<string, string>).forEach(([role, dateStr]) => {
          const date = new Date(dateStr);
          const messageInfo = messageTypes[messageType];

          if (messageInfo) {
            events.push({
              id: `${messageType}-${role}-${dateStr}`,
              date,
              type: role === 'speaker' || role === 'host' ? 'sent' : 'automated',
              title: messageInfo.title,
              description: `${messageInfo.description} (${role})`,
              status: 'completed',
              icon: messageInfo.icon,
              iconColor: 'text-green-600',
              bgColor: 'bg-green-50 dark:bg-green-900/20',
              channel: messageInfo.channel,
              role,
            });
          }
        });
      }
    });

    // Add planned future events (automations)
    const visitDate = new Date(visit.visitDate);
    const now = new Date();

    // J-7 reminder if not sent
    const reminder7Date = new Date(visitDate);
    reminder7Date.setDate(reminder7Date.getDate() - 7);

    if (reminder7Date > now && !visit.communicationStatus?.['reminder-7']?.speaker) {
      events.push({
        id: 'planned-reminder-7',
        date: reminder7Date,
        type: 'automated',
        title: 'Rappel J-7 programmé',
        description: 'Rappel automatique prévu dans 7 jours',
        status: 'pending',
        icon: Clock,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        channel: 'auto',
      });
    }

    // J-2 reminder if not sent
    const reminder2Date = new Date(visitDate);
    reminder2Date.setDate(reminder2Date.getDate() - 2);

    if (reminder2Date > now && !visit.communicationStatus?.['reminder-2']?.speaker) {
      events.push({
        id: 'planned-reminder-2',
        date: reminder2Date,
        type: 'automated',
        title: 'Rappel J-2 programmé',
        description: 'Rappel automatique prévu dans 2 jours',
        status: 'pending',
        icon: AlertTriangle,
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        channel: 'auto',
      });
    }

    // Thanks after visit if not sent
    const thanksDate = new Date(visitDate);
    thanksDate.setDate(thanksDate.getDate() + 1);

    if (thanksDate > now && !visit.communicationStatus?.thanks?.speaker) {
      events.push({
        id: 'planned-thanks',
        date: thanksDate,
        type: 'automated',
        title: 'Remerciements programmés',
        description: 'Remerciements automatiques le lendemain de la visite',
        status: 'pending',
        icon: Heart,
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        channel: 'auto',
      });
    }

    // Sort events by date (most recent first)
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [visit]);

  const formatEventDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Aujourd'hui ${format(date, 'HH:mm', { locale: fr })}`;
    } else if (diffDays === 1) {
      return `Hier ${format(date, 'HH:mm', { locale: fr })}`;
    } else if (diffDays < 7) {
      return format(date, `'Il y a 'd' jours' HH:mm`, { locale: fr });
    } else {
      return format(date, 'd MMM yyyy HH:mm', { locale: fr });
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg'>
          <Zap className='w-5 h-5 text-primary-600 dark:text-primary-400' />
        </div>
        <div>
          <h3 className='font-bold text-gray-900 dark:text-white text-lg'>Historique des communications</h3>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Chronologie complète des échanges pour cette visite
          </p>
        </div>
      </div>

      {timelineEvents.length === 0 ? (
        <div className='py-12 text-center opacity-40'>
          <MessageSquare className='w-12 h-12 mx-auto mb-3' />
          <p className='text-sm font-bold uppercase tracking-widest'>Aucune communication enregistrée</p>
          <p className='text-xs text-gray-400 mt-1'>Les messages envoyés apparaîtront ici</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {timelineEvents.map((event, index) => (
            <div key={event.id} className='flex gap-4'>
              {/* Timeline line */}
              <div className='flex flex-col items-center'>
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm',
                  event.bgColor
                )}>
                  <event.icon className={cn('w-4 h-4', event.iconColor)} />
                </div>
                {index < timelineEvents.length - 1 && (
                  <div className='w-0.5 h-12 bg-gray-200 dark:bg-gray-700 mt-2' />
                )}
              </div>

              {/* Event content */}
              <div className='flex-1 min-w-0 pb-6'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h4 className='font-semibold text-gray-900 dark:text-white text-sm'>
                        {event.title}
                      </h4>
                      {event.status === 'completed' && (
                        <CheckCircle className='w-4 h-4 text-green-500' />
                      )}
                      {event.status === 'pending' && (
                        <Clock className='w-4 h-4 text-blue-500' />
                      )}
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
                      {event.description}
                    </p>
                    <div className='flex items-center gap-4 text-xs text-gray-400'>
                      <span>{formatEventDate(event.date)}</span>
                      {event.channel && (
                        <span className='px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full'>
                          {event.channel}
                        </span>
                      )}
                      {event.role && (
                        <span className='px-2 py-0.5 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full'>
                          {event.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};