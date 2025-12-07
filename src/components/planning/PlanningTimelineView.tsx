import React from 'react';
import { Visit } from '@/types';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, User, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface PlanningTimelineViewProps {
  visits: Visit[];
}

export const PlanningTimelineView: React.FC<PlanningTimelineViewProps> = ({ visits }) => {
  if (visits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Aucune visite à afficher dans la chronologie.
      </div>
    );
  }

  // Grouper par mois
  const groupedVisits = visits.reduce((acc, visit) => {
    const date = parseISO(visit.visitDate);
    const key = format(date, 'yyyy-MM', { locale: fr });
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(visit);
    return acc;
  }, {} as Record<string, Visit[]>);

  const sortedMonthKeys = Object.keys(groupedVisits).sort();

  return (
    <div className="relative space-y-8 p-4">
      {/* Ligne verticale centralisée */}
      <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 -ml-[1px]" />

      {sortedMonthKeys.map((monthKey) => (
        <div key={monthKey} className="relative">
          {/* En-tête de mois */}
          <div className="flex justify-center mb-6 relative z-10">
            <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-4 py-1 rounded-full text-sm font-semibold border-4 border-white dark:border-gray-900">
              {format(parseISO(`${monthKey}-01`), 'MMMM yyyy', { locale: fr })}
            </span>
          </div>

          <div className="space-y-6">
            {groupedVisits[monthKey].map((visit, index) => {
              const date = parseISO(visit.visitDate);
              const isLeft = index % 2 === 0;

              return (
                <div key={visit.id} className={`flex flex-col md:flex-row items-center gap-4 md:gap-8 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Contenu (Carte) */}
                  <div className="w-full md:w-1/2 pl-8 md:pl-0">
                    <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-primary-500">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-sm text-primary-600 font-medium">
                          <Calendar className="w-4 h-4" />
                          {format(date, 'EEEE d', { locale: fr })}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          visit.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          visit.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {visit.status === 'confirmed' ? 'Confirmé' : visit.status === 'pending' ? 'En attente' : visit.status}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{visit.nom}</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {visit.congregation}
                        </div>
                        <div className="flex items-center gap-2">
                           <User className="w-3 h-3" />
                           {visit.talkNoOrType ? `Discours n°${visit.talkNoOrType}` : 'Pas de discours'}
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock className="w-3 h-3" />
                           {visit.visitTime}
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Point central */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary-500 rounded-full md:-ml-2 border-4 border-white dark:border-gray-900 shadow-sm z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>

                  {/* Espace vide pour l'équilibrage */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
