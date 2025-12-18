import React, { useState, useMemo } from 'react';
import { Archive, Search, Calendar, RotateCcw, Trash2, Download } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Visit } from '@/types';
import { useData } from '@/contexts/DataContext';

interface ArchiveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (visitIds: string[]) => void;
  onDelete: (visitIds: string[]) => void;
  onExport: (visitIds: string[]) => void;
}

export const ArchiveManagerModal: React.FC<ArchiveManagerModalProps> = ({
  isOpen,
  onClose,
  onRestore,
  onDelete,
  onExport,
}) => {
  const { archivedVisits } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<Visit['status'] | 'all'>('all');
  const [selectedVisits, setSelectedVisits] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'date' | 'speaker' | 'congregation'>('date');

  // Années disponibles
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    archivedVisits.forEach((visit) => {
      const year = new Date(visit.visitDate).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [archivedVisits]);

  // Filtrer et trier les visites
  const filteredVisits = useMemo(() => {
    const filtered = archivedVisits.filter((visit) => {
      // Recherche
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !visit.nom.toLowerCase().includes(search) &&
          !visit.congregation.toLowerCase().includes(search) &&
          !visit.talkTheme?.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      // Année
      if (selectedYear !== 'all') {
        const year = new Date(visit.visitDate).getFullYear();
        if (year !== selectedYear) return false;
      }

      // Statut
      if (selectedStatus !== 'all' && visit.status !== selectedStatus) {
        return false;
      }

      return true;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
        case 'speaker':
          return a.nom.localeCompare(b.nom);
        case 'congregation':
          return a.congregation.localeCompare(b.congregation);
        default:
          return 0;
      }
    });

    return filtered;
  }, [archivedVisits, searchTerm, selectedYear, selectedStatus, sortBy]);

  const toggleVisit = (visitId: string) => {
    setSelectedVisits((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(visitId)) {
        newSet.delete(visitId);
      } else {
        newSet.add(visitId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedVisits(new Set(filteredVisits.map((v) => v.visitId)));
  };

  const deselectAll = () => {
    setSelectedVisits(new Set());
  };

  const handleRestore = () => {
    if (selectedVisits.size > 0) {
      onRestore(Array.from(selectedVisits));
      setSelectedVisits(new Set());
    }
  };

  const handleDelete = () => {
    if (selectedVisits.size > 0) {
      if (
        confirm(
          `⚠️ Êtes-vous sûr de vouloir supprimer définitivement ${selectedVisits.size} visite(s) ?`
        )
      ) {
        onDelete(Array.from(selectedVisits));
        setSelectedVisits(new Set());
      }
    }
  };

  const handleExport = () => {
    if (selectedVisits.size > 0) {
      onExport(Array.from(selectedVisits));
    }
  };

  const getStatusBadge = (status: Visit['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant='success'>Terminé</Badge>;
      case 'cancelled':
        return <Badge variant='danger'>Annulé</Badge>;
      default:
        return <Badge variant='default'>{status}</Badge>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Gestion des archives' size='xl'>
      <div className='space-y-6'>
        {/* Statistiques */}
        <div className='grid grid-cols-4 gap-4'>
          <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-blue-600'>{archivedVisits.length}</div>
            <div className='text-sm text-blue-800 dark:text-blue-300'>Total</div>
          </div>
          <div className='p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-green-600'>
              {archivedVisits.filter((v) => v.status === 'completed').length}
            </div>
            <div className='text-sm text-green-800 dark:text-green-300'>Terminées</div>
          </div>
          <div className='p-3 bg-red-50 dark:bg-red-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-red-600'>
              {archivedVisits.filter((v) => v.status === 'cancelled').length}
            </div>
            <div className='text-sm text-red-800 dark:text-red-300'>Annulées</div>
          </div>
          <div className='p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-purple-600'>{selectedVisits.size}</div>
            <div className='text-sm text-purple-800 dark:text-purple-300'>Sélectionnées</div>
          </div>
        </div>

        {/* Filtres */}
        <div className='space-y-3'>
          {/* Recherche */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Rechercher par orateur, congrégation ou discours...'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>

          {/* Filtres rapides */}
          <div className='flex gap-3 flex-wrap'>
            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              aria-label='Filtrer par année'
              className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            >
              <option value='all'>Toutes les années</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              aria-label='Filtrer par statut'
              className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            >
              <option value='all'>Tous les statuts</option>
              <option value='completed'>Terminées</option>
              <option value='cancelled'>Annulées</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label='Trier les archives'
              className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            >
              <option value='date'>Trier par date</option>
              <option value='speaker'>Trier par orateur</option>
              <option value='congregation'>Trier par congrégation</option>
            </select>

            <div className='flex-1'></div>

            <Button variant='outline' size='sm' onClick={selectAll}>
              Tout sélectionner
            </Button>
            <Button variant='outline' size='sm' onClick={deselectAll}>
              Tout désélectionner
            </Button>
          </div>
        </div>

        {/* Liste des archives */}
        <div className='space-y-2 max-h-96 overflow-y-auto'>
          {filteredVisits.length === 0 ? (
            <div className='text-center py-12'>
              <Archive className='w-16 h-16 mx-auto mb-4 text-gray-400' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Aucune archive trouvée
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>Modifiez vos critères de recherche</p>
            </div>
          ) : (
            filteredVisits.map((visit) => (
              <Card
                key={visit.visitId}
                hoverable
                className={`cursor-pointer transition-all ${
                  selectedVisits.has(visit.visitId)
                    ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : ''
                }`}
                onClick={() => toggleVisit(visit.visitId)}
              >
                <CardBody>
                  <div className='flex items-center gap-4'>
                    <input
                      type='checkbox'
                      checked={selectedVisits.has(visit.visitId)}
                      onChange={() => toggleVisit(visit.visitId)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Sélectionner ${visit.nom}`}
                      className='w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                    />

                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h4 className='font-semibold text-gray-900 dark:text-white'>{visit.nom}</h4>
                        {getStatusBadge(visit.status)}
                      </div>
                      <div className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                        <p>
                          <Calendar className='w-3 h-3 inline mr-1' />
                          {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                        <p>{visit.congregation}</p>
                        {visit.talkTheme && (
                          <p className='text-xs'>
                            {visit.talkNoOrType} - {visit.talkTheme}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Actions */}
        <div className='flex gap-3 justify-between pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button variant='secondary' onClick={onClose}>
            Fermer
          </Button>

          {selectedVisits.size > 0 && (
            <div className='flex gap-3'>
              <Button variant='outline' onClick={handleExport}>
                <Download className='w-4 h-4 mr-2' />
                Exporter ({selectedVisits.size})
              </Button>
              <Button variant='danger' onClick={handleDelete}>
                <Trash2 className='w-4 h-4 mr-2' />
                Supprimer ({selectedVisits.size})
              </Button>
              <Button variant='primary' onClick={handleRestore}>
                <RotateCcw className='w-4 h-4 mr-2' />
                Restaurer ({selectedVisits.size})
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
