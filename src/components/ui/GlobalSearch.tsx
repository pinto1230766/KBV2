import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Search,
  X,
  User,
  Calendar,
  Home,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { Speaker, Host, Visit } from '@/types';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface SearchResult {
  id: string;
  type: 'speaker' | 'host' | 'visit';
  title: string;
  subtitle: string;
  description: string;
  metadata?: {
    date?: string;
    time?: string;
    status?: string;
    location?: string;
  };
  entity: Speaker | Host | Visit;
  relevanceScore: number;
}

const RESULT_ICONS = {
  speaker: User,
  host: Home,
  visit: Calendar,
};

const RESULT_COLORS = {
  speaker: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40',
  host: 'text-green-600 bg-green-100 dark:bg-green-900/40',
  visit: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40',
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const { visits, speakers, hosts, archivedVisits } = useData();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (isOpen) {
      setQuery(initialQuery);
    }
  }, [isOpen, initialQuery]);

  const searchResults = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search Speakers
    speakers.forEach((speaker) => {
      const matches = [
        speaker.nom.toLowerCase().includes(searchTerm),
        speaker.congregation.toLowerCase().includes(searchTerm),
        speaker.telephone?.toLowerCase().includes(searchTerm),
        speaker.email?.toLowerCase().includes(searchTerm),
        speaker.notes?.toLowerCase().includes(searchTerm),
        speaker.tags?.some(tag => tag.toLowerCase().includes(searchTerm)),
      ].filter(Boolean).length;

      if (matches > 0) {
        results.push({
          id: speaker.id,
          type: 'speaker',
          title: speaker.nom,
          subtitle: speaker.congregation,
          description: [
            speaker.telephone && `📞 ${speaker.telephone}`,
            speaker.email && `✉️ ${speaker.email}`,
            speaker.tags && speaker.tags.length > 0 && `🏷️ ${speaker.tags.join(', ')}`,
          ].filter(Boolean).join(' • '),
          entity: speaker,
          relevanceScore: matches,
        });
      }
    });

    // Search Hosts
    hosts.forEach((host) => {
      const matches = [
        host.nom.toLowerCase().includes(searchTerm),
        host.telephone?.toLowerCase().includes(searchTerm),
        host.email?.toLowerCase().includes(searchTerm),
        host.address?.toLowerCase().includes(searchTerm),
        host.notes?.toLowerCase().includes(searchTerm),
        host.tags?.some(tag => tag.toLowerCase().includes(searchTerm)),
      ].filter(Boolean).length;

      if (matches > 0) {
        results.push({
          id: host.nom, // hosts don't have ID, use name
          type: 'host',
          title: host.nom,
          subtitle: 'Contact d\'accueil',
          description: [
            host.telephone && `📞 ${host.telephone}`,
            host.email && `✉️ ${host.email}`,
            host.address && `📍 ${host.address}`,
          ].filter(Boolean).join(' • '),
          entity: host,
          relevanceScore: matches,
        });
      }
    });

    // Search Visits (current + archived)
    const allVisits = [...visits, ...archivedVisits];
    allVisits.forEach((visit) => {
      const matches = [
        visit.nom.toLowerCase().includes(searchTerm),
        visit.congregation.toLowerCase().includes(searchTerm),
        visit.host.toLowerCase().includes(searchTerm),
        visit.talkNoOrType?.toLowerCase().includes(searchTerm),
        visit.talkTheme?.toLowerCase().includes(searchTerm),
        visit.notes?.toLowerCase().includes(searchTerm),
        visit.visitDate.includes(searchTerm),
      ].filter(Boolean).length;

      if (matches > 0) {
        results.push({
          id: visit.visitId,
          type: 'visit',
          title: `${visit.nom} - ${visit.talkNoOrType || 'Discours'}`,
          subtitle: visit.congregation,
          description: `🏠 ${visit.host} • ${new Date(visit.visitDate).toLocaleDateString('fr-FR')} à ${visit.visitTime}`,
          metadata: {
            date: visit.visitDate,
            time: visit.visitTime,
            status: visit.status,
            location: visit.locationType,
          },
          entity: visit,
          relevanceScore: matches,
        });
      }
    });

    // Sort by relevance score descending
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 50);
  }, [query, speakers, hosts, visits, archivedVisits]);

  const groupedResults = useMemo(() => {
    const grouped: Record<string, SearchResult[]> = {
      speaker: [],
      host: [],
      visit: [],
    };

    searchResults.forEach((result) => {
      grouped[result.type].push(result);
    });

    return grouped;
  }, [searchResults]);

  const handleResultClick = useCallback((result: SearchResult) => {
    switch (result.type) {
      case 'speaker':
        navigate('/speakers', { state: { selectedSpeaker: result.entity } });
        break;
      case 'host':
        navigate('/speakers', { state: { selectedHost: result.entity } });
        break;
      case 'visit':
        navigate('/planning', { state: { selectedVisit: result.entity } });
        break;
    }
    onClose();
  }, [navigate, onClose]);



  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'warning' as const, label: 'En attente' },
      confirmed: { variant: 'success' as const, label: 'Confirmée' },
      completed: { variant: 'default' as const, label: 'Terminée' },
      cancelled: { variant: 'danger' as const, label: 'Annulée' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? (
      <Badge variant={config.variant} className='text-[10px] px-2 py-0.5'>
        {config.label}
      </Badge>
    ) : null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=''
      size='xl'
      hideCloseButton
      padding='none'
      className='max-sm:rounded-none overflow-hidden border-none'
    >
      <div className='flex flex-col max-h-[90vh] bg-white dark:bg-gray-900 overflow-hidden rounded-3xl'>
        {/* Header */}
        <div className='p-6 border-b border-gray-100 dark:border-gray-800'>
          <div className='flex items-center gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Rechercher orateurs, visites, contacts...'
                className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-lg focus:ring-4 focus:ring-primary-500/10 transition-all font-medium placeholder:text-gray-400'
              />
            </div>
            <button
              onClick={onClose}
              className='p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className='flex-1 overflow-y-auto p-6 space-y-8'>
          {query.trim() && (
            <>
              {searchResults.length === 0 ? (
                <div className='text-center py-20'>
                  <Search className='w-16 h-16 mx-auto mb-6 text-gray-200 dark:text-gray-700' />
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                    Aucun résultat
                  </h3>
                  <p className='text-gray-500 dark:text-gray-400'>
                    Essayez avec des termes différents ou vérifiez l'orthographe.
                  </p>
                </div>
              ) : (
                <>
                  {Object.entries(groupedResults).map(([type, results]) => {
                    if (results.length === 0) return null;

                    const Icon = RESULT_ICONS[type as keyof typeof RESULT_ICONS];
                    const colorClass = RESULT_COLORS[type as keyof typeof RESULT_COLORS];

                    return (
                      <div key={type} className='animate-in fade-in slide-in-from-top-4 duration-300'>
                        <div className='flex items-center gap-3 mb-4'>
                          <div className={cn('p-2 rounded-xl', colorClass)}>
                            <Icon className='w-4 h-4' />
                          </div>
                          <h4 className='text-sm font-black text-gray-400 uppercase tracking-widest'>
                            {type === 'speaker' ? 'Orateurs' :
                             type === 'host' ? 'Contacts d\'accueil' :
                             'Visites'} ({results.length})
                          </h4>
                        </div>
                        <div className='space-y-3'>
                          {results.map((result) => (
                            <Card
                              key={`${result.type}-${result.id}`}
                              hoverable
                              onClick={() => handleResultClick(result)}
                              className='border-none shadow-sm outline outline-1 outline-gray-100 dark:outline-gray-800 hover:outline-primary-500 group'
                            >
                              <CardBody className='p-4'>
                                <div className='flex items-start gap-4'>
                                  <div className={cn('p-3 rounded-2xl flex-shrink-0', colorClass)}>
                                    <Icon className='w-5 h-5' />
                                  </div>
                                  <div className='flex-1 min-w-0'>
                                    <div className='flex items-start justify-between gap-4 mb-1'>
                                      <h4 className='font-bold text-gray-900 dark:text-white text-sm truncate'>
                                        {result.title}
                                      </h4>
                                      {result.metadata?.status && getStatusBadge(result.metadata.status)}
                                    </div>
                                    <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>
                                      {result.subtitle}
                                    </p>
                                    <p className='text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2'>
                                      {result.description}
                                    </p>
                                    {result.metadata && (
                                      <div className='flex items-center gap-3 text-[10px] text-gray-400'>
                                        {result.metadata.date && (
                                          <span className='flex items-center gap-1'>
                                            <Calendar className='w-3 h-3' />
                                            {new Date(result.metadata.date).toLocaleDateString('fr-FR')}
                                          </span>
                                        )}
                                        {result.metadata.time && (
                                          <span className='flex items-center gap-1'>
                                            <Clock className='w-3 h-3' />
                                            {result.metadata.time}
                                          </span>
                                        )}
                                        {result.metadata.location && (
                                          <span className='flex items-center gap-1'>
                                            <MapPin className='w-3 h-3' />
                                            {result.metadata.location}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <ArrowRight className='w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1' />
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className='p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800'>
          <div className='flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest'>
            <span>Appuyez sur Échap pour fermer</span>
            <span>KBV Manager • Recherche globale</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};