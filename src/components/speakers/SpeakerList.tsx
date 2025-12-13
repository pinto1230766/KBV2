import React, { useState } from 'react';
import { Speaker, Visit } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Edit, Trash2, Phone, Mail, Car, Search, Star, SortAsc, Users, Filter } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { useData } from '@/contexts/DataContext';
import { calculateWorkload } from '@/utils/workload';
import { WorkloadIndicator } from '@/components/workload/WorkloadIndicator';

interface SpeakerListProps {
  speakers: Speaker[];
  onEdit: (speaker: Speaker) => void;
  onDelete: (id: string) => void;
  onFeedback: (visit: Visit) => void;
}

export const SpeakerList: React.FC<SpeakerListProps> = ({ speakers, onEdit, onDelete, onFeedback }) => {
  const { visits } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'congregation'>('name');
  const [congregationFilter, setCongregationFilter] = useState<string>('all');

  // Fonction de normalisation des noms de congrégations
  const normalizeCongregationName = (name: string): string => {
    const normalized = name.toLowerCase().trim();
    // Mapping des congrégations similaires
    const congregationMap: Record<string, string> = {
      'lyon': 'Lyon KBV',
      'lyon kbv': 'Lyon KBV',
      'creil': 'Creil KBV',
      'creil kbv': 'Creil KBV',
      'villiers kbv': 'Villiers-sur-Marne',
      'villiers-sur-marne': 'Villiers-sur-Marne',
      'st denis kbv': 'St Denis KBV',
      'st denis': 'St Denis KBV',
      'marseille kbv': 'Marseille KBV',
      'marseille': 'Marseille KBV',
      'cannes kbv': 'Cannes KBV',
      'nice kbv': 'Nice KBV',
      'plaisir kbv': 'Plaisir KBV',
      'ettelbruck kbv': 'Ettelbruck KBV',
      'steinsel kbv': 'Steinsel KBV',
      'porto kbv': 'Porto KBV',
      'albufeira kbv': 'Albufeira KBV',
      'rotterdam kbv': 'Rotterdam KBV'
    };

    return congregationMap[normalized] || name;
  };

  // Obtenir la liste unique des congrégations normalisées pour le filtre
  const uniqueCongregations = Array.from(new Set(speakers.map(s => normalizeCongregationName(s.congregation))))
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const filteredAndSortedSpeakers = speakers
    .filter(speaker => {
      // Filtre par congrégation spécifique (utilise la normalisation)
      const normalizedCongregation = normalizeCongregationName(speaker.congregation);
      const matchesCongregation = congregationFilter === 'all' || normalizedCongregation === congregationFilter;
      // Filtre par recherche
      const matchesSearch = speaker.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           speaker.congregation.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCongregation && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'congregation') {
        // Trier d'abord par congrégation, puis par nom
        const congA = a.congregation.toLowerCase();
        const congB = b.congregation.toLowerCase();
        if (congA !== congB) {
          return congA.localeCompare(congB);
        }
      }
      // Trier par nom (alphabetique)
      return a.nom.toLowerCase().localeCompare(b.nom.toLowerCase());
    });

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

      {/* Contrôles de tri et filtrage */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Boutons de tri */}
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'name' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSortBy('name')}
            leftIcon={<SortAsc className="w-4 h-4" />}
          >
            Trier par nom
          </Button>
          <Button
            variant={sortBy === 'congregation' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSortBy('congregation')}
            leftIcon={<Users className="w-4 h-4" />}
          >
            Trier par congrégation
          </Button>
        </div>

        {/* Filtre par congrégation */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={congregationFilter}
            onChange={(e) => setCongregationFilter(e.target.value)}
            title="Filtrer par congrégation"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Toutes les congrégations</option>
            {uniqueCongregations.map(congregation => (
              <option key={congregation} value={congregation}>
                {congregation}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedSpeakers.map((speaker) => {
          const lastTalk = speaker.talkHistory[0];
          const lastVisit = lastTalk ? visits.find(v => v.visitId === lastTalk.visitId) : undefined;

          return (
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

              {lastTalk && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Dernier discours :
                    </p>
                    {lastVisit && new Date(lastVisit.visitDate) < new Date() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onFeedback(lastVisit)}
                        leftIcon={<Star className="w-3 h-3" />}
                      >
                        Évaluer
                      </Button>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">N°{lastTalk.talkNo} - {lastTalk.talkTheme}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(lastTalk.date).toLocaleDateString('fr-FR')}</p>
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
        );
      })}
      </div>

      {filteredAndSortedSpeakers.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Aucun orateur trouvé
        </div>
      )}
    </div>
  );
};
