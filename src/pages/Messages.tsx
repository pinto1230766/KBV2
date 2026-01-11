import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { usePlatformContext } from '@/contexts/PlatformContext';
import { MessageThread } from '@/components/messages/MessageThread';
import { HostMessageThread } from '@/components/messages/HostMessageThread';
import { MessageGeneratorModal } from '@/components/messages/MessageGeneratorModal';
import { GroupHostMessageModal } from '@/components/messages/GroupHostMessageModal';

import { Button } from '@/components/ui/Button';

import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import {
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  Users,
  ArrowLeft,
  ChevronRight,
  Send,
  Mail,
  UserCheck,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { Speaker, Visit, Host } from '@/types';
import { getPrimaryHostName, needsHost } from '@/utils/hostUtils';

export const Messages: React.FC = () => {
  const { visits, speakers, hosts, updateVisit, refreshData } = useData();
  const { deviceType } = usePlatformContext();
  const isTablet = deviceType === 'tablet';
  const isSamsungTablet = isTablet && window.innerWidth >= 1200;

  React.useEffect(() => {
    if (refreshData) refreshData();
  }, []);

  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [activeTab, setActiveTab] = useState<'speakers' | 'hosts'>('speakers');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'pending' | 'needs_host' | 'available' | 'hosting'
  >('all');
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [isGroupHostMessageModalOpen, setIsGroupHostMessageModalOpen] = useState(false);

  const [generatorVisit, setGeneratorVisit] = useState<Visit | null>(null);
  const [generatorHost, setGeneratorHost] = useState<Host | null>(null);

  // Visits needing host for group message modal
  const visitsNeedingHost = useMemo(() => {
    return visits.filter((v) => needsHost(v));
  }, [visits]);

  // Group visits by speaker
  const conversations = useMemo(() => {
    const convos: { speaker: Speaker; visits: Visit[]; nextVisitDate: string }[] = [];
    const seenSpeakers = new Set<string>();

    speakers.forEach((speaker) => {
      if (!seenSpeakers.has(speaker.id)) {
        seenSpeakers.add(speaker.id);
        const speakerVisits = visits.filter((v) => {
          const type = (v.talkNoOrType || '').toLowerCase();
          const isSpecialEvent =
            type.includes('assembl') ||
            type.includes('congr') ||
            type.includes('especial') ||
            type.includes('circun');
          return v.id === speaker.id && !isSpecialEvent && v.status !== 'cancelled';
        });

        if (speakerVisits.length > 0) {
          const sortedVisits = [...speakerVisits].sort(
            (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
          );
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

    return convos.sort(
      (a, b) => new Date(a.nextVisitDate).getTime() - new Date(b.nextVisitDate).getTime()
    );
  }, [visits, speakers]);

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((convo) => {
      const matchesSearch =
        convo.speaker.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        convo.speaker.congregation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'pending' && convo.visits.some((v) => v.status === 'pending')) ||
        (activeFilter === 'needs_host' &&
          convo.visits.some((v) => needsHost(v)));

      return matchesSearch && matchesFilter;
    });
  }, [conversations, searchTerm, activeFilter]);

  // Group hosts with their upcoming visits
  const hostConversations = useMemo(() => {
    const hostConvos: { host: Host; upcomingVisits: Visit[]; nextVisitDate: string | null }[] = [];

    hosts.forEach((host) => {
      const hostVisits = visits.filter((v) => getPrimaryHostName(v) === host.nom && v.status !== 'cancelled');

      const sortedVisits = [...hostVisits].sort(
        (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
      );
      const upcomingVisits = sortedVisits.filter(
        (v) => new Date(v.visitDate) >= new Date(new Date().setHours(0, 0, 0, 0))
      );

      hostConvos.push({
        host,
        upcomingVisits,
        nextVisitDate: upcomingVisits.length > 0 ? upcomingVisits[0].visitDate : null,
      });
    });

    return hostConvos.sort((a, b) => {
      if (a.nextVisitDate && b.nextVisitDate) {
        return new Date(a.nextVisitDate).getTime() - new Date(b.nextVisitDate).getTime();
      }
      if (a.nextVisitDate) return -1;
      if (b.nextVisitDate) return 1;
      return a.host.nom.localeCompare(b.host.nom);
    });
  }, [visits, hosts]);

  // Filtered hosts
  const filteredHosts = useMemo(() => {
    return hostConversations.filter((hostConvo) => {
      const matchesSearch =
        hostConvo.host.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hostConvo.host.address || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'available' && hostConvo.upcomingVisits.length === 0) ||
        (activeFilter === 'hosting' && hostConvo.upcomingVisits.length > 0);

      return matchesSearch && matchesFilter;
    });
  }, [hostConversations, searchTerm, activeFilter]);

  const stats = useMemo(() => {
    const pendingTotal = visits.filter((v) => v.status === 'pending').length;
    const confirmedTotal = visits.filter((v) => v.status === 'confirmed').length;
    const needingHostTotal = visits.filter((v) => needsHost(v)).length;
    return {
      pendingTotal,
      confirmedTotal,
      needingHostTotal,
      totalConversations: conversations.length,
    };
  }, [visits, conversations]);

  const handleMessageAction = (action: string, visit?: Visit, host?: Host) => {
    if ((action === 'whatsapp' || action === 'email') && visit && selectedSpeaker) {
      setGeneratorVisit(visit);
      setIsGeneratorModalOpen(true);
    } else if (action === 'confirm' && visit) {
      updateVisit({ ...visit, status: 'confirmed', updatedAt: new Date().toISOString() });
    } else if (action === 'message_host' && host) {
      setGeneratorHost(host);
      setIsGeneratorModalOpen(true);
    }
  };



  return (
    <div className='max-w-[1600px] mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-4'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6'>
        <div>
          <div className='flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium mb-1'>
            <MessageSquare className='w-4 h-4' />
            <span>Communications Hub</span>
          </div>
          <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
            Messages & Suivi
          </h2>
          <p className='text-gray-500 dark:text-gray-400 mt-2 max-w-2xl text-sm'>
            Gérez vos échanges avec les orateurs et hôtes, confirmez les visites et organisez
            l'accueil en un seul endroit.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          {deviceType === 'phone' && selectedSpeaker && (
            <Button
              variant='ghost'
              onClick={() => setSelectedSpeaker(null)}
              leftIcon={<ArrowLeft className='w-4 h-4' />}
            >
              Retour
            </Button>
          )}

          {/* Bouton permanent pour message groupé hôtes */}
          <Button
            variant='primary'
            leftIcon={<Users className='w-4 h-4' />}
            onClick={() => setIsGroupHostMessageModalOpen(true)}
            disabled={visitsNeedingHost.length === 0}
            className='relative'
          >
            Message Groupé Hôtes
            {visitsNeedingHost.length > 0 && (
              <Badge 
                variant='danger' 
                size='sm'
                className='ml-2 px-1.5 py-0.5 text-[10px]'
              >
                {visitsNeedingHost.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit'>
        <button
          onClick={() => {
            setActiveTab('speakers');
            setSelectedSpeaker(null);
            setSelectedHost(null);
          }}
          className={cn(
            'px-6 py-2 rounded-xl text-sm font-bold transition-all',
            activeTab === 'speakers'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
          )}
        >
          Orateurs
        </button>
        <button
          onClick={() => {
            setActiveTab('hosts');
            setSelectedSpeaker(null);
            setSelectedHost(null);
          }}
          className={cn(
            'px-6 py-2 rounded-xl text-sm font-bold transition-all',
            activeTab === 'hosts'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
          )}
        >
          Hôtes
        </button>
      </div>

      {/* Landing / Stats Layer */}
      {((!selectedSpeaker && !selectedHost) || !isTablet) && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-500'>
          {[
            {
              label: activeTab === 'speakers' ? 'Conversations' : 'Hôtes actifs',
              value: activeTab === 'speakers' ? stats.totalConversations : hosts.length,
              icon: MessageSquare,
              color: 'text-blue-600',
              bg: 'bg-blue-50 dark:bg-blue-900/20',
            },
            {
              label: 'En attente',
              value: stats.pendingTotal,
              icon: Clock,
              color: 'text-orange-600',
              bg: 'bg-orange-50 dark:bg-orange-900/20',
            },
            {
              label: 'À confirmer',
              value: stats.needingHostTotal,
              icon: Users,
              color: 'text-red-600',
              bg: 'bg-red-50 dark:bg-red-900/20',
            },
            {
              label: 'Confirmées',
              value: stats.confirmedTotal,
              icon: CheckCircle,
              color: 'text-green-600',
              bg: 'bg-green-50 dark:bg-green-900/20',
            },
          ].map((s, i) => (
            <Card
              key={i}
              className='border-none shadow-sm hover:translate-y-[-2px] transition-transform'
            >
              <CardBody className='p-4 flex items-center justify-between'>
                <div>
                  <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                    {s.label}
                  </p>
                  <p className='text-xl font-black text-gray-900 dark:text-white mt-1'>{s.value}</p>
                </div>
                <div className={cn('p-2.5 rounded-xl', s.bg)}>
                  <s.icon className={cn('w-4 h-4', s.color)} />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className='flex flex-col lg:flex-row gap-8 items-start min-h-[600px]'>
        {/* Left Pane: Conversations List */}
        {(!selectedSpeaker || deviceType !== 'phone') && (
          <div
            className={cn(
              'flex flex-col w-full shrink-0',
              isSamsungTablet ? 'lg:w-[450px]' : 'lg:w-96'
            )}
          >
            <div className='space-y-4 sticky top-4'>
              {/* Filter & Search Card */}
              <Card className='border-none shadow-md overflow-hidden'>
                <CardBody className='p-4 space-y-4'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                      className='w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all'
                      placeholder={
                        activeTab === 'speakers'
                          ? 'Rechercher un orateur...'
                          : 'Rechercher un hôte...'
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className='flex gap-1 overflow-x-auto pb-1 scrollbar-none'>
                    {(activeTab === 'speakers'
                      ? [
                          { id: 'all', label: 'Tout' },
                          { id: 'pending', label: 'En attente' },
                          { id: 'needs_host', label: 'Sans accueil' },
                        ]
                      : [
                          { id: 'all', label: 'Tous' },
                          { id: 'available', label: 'Disponibles' },
                          { id: 'hosting', label: 'En accueil' },
                        ]
                    ).map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id as any)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all uppercase tracking-tighter',
                          activeFilter === f.id
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Conversations Scroller */}
              <div className='space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700'>
                {activeTab === 'speakers' ? (
                  filteredConversations.length > 0 ? (
                    filteredConversations.map(
                      ({ speaker, visits: speakerVisits, nextVisitDate }) => {
                        const isSelected = selectedSpeaker?.id === speaker.id;
                        const hasPending = speakerVisits.some((v) => v.status === 'pending');
                        const speakerNeedsHost = speakerVisits.some((v) => needsHost(v));

                        return (
                          <button
                            key={speaker.id}
                            onClick={() => setSelectedSpeaker(speaker)}
                            className={cn(
                              'w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 group relative',
                              isSelected
                                ? 'bg-white dark:bg-gray-800 shadow-xl border-l-[6px] border-primary-500 translate-x-1'
                                : 'hover:bg-white/50 dark:hover:bg-white/5'
                            )}
                          >
                            <div
                              className={cn(
                                'relative w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 transition-transform group-hover:scale-105',
                                isSelected
                                  ? 'bg-primary-600 text-white shadow-lg'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                              )}
                            >
                              {speaker.nom.charAt(0).toUpperCase()}
                              {(hasPending || speakerNeedsHost) && (
                                <div className='absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse' />
                              )}
                            </div>

                            <div className='flex-1 min-w-0'>
                              <div className='flex items-center justify-between mb-1'>
                                <h4
                                  className={cn(
                                    'font-bold truncate text-sm uppercase tracking-tight',
                                    isSelected
                                      ? 'text-gray-900 dark:text-white'
                                      : 'text-gray-600 dark:text-gray-400'
                                  )}
                                >
                                  {speaker.nom}
                                </h4>
                                <span className='text-[10px] text-gray-400 font-bold uppercase'>
                                  {new Date(nextVisitDate).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                  })}
                                </span>
                              </div>
                              <p className='text-[11px] text-gray-500 truncate mb-2'>
                                {speaker.congregation}
                              </p>

                              <div className='flex gap-1.5'>
                                {hasPending && (
                                  <Badge variant='danger' className='text-[9px] px-1.5 py-0'>
                                    À CONFIRMER
                                  </Badge>
                                )}
                                {speakerNeedsHost && (
                                  <Badge variant='warning' className='text-[9px] px-1.5 py-0'>
                                    SANS ACCUEIL
                                  </Badge>
                                )}
                                {!hasPending && !speakerNeedsHost && (
                                  <Badge variant='success' className='text-[9px] px-1.5 py-0'>
                                    OK
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <ChevronRight
                              className={cn(
                                'w-4 h-4 mt-1 transition-all',
                                isSelected
                                  ? 'opacity-100 text-primary-500'
                                  : 'opacity-0 group-hover:opacity-100 text-gray-300'
                              )}
                            />
                          </button>
                        );
                      }
                    )
                  ) : (
                    <div className='py-20 text-center opacity-40'>
                      <Info className='w-8 h-8 mx-auto mb-3' />
                      <p className='text-xs font-bold uppercase tracking-widest'>Aucun résultat</p>
                    </div>
                  )
                ) : // Hosts tab
                filteredHosts.length > 0 ? (
                  filteredHosts.map(({ host, upcomingVisits, nextVisitDate }) => {
                    const isSelected = selectedHost?.nom === host.nom;
                    const isHosting = upcomingVisits.length > 0;

                    return (
                      <button
                        key={host.nom}
                        onClick={() => setSelectedHost(host)}
                        className={cn(
                          'w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 group relative',
                          isSelected
                            ? 'bg-white dark:bg-gray-800 shadow-xl border-l-[6px] border-primary-500 translate-x-1'
                            : 'hover:bg-white/50 dark:hover:bg-white/5'
                        )}
                      >
                        <div
                          className={cn(
                            'relative w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 transition-transform group-hover:scale-105',
                            isSelected
                              ? 'bg-primary-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                          )}
                        >
                          {host.nom.charAt(0).toUpperCase()}
                          {isHosting && (
                            <div className='absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full' />
                          )}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between mb-1'>
                            <h4
                              className={cn(
                                'font-bold truncate text-sm uppercase tracking-tight',
                                isSelected
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-gray-600 dark:text-gray-400'
                              )}
                            >
                              {host.nom}
                            </h4>
                            {isHosting && nextVisitDate && (
                              <span className='text-[10px] text-gray-400 font-bold uppercase'>
                                {new Date(nextVisitDate).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                })}
                              </span>
                            )}
                          </div>
                          <p className='text-[11px] text-gray-500 truncate mb-2'>
                            {host.address || 'Adresse non spécifiée'}
                          </p>

                          <div className='flex gap-1.5'>
                            {isHosting ? (
                              <Badge variant='success' className='text-[9px] px-1.5 py-0'>
                                EN ACCUEIL ({upcomingVisits.length})
                              </Badge>
                            ) : (
                              <Badge variant='info' className='text-[9px] px-1.5 py-0'>
                                DISPONIBLE
                              </Badge>
                            )}
                          </div>
                        </div>

                        <ChevronRight
                          className={cn(
                            'w-4 h-4 mt-1 transition-all',
                            isSelected
                              ? 'opacity-100 text-primary-500'
                              : 'opacity-0 group-hover:opacity-100 text-gray-300'
                          )}
                        />
                      </button>
                    );
                  })
                ) : (
                  <div className='py-20 text-center opacity-40'>
                    <Info className='w-8 h-8 mx-auto mb-3' />
                    <p className='text-xs font-bold uppercase tracking-widest'>Aucun résultat</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Right Pane: Message Thread / Dashboard Overview */}
        {(selectedSpeaker || selectedHost || isTablet) && (
          <div className='flex-1 w-full min-h-[600px]'>
            {selectedSpeaker ? (
              <div className='animate-in fade-in slide-in-from-right-4 duration-300 h-full'>
                <Card className='border-none shadow-xl h-full flex flex-col bg-gray-50 dark:bg-gray-900/40 rounded-3xl overflow-hidden'>
                  <MessageThread
                    speaker={selectedSpeaker}
                    visits={visits.filter((v) => v.id === selectedSpeaker.id)}
                    onAction={handleMessageAction}
                  />
                </Card>
              </div>
            ) : selectedHost ? (
              <div className='animate-in fade-in slide-in-from-right-4 duration-300 h-full'>
                <Card className='border-none shadow-xl h-full flex flex-col bg-gray-50 dark:bg-gray-900/40 rounded-3xl overflow-hidden'>
                  <HostMessageThread
                    host={selectedHost}
                    visits={visits.filter((v) => getPrimaryHostName(v) === selectedHost.nom)}
                    onAction={handleMessageAction}
                  />
                </Card>
              </div>
            ) : (
              <div className='h-full flex flex-col items-center justify-center p-12 text-center animate-in zoom-in-95 duration-500'>
                <div className='relative mb-10'>
                  <div className='absolute -inset-4 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-2xl animate-pulse' />
                  <div className='relative w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl shadow-xl flex items-center justify-center'>
                    <Send className='w-12 h-12 text-primary-500 rotate-[-15deg]' />
                  </div>
                </div>

                <h3 className='text-2xl font-black text-gray-900 dark:text-white tracking-tighter mb-4'>
                  Prêt à communiquer ?
                </h3>
                <p className='text-gray-500 max-w-sm mb-12 text-sm leading-relaxed'>
                  {activeTab === 'speakers'
                    ? "Sélectionnez un orateur dans la liste de gauche pour préparer son arrivée, gérer l'accueil ou simplement lui envoyer un message de confirmation."
                    : 'Sélectionnez un hôte dans la liste de gauche pour consulter ses informations et lui envoyer un message.'}
                </p>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl'>
                  {(activeTab === 'speakers'
                    ? [
                        { icon: Mail, label: 'Modèles SMS', desc: 'Gagnez du temps' },
                        { icon: UserCheck, label: 'Suivi Précis', desc: 'Statut en direct' },
                        { icon: ShieldAlert, label: 'Gestion Hosting', desc: 'Alertes accueil' },
                      ]
                    : [
                        { icon: Mail, label: 'Messages directs', desc: 'Communication rapide' },
                        { icon: UserCheck, label: 'Info complètes', desc: 'Tous les détails' },
                        { icon: ShieldAlert, label: 'Suivi visites', desc: 'Historique accueil' },
                      ]
                  ).map((feat, i) => (
                    <div
                      key={i}
                      className='p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all'
                    >
                      <feat.icon className='w-6 h-6 text-primary-500 mx-auto mb-3' />
                      <p className='font-bold text-xs uppercase tracking-tighter mb-1'>
                        {feat.label}
                      </p>
                      <p className='text-[10px] text-gray-400'>{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {isGeneratorModalOpen && (
        <MessageGeneratorModal
          isOpen={isGeneratorModalOpen}
          onClose={() => {
            setIsGeneratorModalOpen(false);
            setGeneratorVisit(null);
            setGeneratorHost(null);
          }}
          speaker={selectedSpeaker}
          visit={generatorVisit}
          host={generatorHost}
        />
      )}

      {/* Modal unifié pour message groupé hôtes */}
      {isGroupHostMessageModalOpen && (
        <GroupHostMessageModal
          isOpen={isGroupHostMessageModalOpen}
          onClose={() => setIsGroupHostMessageModalOpen(false)}
          visitsNeedingHost={visitsNeedingHost}
        />
      )}
    </div>
  );
};

export default Messages;