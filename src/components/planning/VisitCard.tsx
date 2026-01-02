import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar,
  MapPin,
  User,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  MessageSquare,
  CheckCircle,
  Star,
  CreditCard,
  Truck,
  AlertTriangle,
  XCircle,
  UserPlus,
} from 'lucide-react';
import { Visit } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CommunicationProgress } from '@/components/messages/CommunicationProgress';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VisitCardProps {
  visit: Visit;
  onClick?: () => void;
  onAction?: (
    visit: Visit,
    action:
      | 'edit'
      | 'delete'
      | 'status'
      | 'message'
      | 'feedback'
      | 'expenses'
      | 'logistics'
      | 'cancel'
      | 'replace'
      | 'conflict'
  ) => void;
}

export const VisitCard: React.FC<VisitCardProps> = ({ visit, onClick, onAction }) => {
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant='success' size='sm'>
            Confirmé
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant='warning' size='sm'>
            En attente
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant='default' size='sm'>
            Terminé
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant='danger' size='sm'>
            Annulé
          </Badge>
        );
      default:
        return (
          <Badge variant='default' size='sm'>
            {status}
          </Badge>
        );
    }
  };

  const handleActionClick = (
    action:
      | 'edit'
      | 'delete'
      | 'status'
      | 'message'
      | 'feedback'
      | 'expenses'
      | 'logistics'
      | 'cancel'
      | 'replace'
      | 'conflict',
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (onAction) {
      onAction(visit, action);
    }
    setShowMenu(false);
  };

  const actionOptions = [
    { action: 'edit', label: 'Modifier', icon: Edit2, color: 'text-blue-600' },
    {
      action: 'message',
      label: 'Envoyer un message',
      icon: MessageSquare,
      color: 'text-green-600',
    },
    { action: 'expenses', label: 'Dépenses', icon: CreditCard, color: 'text-purple-600' },
    { action: 'logistics', label: 'Logistique', icon: Truck, color: 'text-blue-500' },
    { action: 'status', label: 'Changer le statut', icon: CheckCircle, color: 'text-orange-600' },
    { action: 'conflict', label: 'Conflits', icon: AlertTriangle, color: 'text-amber-600' },
    { action: 'replace', label: 'Remplacer l\'orateur', icon: UserPlus, color: 'text-indigo-600' },
    { action: 'cancel', label: 'Annuler la visite', icon: XCircle, color: 'text-red-500' },
    { action: 'feedback', label: 'Bilan', icon: Star, color: 'text-yellow-500' },
    { action: 'delete', label: 'Supprimer', icon: Trash2, color: 'text-red-600' },
  ];

  return (
    <Card hoverable className='h-full relative overflow-visible' onClick={onClick}>
      <CardBody className='p-4 flex flex-col h-full'>
        <div className='flex justify-between items-start mb-3'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm'>
              {visit.nom.charAt(0)}
            </div>
            <div>
              <h4 className='font-semibold text-gray-900 dark:text-white text-sm line-clamp-1'>
                {visit.nom}
              </h4>
              <p className='text-xs text-gray-500 dark:text-gray-400'>{visit.congregation}</p>
            </div>
          </div>
          {getStatusBadge(visit.status)}
        </div>

        <div className='space-y-2 mb-4 flex-1'>
          <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
            <Calendar className='w-4 h-4 mr-2 text-gray-400' />
            <span className='capitalize'>
              {format(new Date(visit.visitDate), 'EEEE d MMMM yyyy', { locale: fr })}
            </span>
          </div>

          <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
            <Clock className='w-4 h-4 mr-2 text-gray-400' />
            <span>{visit.visitTime}</span>
          </div>

          <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
            <MapPin className='w-4 h-4 mr-2 text-gray-400' />
            <span className='line-clamp-1'>
              {visit.locationType === 'physical' ? 'Salle du Royaume' : 'Visioconférence'}
            </span>
          </div>

          {visit.host && !visit.congregation?.includes('Lyon') && (
            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
              <User className='w-4 h-4 mr-2 text-gray-400' />
              <span className='line-clamp-1'>Chez {visit.host}</span>
            </div>
          )}

          {/* Logistics Indicator */}
          {visit.logistics?.checklist &&
            visit.logistics.checklist.some((item) => !item.isCompleted) && (
              <div className='flex items-center text-xs text-orange-600 dark:text-orange-400 mt-1'>
                <Truck className='w-3 h-3 mr-2' />
                <span>Logistique à compléter</span>
              </div>
            )}
        </div>

        {/* Barre de progression communication */}
        <div className='pt-3 mt-3 border-t border-gray-100 dark:border-gray-700'>
          <CommunicationProgress visit={visit} size='sm' />
        </div>

        <div className='pt-3 border-t border-gray-100 dark:border-gray-700'>
          <div className='flex justify-between items-start mb-2'>
            <div className='flex-1 min-w-0'>
              <div className='text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded inline-block mb-1'>
                {visit.talkNoOrType === 'Assemblée' || visit.talkNoOrType === 'Congrès'
                  ? visit.talkNoOrType
                  : `Discours n°${visit.talkNoOrType}`}
              </div>
              {visit.talkTheme &&
                visit.talkNoOrType !== 'Assemblée' &&
                visit.talkNoOrType !== 'Congrès' && (
                  <p className='text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1'>
                    {visit.talkTheme}
                  </p>
                )}
            </div>
          </div>

          <div className='relative'>
            <button
              ref={buttonRef}
              aria-label='Options'
              className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreVertical className='w-4 h-4' />
            </button>

            {showMenu &&
              createPortal(
                <>
                  <div
                    className='fixed inset-0 z-50 bg-black/20 backdrop-blur-sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 w-72 overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
                    <div className='p-2'>
                      {actionOptions.map((option) => (
                        <button
                          key={option.action}
                          className='w-full px-4 py-3 text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-3 transition-colors mb-1 last:mb-0'
                          onClick={(e) => handleActionClick(option.action as any, e)}
                        >
                          <div
                            className={`p-2 rounded-full bg-opacity-10 ${option.color.replace('text-', 'bg-')}`}
                          >
                            <option.icon className={`w-5 h-5 ${option.color}`} />
                          </div>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>,
                document.body
              )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
