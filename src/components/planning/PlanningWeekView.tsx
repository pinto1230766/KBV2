import React, { useMemo } from 'react';
import { Visit } from '@/types';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { getVisitKey } from '@/utils/visitKey';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PlanningWeekViewProps {
  visits: Visit[];
  onVisitClick?: (visit: Visit) => void;
}

export const PlanningWeekView: React.FC<PlanningWeekViewProps> = ({ visits, onVisitClick }) => {
  const [currentWeek, setCurrentWeek] = React.useState(new Date());

  // Calculer le début de la semaine (lundi)
  const weekStart = useMemo(() => startOfWeek(currentWeek, { weekStartsOn: 1 }), [currentWeek]);

  // Générer les 7 jours de la semaine
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // Grouper les visites par jour
  const visitsByDay = useMemo(() => {
    const grouped: { [key: string]: Visit[] } = {};

    weekDays.forEach((day) => {
      const dayKey = format(day, 'yyyy-MM-dd');
      grouped[dayKey] = visits
        .filter((visit) => isSameDay(new Date(visit.visitDate), day))
        .sort((a, b) => a.visitTime.localeCompare(b.visitTime));
    });

    return grouped;
  }, [visits, weekDays]);

  const goToPreviousWeek = () => {
    setCurrentWeek((prev) => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeek((prev) => addDays(prev, 7));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
      case 'pending':
        return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
    }
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
      {/* Header avec navigation */}
      <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            {format(weekStart, 'MMMM yyyy', { locale: fr })}
          </h3>
          <div className='flex items-center gap-2'>
            <Button
              variant='secondary'
              size='sm'
              onClick={goToToday}
              leftIcon={<Calendar className='w-4 h-4' />}
            >
              Aujourd'hui
            </Button>
            <div className='flex gap-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={goToPreviousWeek}
                title='Semaine précédente'
              >
                <ChevronLeft className='w-4 h-4' />
              </Button>
              <Button variant='ghost' size='sm' onClick={goToNextWeek} title='Semaine suivante'>
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Grille hebdomadaire */}
      <div className='grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-700'>
        {weekDays.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayVisits = visitsByDay[dayKey] || [];
          const today = isToday(day);

          return (
            <div
              key={dayKey}
              className={`min-h-[400px] ${today ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
            >
              {/* En-tête du jour */}
              <div
                className={`p-3 border-b border-gray-200 dark:border-gray-700 ${today ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-50 dark:bg-gray-900/50'}`}
              >
                <div className='text-center'>
                  <div
                    className={`text-xs font-medium uppercase ${today ? 'text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    {format(day, 'EEE', { locale: fr })}
                  </div>
                  <div
                    className={`text-xl font-bold mt-1 ${today ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-white'}`}
                  >
                    {format(day, 'd')}
                  </div>
                  {dayVisits.length > 0 && (
                    <Badge variant='default' size='sm' className='mt-1'>
                      {dayVisits.length}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Visites du jour */}
              <div className='p-2 space-y-2'>
                {dayVisits.map((visit, index) => {
                  const visitKey = getVisitKey(visit, index);
                  return (
                    <div
                      key={visitKey}
                      onClick={() => onVisitClick?.(visit)}
                      className={`p-2 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getStatusColor(visit.status)}`}
                    >
                      <div className='text-xs font-medium text-gray-900 dark:text-white mb-1'>
                        {new Date(visit.visitDate) >= new Date('2026-01-19') ? '11:30' : visit.visitTime}
                      </div>
                      <div className='text-sm font-semibold text-gray-900 dark:text-white line-clamp-1'>
                        {visit.nom}
                      </div>
                      <div className='text-xs text-gray-600 dark:text-gray-400 line-clamp-1'>
                        {visit.congregation}
                      </div>
                      {visit.talkNoOrType && (
                        <div className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                          <div className='font-medium'>N°{visit.talkNoOrType}</div>
                          {visit.talkTheme && <div className='line-clamp-1'>{visit.talkTheme}</div>}
                        </div>
                      )}
                      {visit.host && (
                        <div className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                          🏠 {visit.host}
                        </div>
                      )}
                    </div>
                  );
                })}

                {dayVisits.length === 0 && (
                  <div className='text-center py-8 text-gray-400 dark:text-gray-600'>
                    <Calendar className='w-8 h-8 mx-auto mb-2 opacity-30' />
                    <p className='text-xs'>Aucune visite</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className='p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'>
        <div className='flex flex-wrap gap-4 text-xs'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded bg-green-200 dark:bg-green-900 border border-green-300 dark:border-green-700'></div>
            <span className='text-gray-600 dark:text-gray-400'>Confirmé</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded bg-orange-200 dark:bg-orange-900 border border-orange-300 dark:border-orange-700'></div>
            <span className='text-gray-600 dark:text-gray-400'>En attente</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-700'></div>
            <span className='text-gray-600 dark:text-gray-400'>Terminé</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded bg-red-200 dark:bg-red-900 border border-red-300 dark:border-red-700'></div>
            <span className='text-gray-600 dark:text-gray-400'>Annulé</span>
          </div>
        </div>
      </div>
    </div>
  );
};
