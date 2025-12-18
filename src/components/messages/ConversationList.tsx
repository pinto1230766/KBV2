import React, { useState } from 'react';
import { Speaker, Visit } from '@/types';
import { ConversationItem } from './ConversationItem';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';

interface ConversationListProps {
  speakers: Speaker[];
  visits: Visit[];
  activeSpeakerId?: string;
  onSelectSpeaker: (speakerId: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  speakers,
  visits,
  activeSpeakerId,
  onSelectSpeaker,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Associer la dernière visite à chaque orateur pour le tri et l'affichage
  const speakersWithVisits = speakers.map((speaker) => {
    const speakerVisits = visits
      .filter((v) => v.id === speaker.id || v.nom === speaker.nom) // Fallback sur le nom si l'ID manque
      .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

    return {
      speaker,
      lastVisit: speakerVisits[0],
    };
  });

  const filteredSpeakers = speakersWithVisits.filter(
    ({ speaker }) =>
      speaker.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.congregation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'>
      <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
        <Input
          placeholder='Rechercher...'
          leftIcon={<Search className='w-4 h-4' />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='flex-1 overflow-y-auto'>
        {filteredSpeakers.length > 0 ? (
          filteredSpeakers.map(({ speaker, lastVisit }) => (
            <ConversationItem
              key={speaker.id}
              speaker={speaker}
              lastVisit={lastVisit}
              isActive={activeSpeakerId === speaker.id}
              onClick={() => onSelectSpeaker(speaker.id)}
            />
          ))
        ) : (
          <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
            Aucun orateur trouvé
          </div>
        )}
      </div>
    </div>
  );
};
