import { memo } from 'react';
import { Visit } from '@/types';
import { ChevronRight, CheckCircle2, AlertCircle, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DashboardVisitItemProps {
  visit: Visit;
  onClick?: () => void;
}

/**
 * Enhanced Visit Item for Dashboard 2.0
 * Affiche une visite de manière élégante avec initiale, status et infos concises
 */
export const DashboardVisitItem = memo<DashboardVisitItemProps>(({ visit, onClick }) => {
  const isPending = visit.status === 'pending';
  const isConfirmed = visit.communicationStatus?.confirmation?.speaker;
  const hasHosts = visit.hostAssignments && visit.hostAssignments.length > 0;

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
        <p className='text-[11px] text-gray-500 font-medium lowercase mb-1'>
          {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
          })}
        </p>
        
        {/* Infos concises */}
        <div className='flex items-center gap-3 text-[10px]'>
          {/* Statut confirmation */}
          <span className={cn(
            'flex items-center gap-1 font-medium',
            isConfirmed ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'
          )}>
            {isConfirmed ? (
              <><CheckCircle2 className='w-3 h-3' /> Confirmé</>
            ) : (
              <><AlertCircle className='w-3 h-3' /> En attente</>
            )}
          </span>
          
          {/* Hôtes assignés */}
          {hasHosts && (
            <span className='flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium'>
              <Home className='w-3 h-3' />
              {visit.hostAssignments?.length} hôte(s)
            </span>
          )}
        </div>
      </div>

      <ChevronRight className='w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all' />
    </div>
  );
});

DashboardVisitItem.displayName = 'DashboardVisitItem';
