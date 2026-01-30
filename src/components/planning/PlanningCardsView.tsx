import React from 'react';
import { Visit } from '@/types';
import { VisitCard } from '@/components/visits/VisitCard/VisitCard';
import { getVisitKey } from '@/utils/visitKey';

interface PlanningCardsViewProps {
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
      | 'quick_message',
    messageType?: string
  ) => void;
}

export const PlanningCardsView: React.FC<PlanningCardsViewProps> = ({
  visits,
  onVisitClick,
  onVisitAction,
}) => {
  if (visits.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500 dark:text-gray-400'>
          Aucune visite trouvée pour cette période.
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {visits.map((visit, index) => {
        const visitKey = getVisitKey(visit, index);
        return (
          <VisitCard
            key={visitKey}
            visit={visit}
            onClick={() => onVisitClick?.(visit)}
            onAction={onVisitAction}
          />
        );
      })}
    </div>
  );
};
