import { memo } from 'react';
import { Visit } from '@/types';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DashboardVisitItemProps {
  visit: Visit;
  onClick?: () => void;
}

/**
 * Enhanced Visit Item for Dashboard 2.0
 * Affiche une visite de manière élégante avec initiale et status badge
 */
export const DashboardVisitItem = memo<DashboardVisitItemProps>(({ visit, onClick }) => {
  const isPending = visit.status === 'pending';

  return (
    <div
      onClick={onClick}
      className='group flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/40 border border-transparent hover:border-primary-500/30 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer'
    >
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 transition-transform group-hover:scale-110',
          isPending
            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30'
            : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30'
        )}
      >
        {visit.nom.charAt(0).toUpperCase()}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between mb-0.5'>
          <h4 className='font-bold text-sm text-gray-900 dark:text-white truncate uppercase tracking-tight'>
            {visit.nom}
          </h4>
          <span className='text-[10px] font-bold text-gray-400 uppercase'>{visit.visitTime}</span>
        </div>
        <p className='text-[11px] text-gray-500 font-medium lowercase'>
          {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
          })}
        </p>
      </div>

      <ChevronRight className='w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all' />
    </div>
  );
});

DashboardVisitItem.displayName = 'DashboardVisitItem';
