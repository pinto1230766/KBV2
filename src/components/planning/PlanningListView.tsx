import React from 'react';
import { Visit } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Edit, Trash2, MessageSquare, AlertTriangle, UserPlus, XCircle } from 'lucide-react';

interface PlanningListViewProps {
  visits: Visit[];
  onVisitClick?: (visit: Visit) => void;
  onVisitAction?: (
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

export const PlanningListView: React.FC<PlanningListViewProps> = ({
  visits,
  onVisitClick,
  onVisitAction,
}) => {
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

  if (visits.length === 0) {
    return (
      <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700'>
        <p className='text-gray-500 dark:text-gray-400'>
          Aucune visite trouvée pour cette période.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
          <thead className='bg-gray-50 dark:bg-gray-900/50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
              >
                Date
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
              >
                Orateur
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
              >
                Discours
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
              >
                Lieu / Hôte
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
              >
                Statut
              </th>
              <th scope='col' className='relative px-6 py-3'>
                <span className='sr-only'>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
            {visits.map((visit) => (
              <tr
                key={visit.id}
                className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer'
                onClick={() => onVisitClick?.(visit)}
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900 dark:text-white'>
                    {format(new Date(visit.visitDate), 'dd/MM/yyyy')}
                  </div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>{visit.visitTime}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-xs mr-3'>
                      {visit.nom.charAt(0)}
                    </div>
                    <div>
                      <div className='text-sm font-medium text-gray-900 dark:text-white'>
                        {visit.nom}
                      </div>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        {visit.congregation}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-900 dark:text-white'>
                    N°{visit.talkNoOrType}
                  </div>
                  <div className='text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs'>
                    {visit.talkTheme}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900 dark:text-white'>
                    {visit.locationType === 'physical' ? 'Salle du Royaume' : 'Visioconférence'}
                  </div>
                  {visit.host && (
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      Chez {visit.host}
                    </div>
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>{getStatusBadge(visit.status)}</td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <div className='flex items-center justify-end gap-2'>
                    <button
                      className='text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 p-1'
                      onClick={(e) => {
                        e.stopPropagation();
                        onVisitAction?.(visit, 'edit');
                      }}
                      title='Modifier'
                    >
                      <Edit className='w-4 h-4' />
                    </button>
                    <button
                      className='text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1'
                      onClick={(e) => {
                        e.stopPropagation();
                        onVisitAction?.(visit, 'message');
                      }}
                      title='Message'
                    >
                      <MessageSquare className='w-4 h-4' />
                    </button>
                    <button
                      className='text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 p-1'
                      onClick={(e) => {
                        e.stopPropagation();
                        onVisitAction?.(visit, 'conflict');
                      }}
                      title='Conflits'
                    >
                      <AlertTriangle className='w-4 h-4' />
                    </button>
                    <button
                      className='text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1'
                      onClick={(e) => {
                        e.stopPropagation();
                        onVisitAction?.(visit, 'replace');
                      }}
                      title='Remplacer'
                    >
                      <UserPlus className='w-4 h-4' />
                    </button>
                    <button
                      className='text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1'
                      onClick={(e) => {
                        e.stopPropagation();
                        onVisitAction?.(visit, 'cancel');
                      }}
                      title='Annuler'
                    >
                      <XCircle className='w-4 h-4' />
                    </button>
                    <button
                      className='text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1'
                      onClick={(e) => {
                        e.stopPropagation();
                        onVisitAction?.(visit, 'delete');
                      }}
                      title='Supprimer'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
