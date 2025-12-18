import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { usePlatformContext } from '@/contexts/PlatformContext';
import { MessageThread } from '@/components/messages/MessageThread';
import { MessageGeneratorModal } from '@/components/messages/MessageGeneratorModal';
import { HostRequestModal } from '@/components/messages/HostRequestModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { MessageSquare, Search, Plus, CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';
import { Speaker, Visit } from '@/types';

export const Messages: React.FC = () => {
  const { visits, speakers, updateVisit, refreshData } = useData();
  const { isPhoneS25Ultra } = usePlatformContext();

  // Mettre à jour les titres manquants au chargement
  React.useEffect(() => {
    if (refreshData) {
      refreshData();
    }
  }, []);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [isHostRequestModalOpen, setIsHostRequestModalOpen] = useState(false);
  const [generatorVisit, setGeneratorVisit] = useState<Visit | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'pending'>('all');

  // Generate conversations from visits (sans doublons)
  const conversations = useMemo(() => {
    const convos: { speaker: Speaker; visits: Visit[] }[] = [];
    const seenSpeakers = new Set<string>();

    // Group visits by speaker (éviter les doublons)
    speakers.forEach((speaker) => {
      // Utiliser l'ID comme clé unique
      if (!seenSpeakers.has(speaker.id)) {
        seenSpeakers.add(speaker.id);
        const speakerVisits = visits.filter((visit) => visit.id === speaker.id);
        if (speakerVisits.length > 0) {
          convos.push({ speaker, visits: speakerVisits });
        }
      }
    });

    return convos;
  }, [visits, speakers]);

  // Filtered conversations
  const filteredConversations = useMemo(
    () =>
      conversations.filter((convo) => {
        const matchesSearch =
          convo.speaker.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          convo.speaker.congregation.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
          filter === 'all' ||
          (filter === 'pending' && convo.visits.some((v) => v.status === 'pending'));

        return matchesSearch && matchesFilter;
      }),
    [conversations, searchTerm, filter]
  );

  const stats = useMemo(() => {
    const total = conversations.length;
    const pending = visits.filter((v) => v.status === 'pending').length;
    const needingHost = visits.filter(
      (v) => !v.host || v.host === 'À définir' || v.host === ''
    ).length;

    return { total, pending, needingHost };
  }, [conversations, visits]);

  const getStatusIcon = (visit: Visit) => {
    switch (visit.status) {
      case 'pending':
        return <Clock className='w-4 h-4 text-orange-500' />;
      case 'confirmed':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      default:
        return <AlertCircle className='w-4 h-4 text-gray-500' />;
    }
  };

  const handleMessageAction = (action: string, visit?: Visit) => {
    if (action === 'whatsapp' || action === 'email') {
      if (visit && selectedSpeaker) {
        setGeneratorVisit(visit);
        setIsGeneratorModalOpen(true);
      }
    } else if (action === 'confirm' && visit) {
      // Confirmer la visite
      const updatedVisit: Visit = {
        ...visit,
        status: 'confirmed',
        updatedAt: new Date().toISOString(),
      };
      updateVisit(updatedVisit);
    } else if (action === 'host_request' && visit) {
      setGeneratorVisit(visit);
      setIsHostRequestModalOpen(true);
    }
  };

  return (
    <div
      className={cn(
        'min-h-[calc(100vh-12rem)] flex flex-col',
        isPhoneS25Ultra && 's25-ultra-optimized'
      )}
    >
      {/* Header */}
      <div className={cn('flex justify-end gap-3 mb-6', isPhoneS25Ultra && 'flex-col gap-2')}>
        {/* Bouton demande d'accueil - conditionnel */}
        {stats.needingHost > 0 && (
          <Button
            variant='secondary'
            className='bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50'
            leftIcon={<Users className='w-4 h-4' />}
            onClick={() => setIsHostRequestModalOpen(true)}
          >
            Demande d'accueil ({stats.needingHost})
          </Button>
        )}
        <Button
          variant='secondary'
          leftIcon={<Plus className='w-4 h-4' />}
          onClick={() => setIsGeneratorModalOpen(true)}
        >
          Nouveau message
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className={cn('grid gap-4 mb-6', isPhoneS25Ultra ? 'grid-cols-1' : 'grid-cols-3')}>
        <div
          className={cn(
            'bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800',
            isPhoneS25Ultra && 's25-card'
          )}
        >
          <div className='flex items-center gap-3'>
            <MessageSquare className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            <div>
              <div className='text-lg font-semibold text-blue-900 dark:text-blue-100'>
                {stats.total}
              </div>
              <div className='text-xs text-blue-700 dark:text-blue-300'>Orateurs</div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800',
            isPhoneS25Ultra && 's25-card'
          )}
        >
          <div className='flex items-center gap-3'>
            <Clock className='w-6 h-6 text-orange-600 dark:text-orange-400' />
            <div>
              <div className='text-lg font-semibold text-orange-900 dark:text-orange-100'>
                {stats.pending}
              </div>
              <div className='text-xs text-orange-700 dark:text-orange-300'>En attente</div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800',
            isPhoneS25Ultra && 's25-card'
          )}
        >
          <div className='flex items-center gap-3'>
            <CheckCircle className='w-6 h-6 text-green-600 dark:text-green-400' />
            <div>
              <div className='text-lg font-semibold text-green-900 dark:text-green-100'>
                {visits.filter((v) => v.status === 'confirmed').length}
              </div>
              <div className='text-xs text-green-700 dark:text-green-300'>Confirmées</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className={cn(
          'flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6',
          isPhoneS25Ultra && 'p-3'
        )}
      >
        <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
          <Input
            placeholder='Rechercher un orateur...'
            leftIcon={<Search className='w-4 h-4' />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='min-w-64'
          />

          <div className='flex gap-2'>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              En attente ({stats.pending})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className={cn('flex-1 flex gap-6 min-h-0', isPhoneS25Ultra && 'flex-col gap-4')}>
        {/* Conversations List */}
        <div
          className={cn(
            'w-full lg:w-96 flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden',
            isPhoneS25Ultra && 'w-full min-h-0 flex-1'
          )}
        >
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-white'>Orateurs</h3>
          </div>

          <div className='flex-1 overflow-y-auto'>
            {filteredConversations.length > 0 ? (
              <div className='divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredConversations.map(({ speaker, visits: speakerVisits }) => (
                  <div
                    key={speaker.id}
                    onClick={() => setSelectedSpeaker(speaker)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      selectedSpeaker?.id === speaker.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500'
                        : ''
                    }`}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start gap-3 flex-1 min-w-0'>
                        <div className='w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold flex-shrink-0'>
                          {speaker.nom.charAt(0).toUpperCase()}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-1'>
                            <h4 className='font-medium text-gray-900 dark:text-white truncate'>
                              {speaker.nom}
                            </h4>
                            {speakerVisits.some((v) => v.status === 'pending') && (
                              <Badge variant='danger' className='text-xs px-1.5 py-0.5'>
                                !
                              </Badge>
                            )}
                          </div>

                          <p className='text-sm text-gray-500 dark:text-gray-400 mb-1 truncate'>
                            {speaker.congregation}
                          </p>

                          <div className='flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500'>
                            <span>
                              {speakerVisits.length} visite{speakerVisits.length > 1 ? 's' : ''}
                            </span>
                            <span>•</span>
                            <span>
                              {speakerVisits.filter((v) => v.status === 'pending').length} en
                              attente
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-col items-end gap-1 flex-shrink-0'>
                        {speakerVisits.some((v) => getStatusIcon(v))}
                        <span className='text-xs text-gray-400 dark:text-gray-500'>
                          {speaker.telephone || speaker.email ? 'Contacté' : 'Sans contact'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400'>
                <MessageSquare className='w-12 h-12 mb-4 opacity-20' />
                <p className='text-center'>
                  {searchTerm ? 'Aucun orateur trouvé' : 'Aucun orateur'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div
          className={cn(
            'flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden',
            isPhoneS25Ultra && 'w-full'
          )}
        >
          {selectedSpeaker ? (
            <MessageThread
              speaker={selectedSpeaker}
              visits={visits.filter((v) => v.nom === selectedSpeaker.nom)}
              onAction={handleMessageAction}
            />
          ) : (
            <div className='flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400'>
              <MessageSquare className='w-16 h-16 mb-4 opacity-20' />
              <h3 className='text-lg font-medium mb-2'>Sélectionnez un orateur</h3>
              <p className='text-center max-w-md'>
                Choisissez un orateur dans la liste pour voir les détails et envoyer des messages.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Generator Modal */}
      {isGeneratorModalOpen && selectedSpeaker && generatorVisit && (
        <MessageGeneratorModal
          isOpen={isGeneratorModalOpen}
          onClose={() => {
            setIsGeneratorModalOpen(false);
            setGeneratorVisit(null);
          }}
          speaker={selectedSpeaker}
          visit={generatorVisit}
        />
      )}

      {/* Fallback modal when no specific visit is selected */}
      {isGeneratorModalOpen && !generatorVisit && (
        <MessageGeneratorModal
          isOpen={isGeneratorModalOpen}
          onClose={() => {
            setIsGeneratorModalOpen(false);
            setGeneratorVisit(null);
          }}
          speaker={selectedSpeaker || speakers[0]}
          visit={
            selectedSpeaker
              ? visits.find(
                  (v) =>
                    v.id === selectedSpeaker.id &&
                    (v.status === 'pending' || v.status === 'confirmed')
                ) ||
                visits.find((v) => v.id === selectedSpeaker.id) ||
                visits[0]
              : visits[0]
          }
        />
      )}

      {/* Host Request Modal */}
      <HostRequestModal
        isOpen={isHostRequestModalOpen}
        onClose={() => setIsHostRequestModalOpen(false)}
        visitsNeedingHost={visits.filter((v) => !v.host || v.host === 'À définir' || v.host === '')}
      />
    </div>
  );
};
