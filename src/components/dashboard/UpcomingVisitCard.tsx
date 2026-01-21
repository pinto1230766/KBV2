import React, { useMemo } from 'react';
import { Calendar, MapPin, Home, Utensils, Car } from 'lucide-react';
import { Visit } from '@/types';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UpcomingVisitCardProps {
  visit: Visit;
  onClick: () => void;
}

export const UpcomingVisitCard: React.FC<UpcomingVisitCardProps> = ({ visit, onClick }) => {
  const visitDate = new Date(visit.visitDate);
  
  const progressInfo = useMemo(() => {
    let step = 0;
    const total = 5;
    
    if (visit.status === 'confirmed') step++;
    if (visit.hostAssignments && visit.hostAssignments.length > 0) step++;
    if (visit.companions && visit.companions.length > 0) step++;
    if (visit.notes) step++;
    if (visit.status === 'completed') step = total;
    
    const messages = [
      'Premier contact à faire',
      'Hébergement à confirmer',
      'Repas à organiser',
      'Transport à planifier',
      'Rappel J-5 envoyé'
    ];
    
    return {
      step,
      total,
      message: step < total ? messages[step] || 'En cours' : 'Tout est prêt'
    };
  }, [visit]);

  const hasAccommodation = useMemo(() => {
    return visit.hostAssignments?.some(h => h.role === 'accommodation') || false;
  }, [visit.hostAssignments]);

  const hasMeals = useMemo(() => {
    return visit.hostAssignments?.some(h => h.role === 'meals') || false;
  }, [visit.hostAssignments]);

  const hasTransport = useMemo(() => {
    return visit.hostAssignments?.some(h => h.role === 'transport' || h.role === 'pickup') || false;
  }, [visit.hostAssignments]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const speakerName = visit.prenom ? `${visit.prenom} ${visit.nom}` : visit.nom;

  return (
    <button
      onClick={onClick}
      className='w-full text-left p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 group'
    >
      <div className='flex items-start gap-4'>
        {/* Avatar avec initiales */}
        <div className='flex-shrink-0'>
          <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg'>
            {getInitials(speakerName || 'OR')}
          </div>
        </div>

        {/* Contenu principal */}
        <div className='flex-1 min-w-0'>
          {/* Nom de l'orateur */}
          <h4 className='font-bold text-gray-900 dark:text-white text-sm mb-1 truncate'>
            {speakerName || 'Orateur non défini'}
          </h4>

          {/* Date, heure et lieu */}
          <div className='flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-2'>
            <span className='flex items-center gap-1'>
              <Calendar className='w-3 h-3' />
              {format(visitDate, 'd MMM yyyy', { locale: fr })}
            </span>
            <span>•</span>
            <span>{format(visitDate, 'HH:mm')}</span>
            {visit.congregation && (
              <>
                <span>•</span>
                <span className='flex items-center gap-1 truncate'>
                  <MapPin className='w-3 h-3' />
                  {visit.congregation}
                </span>
              </>
            )}
          </div>

          {/* Thème abrégé */}
          {visit.talkTheme && (
            <p className='text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-1'>
              {visit.talkTheme}
            </p>
          )}

          {/* Badges de statut */}
          <div className='flex items-center gap-2 mb-3'>
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold',
                hasAccommodation
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              )}
            >
              <Home className='w-3 h-3' />
              {hasAccommodation ? 'OK' : 'À faire'}
            </div>
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold',
                hasMeals
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
              )}
            >
              <Utensils className='w-3 h-3' />
              {hasMeals ? 'OK' : 'Repas'}
            </div>
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold',
                hasTransport
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
              )}
            >
              <Car className='w-3 h-3' />
              {hasTransport ? 'OK' : 'Transport'}
            </div>
          </div>

          {/* Indicateur de progression */}
          <div className='flex items-center gap-2'>
            <div className='flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden'>
              <div
                className='bg-blue-500 h-full transition-all duration-300'
                style={{ width: `${(progressInfo.step / progressInfo.total) * 100}%` }}
              />
            </div>
            <span className='text-[10px] font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap'>
              Étape {progressInfo.step}/{progressInfo.total}
            </span>
          </div>
          <p className='text-[10px] text-gray-500 dark:text-gray-400 mt-1'>
            {progressInfo.message}
          </p>
        </div>
      </div>
    </button>
  );
};
