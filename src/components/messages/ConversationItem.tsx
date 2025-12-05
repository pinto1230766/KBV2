import React from 'react';
import { Speaker, Visit } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, Clock, AlertCircle, Send } from 'lucide-react';

interface ConversationItemProps {
  speaker: Speaker;
  lastVisit?: Visit;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ 
  speaker, 
  lastVisit, 
  isActive, 
  onClick 
}) => {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Send className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        w-full p-4 flex items-center gap-4 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800
        ${isActive 
          ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-600' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-l-transparent'
        }
      `}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg">
          {speaker.nom.charAt(0)}
        </div>
        {lastVisit && (
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1 shadow-sm">
            {getStatusIcon(lastVisit.status)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className={`font-semibold truncate ${isActive ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-white'}`}>
            {speaker.nom}
          </h3>
          {lastVisit && (
            <span className="text-xs text-gray-400">
              {format(new Date(lastVisit.visitDate), 'dd MMM', { locale: fr })}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {speaker.congregation}
        </p>
        {lastVisit && (
          <p className="text-xs text-gray-400 mt-1 truncate">
            {lastVisit.talkNoOrType ? `Discours n°${lastVisit.talkNoOrType}` : 'Visite prévue'}
          </p>
        )}
      </div>
    </div>
  );
};
