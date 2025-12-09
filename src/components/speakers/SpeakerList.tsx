import React, { useState } from 'react';
import { Speaker } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Edit, Trash2, Phone, Mail, Car, Search } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { useData } from '@/contexts/DataContext';
import { calculateWorkload } from '@/utils/workload';
import { WorkloadIndicator } from '@/components/workload/WorkloadIndicator';

interface SpeakerListProps {
  speakers: Speaker[];
  onEdit: (speaker: Speaker) => void;
  onDelete: (id: string) => void;
}

export const SpeakerList: React.FC<SpeakerListProps> = ({ speakers, onEdit, onDelete }) => {
  const { visits } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpeakers = speakers.filter(speaker =>
    speaker.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.congregation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un orateur..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpeakers.map((speaker) => (
          <Card key={speaker.id} hoverable>
            <CardBody className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                    {speaker.nom.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{speaker.nom}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{speaker.congregation}</p>
                    <WorkloadIndicator workload={calculateWorkload(speaker, visits)} size="sm" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(speaker)} aria-label="Modifier l'orateur">
                    <Edit className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(speaker.id)} aria-label="Supprimer l'orateur">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {speaker.telephone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${speaker.telephone}`} className="hover:text-primary-600">
                      {speaker.telephone}
                    </a>
                  </div>
                )}
                {speaker.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${speaker.email}`} className="hover:text-primary-600 truncate">
                      {speaker.email}
                    </a>
                  </div>
                )}
                {speaker.isVehiculed && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Car className="w-4 h-4" />
                    <span>Véhiculé</span>
                  </div>
                )}
              </div>

              {speaker.talkHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dernier discours :
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">N°{speaker.talkHistory[0].talkNo} - {speaker.talkHistory[0].talkTheme}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(speaker.talkHistory[0].date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              )}
              {speaker.talkHistory.length === 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500">
                  Aucune visite enregistrée
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredSpeakers.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Aucun orateur trouvé
        </div>
      )}
    </div>
  );
};
