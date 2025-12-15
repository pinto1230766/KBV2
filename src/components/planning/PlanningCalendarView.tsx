import React, { useState } from 'react';
import { Visit } from '@/types';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PlanningCalendarViewProps {
  visits: Visit[];
  onVisitClick?: (visit: Visit) => void;
}

export const PlanningCalendarView: React.FC<PlanningCalendarViewProps> = ({ visits, onVisitClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: fr });
  const endDate = endOfWeek(monthEnd, { locale: fr });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const getVisitsForDay = (date: Date) => visits.filter(visit => isSameDay(new Date(visit.visitDate), date));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            aria-label="Mois précédent"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={today}
            className="px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-md"
          >
            Aujourd'hui
          </button>
          <button
            onClick={nextMonth}
            aria-label="Mois suivant"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 dark:bg-gray-700 gap-px">
        {calendarDays.map((day) => {
          const dayVisits = getVisitsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);

          return (
            <div 
              key={day.toString()} 
              className={`
                min-h-[120px] bg-white dark:bg-gray-800 p-2 transition-colors
                ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600' : ''}
                ${isCurrentDay ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span 
                  className={`
                    text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                    ${isCurrentDay 
                      ? 'bg-primary-600 text-white' 
                      : isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
                    }
                  `}
                >
                  {format(day, 'd')}
                </span>
                {dayVisits.length > 0 && (
                  <span className="text-xs font-medium text-gray-400">
                    {dayVisits.length}
                  </span>
                )}
              </div>

              <div className="space-y-1 mt-1">
                {dayVisits.map((visit) => (
                  <button
                    key={visit.id}
                    onClick={() => onVisitClick?.(visit)}
                    className={`
                      w-full text-left px-2 py-1 rounded text-xs font-medium truncate transition-colors
                      ${visit.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50' 
                        : visit.status === 'pending'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    {visit.visitTime} - {visit.nom}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
