import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar,
  MapPin,
  User,
  Clock,
  ChevronDown,
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
  Send,
  Users,
} from 'lucide-react';
import { Visit } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CommunicationProgress } from '@/components/messages/CommunicationProgress';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getWorkflowState, getQuickActions, getWorkflowStateColor, getWorkflowStateLabel } from '@/utils/workflowUtils';
import { needsHosts, getNoHostReason } from '@/utils/hostAssignmentUtils';

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
      | 'quick_message',
    messageType?: string
  ) => void;
}

interface QuickMessagingActionsProps {
  visit: Visit;
  onAction?: (visit: Visit, action: 'quick_message', messageType: string) => void;
}

// Composant pour les actions de messagerie rapide
const QuickMessagingActions: React.FC<QuickMessagingActionsProps> = ({ visit, onAction }) => {
  const actions = getQuickActions(visit);

  if (actions.length === 0) return null;

  // Mapping des actions vers les icônes Lucide
  const getActionIcon = (actionId: string) => {
    switch (actionId) {
      case 'confirm_speaker': return CheckCircle;
      case 'find_hosts': return Users;
      case 'send_group_request': return MessageSquare;
      case 'plan_logistics': return UserPlus;
      case 'send_all_messages': return Send;
      case 'reminder_week':
      case 'reminder_final': return Clock;
      case 'send_thanks': return Star;
      case 'visit_recap': return MessageSquare;
      case 'host_thanks': return Star;
      default: return MessageSquare;
    }
  };

  // Couleur selon priorité
  const getActionColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'low': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className='pt-2 flex gap-1'>
      {actions.map((action) => {
        const IconComponent = getActionIcon(action.id);
        return (
          <Button
            key={action.id}
            variant='ghost'
            size='sm'
            className={`flex-1 justify-center text-xs font-medium px-2 py-1 ${getActionColor(action.priority)} border border-transparent hover:border-current`}
            leftIcon={<IconComponent className='w-3 h-3' />}
            onClick={(e) => {
              e.stopPropagation();
              onAction?.(visit, 'quick_message', action.id);
            }}
          >
            {action.label}
          </Button>
        );
      })}
    </div>
  );
};

export const VisitCard: React.FC<VisitCardProps> = ({ visit, onClick, onAction }) => {
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // État intelligent du workflow
  const workflowState = getWorkflowState(visit);
  const workflowColor = getWorkflowStateColor(workflowState);
  const workflowLabel = getWorkflowStateLabel(workflowState);

  // Mapping des couleurs vers des classes CSS
  const getWorkflowClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
      '#ef4444': { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
      '#f97316': { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
      '#eab308': { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' },
      '#22c55e': { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' },
      '#3b82f6': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
      '#6b7280': { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-500' },
    };
    return colorMap[color] || colorMap['#6b7280'];
  };

  const workflowClasses = getWorkflowClasses(workflowColor);

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
          <div className='flex flex-col items-end gap-1'>
            {getStatusBadge(visit.status)}
            {/* Badge état workflow */}
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${workflowClasses.bg} ${workflowClasses.text}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${workflowClasses.dot}`} />
              {workflowLabel}
            </div>
          </div>
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

          {/* Host Assignments - only show if hosts are needed */}
          {needsHosts(visit) && visit.hostAssignments && visit.hostAssignments.length > 0 && (
            <div className='space-y-1'>
              {visit.hostAssignments.map((assignment) => (
                <div key={assignment.id} className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                  <User className='w-4 h-4 mr-2 text-gray-400 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <span className='line-clamp-1'>
                      {assignment.role === 'accommodation' && `Chez ${assignment.hostName}`}
                      {assignment.role === 'pickup' && `Ramassage: ${assignment.hostName}`}
                      {assignment.role === 'meals' && `Repas: ${assignment.hostName}`}
                      {assignment.role === 'transport' && `Transport: ${assignment.hostName}`}
                      {assignment.role === 'other' && `${assignment.hostName}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legacy host display for backward compatibility - only show if hosts are needed */}
          {needsHosts(visit) && visit.host && !visit.hostAssignments?.length && (
            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
              <User className='w-4 h-4 mr-2 text-gray-400' />
              <span className='line-clamp-1'>Chez {visit.host}</span>
            </div>
          )}

          {/* Show message when no hosts are needed */}
          {!needsHosts(visit) && (
            <div className='flex items-center text-sm text-amber-600 dark:text-amber-400'>
              <AlertTriangle className='w-4 h-4 mr-2' />
              <span className='line-clamp-1 text-xs'>
                {getNoHostReason(visit)}
              </span>
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

        {/* Quick Messaging Actions */}
        <QuickMessagingActions visit={visit} onAction={onAction} />

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
            <Button
              ref={buttonRef}
              variant='secondary'
              size='sm'
              className='font-bold text-xs'
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              rightIcon={<ChevronDown className='w-3 h-3' />}
            >
              Actions
            </Button>

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
                  <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl w-72 overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
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
