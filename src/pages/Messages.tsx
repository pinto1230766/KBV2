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
  const { isPhoneS25Ultra, deviceType } = usePlatformContext();
  const isTablet = deviceType === 'tablet';
  const isSamsungTablet = isTablet && window.innerWidth >= 1200;

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

  // Generate conversations from visits (sans doublons)
  const conversations = useMemo(() => {
    const convos: { speaker: Speaker; visits: Visit[]; nextVisitDate: string }[] = [];
    const seenSpeakers = new Set<string>();

    // Group visits by speaker and find next visit date
    speakers.forEach((speaker) => {
      if (!seenSpeakers.has(speaker.id)) {
        seenSpeakers.add(speaker.id);
        // Filtre les visites pour exclure les événements spéciaux (car on veut seulement les discours)
        const speakerVisits = visits.filter(
          (visit) => {
            const type = (visit.talkNoOrType || '').toLowerCase();
            const isSpecialEvent = type.includes('assembl') || 
                                  type.includes('congr') || 
                                  type.includes('especial') || 
                                  type.includes('circun');
            
            return visit.id === speaker.id &&
                   !isSpecialEvent &&
                   visit.status !== 'cancelled';
          }
        );

        if (speakerVisits.length > 0) {
          // Trouve la date de visite la plus proche dans le futur (ou la plus récente)
          const sortedVisits = [...speakerVisits].sort(
            (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
          );

          // Ne garde que les orateurs ayant au moins une visite non passée ou en attente
          const upcomingVisits = sortedVisits.filter(
            (v) => new Date(v.visitDate) >= new Date(new Date().setHours(0, 0, 0, 0))
          );

          if (upcomingVisits.length > 0) {
            convos.push({
              speaker,
              visits: sortedVisits,
              nextVisitDate: upcomingVisits[0].visitDate,
            });
          }
        }
      }
    });

    // Trie les conversations par date de prochaine visite (la plus proche en premier)
    return convos.sort(
      (a, b) => new Date(a.nextVisitDate).getTime() - new Date(b.nextVisitDate).getTime()
    );
  }, [visits, speakers]);

  // Filtered conversations
  const filteredConversations = useMemo(
    () =>
      conversations.filter((convo) => {
        const matchesSearch =
          convo.speaker.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          convo.speaker.congregation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          convo.nextVisitDate.includes(searchTerm);

        return matchesSearch;
      }),
    [conversations, searchTerm]
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

      {/* Statistics Cards - More compact */}
      <div className={cn('grid gap-3 mb-4', isPhoneS25Ultra ? 'grid-cols-1' : 'grid-cols-3')}>
        <div
          className={cn(
            'bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800',
            isPhoneS25Ultra && 's25-card'
          )}
        >
          <div className='flex items-center gap-2'>
            <MessageSquare className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            <div>
              <div className='text-base font-semibold text-blue-900 dark:text-blue-100 leading-tight'>
                {stats.total}
              </div>
              <div className='text-[10px] text-blue-700 dark:text-blue-300'>Orateurs</div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800',
            isPhoneS25Ultra && 's25-card'
          )}
        >
          <div className='flex items-center gap-2'>
            <Clock className='w-5 h-5 text-orange-600 dark:text-orange-400' />
            <div>
              <div className='text-base font-semibold text-orange-900 dark:text-orange-100 leading-tight'>
                {stats.pending}
              </div>
              <div className='text-[10px] text-orange-700 dark:text-orange-300'>En attente</div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800',
            isPhoneS25Ultra && 's25-card'
          )}
        >
          <div className='flex items-center gap-2'>
            <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400' />
            <div>
              <div className='text-base font-semibold text-green-900 dark:text-green-100 leading-tight'>
                {visits.filter((v) => v.status === 'confirmed').length}
              </div>
              <div className='text-[10px] text-green-700 dark:text-green-300'>Confirmées</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Simplified */}
      <div
        className={cn(
          'flex items-center bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4',
          isPhoneS25Ultra && 'p-1'
        )}
      >
        <Input
          placeholder='Rechercher un orateur ou une date (AAAA-MM-DD)...'
          leftIcon={<Search className='w-4 h-4' />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full border-none focus:ring-0 bg-transparent'
        />
      </div>

      {/* Main Content - Split View */}
      <div className={cn('flex-1 flex gap-6 min-h-0', isPhoneS25Ultra && 'flex-col gap-4')}>
        {/* Conversations List */}
        <div
          className={cn(
            'flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden',
            isPhoneS25Ultra ? 'w-full min-h-0 flex-1' : isSamsungTablet ? 'w-[800px]' : 'w-full lg:w-96'
          )}
        >
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-white'>Orateurs</h3>
          </div>

          <div className='flex-1 overflow-y-auto p-3'>
            {filteredConversations.length > 0 ? (
              <div className={cn(
                'grid gap-3',
                isSamsungTablet ? 'grid-cols-3' : isTablet ? 'grid-cols-2' : 'grid-cols-1'
              )}>
                {filteredConversations.map(({ speaker, visits: speakerVisits }) => (
                  <div
                    key={speaker.id}
                    onClick={() => setSelectedSpeaker(speaker)}
                    className={cn(
                      'p-3 rounded-lg cursor-pointer border transition-all',
                      selectedSpeaker?.id === speaker.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 shadow-sm'
                        : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600'
                    )}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start gap-3 flex-1 min-w-0'>
                        <div className='w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold flex-shrink-0'>
                          {speaker.nom.charAt(0).toUpperCase()}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-0.5'>
                            <h4 className='font-medium text-gray-900 dark:text-white leading-tight'>
                              {speaker.nom}
                            </h4>
                            {speakerVisits.some((v: Visit) => v.status === 'pending') && (
                              <Badge variant='danger' className='text-[10px] px-1.5 py-0 flex-shrink-0'>
                                !
                              </Badge>
                            )}
                          </div>

                          <div className='flex flex-col gap-0.5'>
                            <p className='text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight'>
                              {speaker.congregation}
                            </p>
                            <div className='flex items-center gap-2'>
                              <span className='text-[11px] font-medium text-primary-600 dark:text-primary-400'>
                                {new Date(
                                  (conversations.find(c => c.speaker.id === speaker.id) as any)?.nextVisitDate
                                ).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                })}
                              </span>
                              <Badge className='text-[9px] px-1 py-0 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-none'>
                                {speakerVisits.find((v: Visit) => v.visitDate === (conversations.find(c => c.speaker.id === speaker.id) as any)?.nextVisitDate)?.locationType === 'physical' ? 'Présentiel' : 
                                 speakerVisits.find((v: Visit) => v.visitDate === (conversations.find(c => c.speaker.id === speaker.id) as any)?.nextVisitDate)?.locationType === 'zoom' ? 'Zoom' : 'Streaming'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-col items-end gap-1 flex-shrink-0'>
                        {speakerVisits.some((v: Visit) => getStatusIcon(v))}
                        <span className='text-[10px] text-gray-400 dark:text-gray-500'>
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
