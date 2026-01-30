import React, { useMemo, useState, useEffect } from 'react';
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Visit } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CommunicationProgress } from '@/components/messages/CommunicationProgress';
import {
  getWorkflowState,
  getWorkflowStateColor,
  getWorkflowStateLabel,
  getQuickActions,
  QuickAction,
} from '@/utils/workflowUtils';

export type VisitAction =
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
  | 'quick_message';

export interface VisitCardProps {
  visit: Visit;
  onClick?: () => void;
  onAction?: (visit: Visit, action: VisitAction, messageType?: string) => void;
  /**
   * Permet de masquer les boutons de quick messaging dans les vues compactes
   */
  showQuickMessaging?: boolean;
  /**
   * Permet de masquer le menu “Actions” si la vue gère déjà ses propres boutons
   */
  showActionMenu?: boolean;
  /**
   * Permet de masquer le badge workflow pour des variantes simplifiées
   */
  showWorkflowBadge?: boolean;
  className?: string;
}

interface VisitActionOption {
  action: Exclude<VisitAction, 'quick_message'>;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const DEFAULT_ACTIONS: VisitActionOption[] = [
  { action: 'edit', label: 'Modifier', icon: Edit2, color: 'text-blue-600' },
  { action: 'message', label: 'Envoyer un message', icon: MessageSquare, color: 'text-green-600' },
  { action: 'expenses', label: 'Dépenses', icon: CreditCard, color: 'text-purple-600' },
  { action: 'logistics', label: 'Logistique', icon: Truck, color: 'text-blue-500' },
  { action: 'status', label: 'Changer le statut', icon: CheckCircle, color: 'text-orange-600' },
  { action: 'conflict', label: 'Conflits', icon: AlertTriangle, color: 'text-amber-600' },
  { action: 'replace', label: "Remplacer l'orateur", icon: UserPlus, color: 'text-indigo-600' },
  { action: 'cancel', label: 'Annuler la visite', icon: XCircle, color: 'text-red-500' },
  { action: 'feedback', label: 'Bilan', icon: Star, color: 'text-yellow-500' },
  { action: 'delete', label: 'Supprimer', icon: Trash2, color: 'text-red-600' },
];

const statusBadgeMap: Record<string, React.ReactNode> = {
  confirmed: (
    <Badge variant='success' size='sm'>
      Confirmé
    </Badge>
  ),
  pending: (
    <Badge variant='warning' size='sm'>
      En attente
    </Badge>
  ),
  completed: (
    <Badge variant='default' size='sm'>
      Terminé
    </Badge>
  ),
  cancelled: (
    <Badge variant='danger' size='sm'>
      Annulé
    </Badge>
  ),
};

const getStatusBadge = (status: string) => statusBadgeMap[status] ?? (
  <Badge variant='default' size='sm'>
    {status}
  </Badge>
);

const workflowColorMap: Record<string, { bg: string; text: string; dot: string }> = {
  '#ef4444': { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  '#f97316': { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
  '#eab308': { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' },
  '#22c55e': { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  '#3b82f6': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  '#6b7280': { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-500' },
};

const QuickMessagingActions: React.FC<{ visit: Visit; onAction?: VisitCardProps['onAction']; actions?: QuickAction[] }> = ({ visit, onAction, actions: providedActions }) => {
  const actions = providedActions ?? getQuickActions(visit);
  const primaryAction = actions[0];

  if (!primaryAction) return null;

  const actionIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    confirm_speaker: CheckCircle,
    find_hosts: Users,
    send_group_request: MessageSquare,
    plan_logistics: UserPlus,
    send_all_messages: Send,
    reminder_week: Send,
    reminder_final: Send,
    send_thanks: Star,
  };

  const getActionIcon = (id: string) => actionIconMap[id] ?? MessageSquare;

  const getActionColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'low':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const IconComponent = getActionIcon(primaryAction.id);

  return (
    <div className='pt-2'>
      <Button
        key={primaryAction.id}
        variant='secondary'
        size='sm'
        className={`w-full justify-center text-xs font-semibold px-3 py-2 ${getActionColor(primaryAction.priority)} border-none hover:opacity-90`}
        leftIcon={<IconComponent className='w-3 h-3' />}
        onClick={(e) => {
          e.stopPropagation();
          if (primaryAction.id === 'plan_logistics') {
        onAction?.(visit, 'message', 'preparation');
      } else {
        onAction?.(visit, 'quick_message', primaryAction.id);
      }
        }}
      >
        {primaryAction.label}
      </Button>
    </div>
  );
};

const VisitTalkSummary: React.FC<{ visit: Visit }> = ({ visit }) => (
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
);

export const VisitCard: React.FC<VisitCardProps> = ({
  visit,
  onClick,
  onAction,
  className,
  showQuickMessaging = true,
  showActionMenu = true,
  showWorkflowBadge = true,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMenu) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showMenu]);

  const quickActions = useMemo(() => getQuickActions(visit), [visit]);
  const primaryQuickAction = quickActions[0];

  const actionsMenu = useMemo(
    () =>
      DEFAULT_ACTIONS.filter(
        (action) =>
          !(
            action.action === 'status' &&
            (primaryQuickAction?.id === 'confirm_speaker' || primaryQuickAction?.id === 'plan_logistics')
          )
      ),
    [primaryQuickAction]
  );

  const workflowState = useMemo(() => getWorkflowState(visit), [visit]);
  const workflowColor = useMemo(() => getWorkflowStateColor(workflowState), [workflowState]);
  const workflowLabel = useMemo(() => getWorkflowStateLabel(workflowState), [workflowState]);
  const workflowClasses = workflowColorMap[workflowColor] ?? workflowColorMap['#6b7280'];
  const hideWorkflow =
    String(workflowState) === 'pending' ||
    workflowLabel?.toLowerCase() === 'en attente' ||
    primaryQuickAction?.id === 'plan_logistics';

  const handleActionClick = (action: VisitActionOption['action'], e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.(visit, action);
    setShowMenu(false);
  };

  const isDefaultLocation = visit.locationType === 'physical';
  const hasCustomLocation = visit.locationType && !isDefaultLocation;
  const hasHostAssignments = (visit.hostAssignments && visit.hostAssignments.length > 0) ?? false;
  const hasNamedHost = !!(visit.host && visit.host.toLowerCase() !== 'à définir');
  const isRemoteOrLocal = visit.locationType === 'zoom' || visit.locationType === 'streaming' || visit.congregation?.includes('Lyon');

  return (
    <Card hoverable className={`h-full relative overflow-visible ${className ?? ''}`} onClick={onClick}>
      <CardBody className='p-4 flex flex-col h-full'>
        <div className='flex justify-between items-start mb-3'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm'>
              {visit.nom.charAt(0)}
            </div>
            <div>
              <h4 className='font-semibold text-gray-900 dark:text-white text-sm line-clamp-1'>{visit.nom}</h4>
              <p className='text-xs text-gray-500 dark:text-gray-400'>{visit.congregation}</p>
            </div>
          </div>
          <div className='flex flex-col items-end gap-1'>
            {!((primaryQuickAction?.id === 'confirm_speaker' && visit.status === 'pending') ||
              primaryQuickAction?.id === 'plan_logistics') && getStatusBadge(visit.status)}
            {showWorkflowBadge && !hideWorkflow && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${workflowClasses.bg} ${workflowClasses.text}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${workflowClasses.dot}`} />
                {workflowLabel}
              </div>
            )}
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
            <span>{new Date(visit.visitDate) >= new Date('2026-01-19') ? '11:30' : visit.visitTime}</span>
          </div>

          {hasCustomLocation && (
            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
              <MapPin className='w-4 h-4 mr-2 text-gray-400' />
              <span className='line-clamp-1'>
                {visit.locationType === 'physical' ? 'Salle du Royaume' : 'Visioconférence'}
              </span>
            </div>
          )}

          {!visit.locationType && (
            <div className='flex items-center text-xs text-amber-600 dark:text-amber-400 mt-1 gap-2'>
              <AlertTriangle className='w-3.5 h-3.5' />
              <span>Lieu à confirmer</span>
            </div>
          )}

          {hasHostAssignments && !visit.congregation?.includes('Lyon') && visit.hostAssignments && !isRemoteOrLocal && (
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

          {hasNamedHost && !hasHostAssignments && !visit.congregation?.includes('Lyon') && !isRemoteOrLocal && (
            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
              <User className='w-4 h-4 mr-2 text-gray-400' />
              <span className='line-clamp-1'>Chez {visit.host}</span>
            </div>
          )}

          {!hasHostAssignments && !hasNamedHost && !visit.congregation?.includes('Lyon') && !isRemoteOrLocal && (
            <div className='flex items-center text-xs text-amber-600 dark:text-amber-400 mt-1 gap-2'>
              <AlertTriangle className='w-3.5 h-3.5' />
              <span>Hébergement à définir</span>
            </div>
          )}

          {/* Section Accompagnants - masquée pour streaming/zoom et Lyon */}
          {visit.companions && visit.companions.length > 0 && !isRemoteOrLocal && (
            <div className='mt-3 pt-3 border-t border-gray-100 dark:border-gray-700'>
              <h5 className='text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1'>
                <Users className='w-3 h-3' />
                Accompagnants ({visit.companions.length})
              </h5>
              <div className='space-y-2'>
                {visit.companions.map((companion, index) => (
                  <div key={companion.id} className='text-sm'>
                    <div className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
                      <span className='font-medium'>{companion.name || `Accompagnant ${index + 1}`}</span>
                      <span className='text-xs text-gray-500'>
                        ({companion.type === 'couple' ? 'Couple' :
                          companion.type === 'brother' ? 'Frère' :
                          companion.type === 'sister' ? 'Sœur' : 'Autre'})
                      </span>
                    </div>
                    {companion.hostAssignments && companion.hostAssignments.length > 0 && (
                      <div className='ml-4 mt-1 space-y-1'>
                        {companion.hostAssignments.map((assignment) => (
                          <div key={assignment.id} className='flex items-center text-xs text-gray-600 dark:text-gray-400'>
                            <User className='w-3 h-3 mr-1 text-gray-400' />
                            <span>
                              {assignment.role === 'accommodation' && `Chez ${assignment.hostName}`}
                              {assignment.role === 'pickup' && `Ramassage: ${assignment.hostName}`}
                              {assignment.role === 'meals' && `Repas: ${assignment.hostName}`}
                              {assignment.role === 'transport' && `Transport: ${assignment.hostName}`}
                              {assignment.role === 'other' && `${assignment.hostName}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {companion.notes && (
                      <p className='ml-4 text-xs text-gray-500 italic mt-1'>{companion.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {visit.logistics?.checklist && visit.logistics.checklist.some((item) => !item.isCompleted) && !isRemoteOrLocal && (
            <div className='flex items-center text-xs text-orange-600 dark:text-orange-400 mt-1'>
              <Truck className='w-3 h-3 mr-2' />
              <span>Logistique à compléter</span>
            </div>
          )}
        </div>

        <div className='pt-3 mt-3 border-t border-gray-100 dark:border-gray-700'>
          <CommunicationProgress visit={visit} size='sm' />
        </div>

        {showQuickMessaging && (
          <div className='pt-2'>
            <p className='text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1'>Actions de la visite</p>
            <QuickMessagingActions visit={visit} onAction={onAction} actions={quickActions} />
          </div>
        )}

        <div className='pt-3 border-t border-gray-100 dark:border-gray-700'>
          <div className='flex justify-between items-start mb-2'>
            <VisitTalkSummary visit={visit} />
          </div>

          {showActionMenu && (
            <div className='relative'>
              <Button
                variant='secondary'
                size='sm'
                className='font-bold text-xs'
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu((prev) => !prev);
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
                          {actionsMenu.map((option) => (
                            <button
                              key={option.action}
                              className='w-full px-4 py-3 text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-3 transition-colors mb-1 last:mb-0'
                              onClick={(e) => handleActionClick(option.action, e)}
                            >
                              <div className={`p-2 rounded-full bg-opacity-10 ${option.color.replace('text-', 'bg-')}`}>
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
          )}
        </div>
      </CardBody>
    </Card>
  );
};
