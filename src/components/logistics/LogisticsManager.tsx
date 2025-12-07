import React, { useState } from 'react';
import { Logistics, Itinerary, Accommodation, ChecklistItem } from '@/types';
import { ItineraryView } from './ItineraryView';
import { AccommodationView } from './AccommodationView';
import { Checklist } from './Checklist';
import { Map, Home, CheckSquare } from 'lucide-react';

interface LogisticsManagerProps {
  logistics: Logistics | undefined;
  onUpdate: (logistics: Logistics) => void;
  readOnly?: boolean;
}

type Tab = 'itinerary' | 'accommodation' | 'checklist';

export const LogisticsManager: React.FC<LogisticsManagerProps> = ({ logistics = {}, onUpdate, readOnly = false }) => {
  const [activeTab, setActiveTab] = useState<Tab>('itinerary');

  const updateItinerary = (itinerary: Itinerary) => {
    onUpdate({ ...logistics, itinerary });
  };

  const updateAccommodation = (accommodation: Accommodation) => {
    onUpdate({ ...logistics, accommodation });
  };

  const updateChecklist = (checklist: ChecklistItem[]) => {
    onUpdate({ ...logistics, checklist });
  };

  const tabs = [
    { id: 'itinerary', label: 'Trajet', icon: Map },
    { id: 'accommodation', label: 'Hébergement', icon: Home },
    { id: 'checklist', label: 'Tâches', icon: CheckSquare },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as Tab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto min-h-[400px]">
        {activeTab === 'itinerary' && (
          <ItineraryView 
            itinerary={logistics.itinerary || { transportMode: 'car' }} 
            onUpdate={updateItinerary}
            readOnly={readOnly}
          />
        )}

        {activeTab === 'accommodation' && (
          <AccommodationView 
            accommodation={logistics.accommodation || { type: 'host', name: '' }} 
            onUpdate={updateAccommodation}
            readOnly={readOnly}
          />
        )}

        {activeTab === 'checklist' && (
          <Checklist 
            items={logistics.checklist || []} 
            onUpdate={updateChecklist}
          />
        )}
      </div>
    </div>
  );
};
