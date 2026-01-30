import React, { useState } from 'react';
import {
  Users,
  Calendar,
  AlertCircle,
  Zap,
  CalendarPlus,
  ShieldCheck,
  Search,
  LayoutGrid,
  CheckCircle2,
  Bell,
  UserCheck,
  MapPin,
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';

import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { DashboardVisitItem } from '@/components/dashboard/DashboardVisitItem';

import { Visit } from '@/types';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { VisitEditor } from '@/components/visits/VisitEditor/VisitEditor';
import { Modal } from '@/components/ui/Modal';
import { MessageGeneratorModal } from '@/components/messages/MessageGeneratorModal';
import { ScheduleVisitModal } from '@/components/planning/ScheduleVisitModal';
import { useAppStats } from '@/hooks/useVisitStats';


export const Dashboard: React.FC = () => {
  const { visits, speakers, hosts } = useData();

  const navigate = useNavigate();

  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [messageModalParams, setMessageModalParams] = useState<{
    isOpen: boolean;
    type: any;
    isGroup?: boolean;
    channel?: any;
    speaker: any;
    visit: Visit | null;
    host: any;
  }>({
    isOpen: false,
    type: 'confirmation',
    speaker: null,
    visit: null,
    host: null,
  });

  const stats = useAppStats(visits, speakers, hosts);
  const upcomingVisits = stats.visits.upcomingVisits;

  const handleVisitClick = (visit: Visit) => {
    setSelectedVisit(visit);
    setIsVisitModalOpen(true);
  };

  return (
    <div className='max-w-[1600px] mx-auto space-y-3 px-4 sm:px-6 lg:px-8 py-1'>
      {/* 1. Compact Header */}
      <div className='flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700'>
        <div>
           <h1 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
             <span className='w-2 h-2 rounded-full bg-blue-500 animate-pulse'></span>
             Bonjour Francis
           </h1>
           <p className='text-xs text-gray-500 dark:text-gray-400 mt-1' >
            {stats.visits.pendingTotal > 0 ? (
              <span className='text-orange-600 font-bold'>Running • {stats.visits.pendingTotal} validations en attente</span>
            ) : (
              <span className='text-green-600 font-bold'>System Normal • Tout est à jour</span>
            )}
          </p>
        </div>

        <div className='flex gap-2'>
            <Button
              className='h-9 bg-blue-600 hover:bg-blue-700 text-white border-none font-bold shadow-sm text-xs'
              leftIcon={<CalendarPlus className='w-3 h-3' />}
              onClick={() => setIsScheduleModalOpen(true)}
            >
              Nouvelle Visite
            </Button>
         </div>
      </div>

      {/* 2. Global Insight Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-4 duration-500'>
        {[
          {
            label: 'Visites du mois',
            desc: 'Toutes les visites programmées en cours',
            value: stats.visits.thisMonthCount,
            icon: Calendar,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            path: '/planning',
          },
          {
            label: 'Orateurs actifs',
            desc: 'Orateurs enregistrés dans la base de données',
            value: stats.speakers.total,
            icon: Users,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            path: '/speakers',
          },
          {
            label: 'Validations en attente',
            desc: 'Visites nécessitant une confirmation',
            value: stats.visits.pendingTotal,
            icon: AlertCircle,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            path: '/planning',
          },
          {
            label: "Contacts d'accueil",
            desc: 'Hôtes disponibles pour recevoir les orateurs',
            value: stats.hosts.available,
            icon: ShieldCheck,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20',
            path: '/settings',
          },
        ].map((stat, i) => (
          <button
            key={i}
            onClick={() => navigate(stat.path)}
            className='relative group text-left'
            title={`${stat.label}: ${stat.desc} (Cliquez pour voir)`}
          >
            {/* Tooltip hint pour Power Users */}
            {i === 2 && (
              <div className='absolute -top-2 -right-2 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center z-10'>
                <span className='text-[8px] text-white font-bold'>i</span>
              </div>
            )}
            <Card className='border-none shadow-sm group-hover:translate-y-[-4px] transition-all duration-300 h-full'>
              <CardBody className='p-4 flex items-center justify-between'>
                <div>
                  <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>
                    {stat.label}
                  </p>
                  <p className='text-3xl font-black text-gray-900 dark:text-white tracking-tighter'>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    'p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-sm',
                    stat.bg
                  )}
                >
                  <stat.icon className={cn('w-6 h-6', stat.color)} />
                </div>
              </CardBody>
            </Card>
          </button>
        ))}
      </div>

      {/* 3. Main Operational View */}
      <div className='grid grid-cols-1 xl:grid-cols-12 gap-4 items-start'>
        {/* Left Side: Cette semaine & Shortcuts (8/12) */}
        <div className='xl:col-span-8 space-y-4 animate-in fade-in slide-in-from-left-4 duration-700'>
          {/* Encart Cette semaine */}
          <Card className='border-none shadow-sm overflow-hidden bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-3xl'>
            <div className='p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl'>
                  <Calendar className='w-5 h-5 text-amber-600 dark:text-amber-400' />
                </div>
                <div>
                  <h3 className='text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-1'>
                    Cette semaine
                  </h3>
                  <p className='text-xs text-gray-500 font-medium'>
                    {(() => {
                      const today = new Date();
                      const startOfWeek = new Date(today);
                      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
                      const endOfWeek = new Date(startOfWeek);
                      endOfWeek.setDate(startOfWeek.getDate() + 6);
                      return `Du ${startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} au ${endOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
                    })()}
                  </p>
                </div>
              </div>
              <Badge
                variant='default'
                className='bg-amber-50 text-amber-700 dark:bg-amber-900/20 border-none px-3 font-bold'
              >
                {stats.visits.thisWeekCount || 0} visites
              </Badge>
            </div>
            <CardBody className='p-4'>
              {/* Visites de la semaine */}
              {(() => {
                const today = new Date();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay() + 1);
                startOfWeek.setHours(0, 0, 0, 0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                
                const thisWeekVisits = visits
                  .filter(v => {
                    const visitDate = new Date(v.visitDate);
                    return visitDate >= startOfWeek && visitDate <= endOfWeek;
                  })
                  .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());
                
                if (thisWeekVisits.length === 0) {
                  return (
                    <div className='text-center py-6 text-gray-400'>
                      <CheckCircle2 className='w-10 h-10 mx-auto mb-2 opacity-50' />
                      <p className='text-sm'>Aucune visite programmée cette semaine</p>
                    </div>
                  );
                }
                
                return (
                  <div className='space-y-2 mb-4'>
                    <h4 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>Visites programmées</h4>
                    {thisWeekVisits.slice(0, 3).map((visit) => (
                      <button
                        key={visit.id}
                        onClick={() => handleVisitClick(visit)}
                        className='w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left'
                      >
                        <div className='flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center'>
                          <span className='text-xs font-bold text-primary-600 dark:text-primary-400'>
                            {new Date(visit.visitDate).toLocaleDateString('fr-FR', { weekday: 'narrow' })}
                          </span>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='font-semibold text-gray-900 dark:text-white text-sm truncate'>
                            {visit.nom}
                          </p>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {new Date(visit.visitDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                            {visit.hostAssignments && visit.hostAssignments.length > 0 && ` • ${visit.hostAssignments.length} hôte(s)`}
                          </p>
                        </div>
                        <div className='flex-shrink-0'>
                          {visit.communicationStatus?.confirmation?.speaker ? (
                            <CheckCircle2 className='w-5 h-5 text-green-500' />
                          ) : (
                            <AlertCircle className='w-5 h-5 text-amber-500' />
                          )}
                        </div>
                      </button>
                    ))}
                    {thisWeekVisits.length > 3 && (
                      <button 
                        onClick={() => navigate('/planning')}
                        className='text-xs text-primary-500 font-medium hover:underline'
                      >
                        + {thisWeekVisits.length - 3} autres visites cette semaine
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Tâches prioritaires */}
              <div className='border-t border-gray-100 dark:border-gray-700/50 pt-4'>
                <h4 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2'>
                  <Zap className='w-3 h-3' />
                  Tâches prioritaires
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {(() => {
                    const pendingConfirmations = visits.filter(v => 
                      !v.communicationStatus?.confirmation?.speaker && 
                      new Date(v.visitDate) >= new Date()
                    ).length;
                    
                    const visitsWithoutHost = visits.filter(v => 
                      (!v.hostAssignments || v.hostAssignments.length === 0) &&
                      new Date(v.visitDate) >= new Date()
                    ).length;
                    
                    const remindersToSend = visits.filter(v => {
                      const visitDate = new Date(v.visitDate);
                      const today = new Date();
                      const diffDays = Math.ceil((visitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      return diffDays <= 7 && diffDays >= 0 && !v.communicationStatus?.['reminder-7']?.speaker;
                    }).length;
                    
                    const tasks = [
                      {
                        label: 'Confirmations en attente',
                        count: pendingConfirmations,
                        icon: UserCheck,
                        color: 'text-orange-500',
                        bg: 'bg-orange-50 dark:bg-orange-900/20',
                        action: () => navigate('/planning'),
                      },
                      {
                        label: 'Visites sans hôte',
                        count: visitsWithoutHost,
                        icon: MapPin,
                        color: 'text-red-500',
                        bg: 'bg-red-50 dark:bg-red-900/20',
                        action: () => navigate('/planning'),
                      },
                      {
                        label: 'Rappels à envoyer',
                        count: remindersToSend,
                        icon: Bell,
                        color: 'text-blue-500',
                        bg: 'bg-blue-50 dark:bg-blue-900/20',
                        action: () => navigate('/planning'),
                      },
                      {
                        label: 'Tout est à jour',
                        count: pendingConfirmations === 0 && visitsWithoutHost === 0 && remindersToSend === 0 ? 1 : 0,
                        icon: CheckCircle2,
                        color: 'text-green-500',
                        bg: 'bg-green-50 dark:bg-green-900/20',
                        action: () => navigate('/planning'),
                        isSuccess: true,
                      },
                    ].filter(t => t.count > 0 || t.isSuccess);
                    
                    return tasks.map((task, i) => (
                      <button
                        key={i}
                        onClick={task.action}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${task.bg} hover:opacity-80`}
                      >
                        <task.icon className={`w-5 h-5 ${task.color}`} />
                        <div className='flex-1'>
                          <p className='text-xs font-medium text-gray-600 dark:text-gray-300'>{task.label}</p>
                        </div>
                        <span className={`text-lg font-black ${task.color}`}>{task.count}</span>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Recherche globale */}
          <Card className='border-none shadow-sm bg-gradient-to-br from-indigo-900 to-primary-900 p-6 rounded-3xl text-white overflow-hidden relative'>
            <div className='absolute top-[-20%] right-[-10%] opacity-20'>
              <LayoutGrid className='w-48 h-48' />
            </div>
            <div className='relative z-10'>
              <h4 className='text-base font-black uppercase tracking-tighter mb-3'>
                Recherche globale
              </h4>
              <div className='relative mb-4'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-300' />
                <input
                  className='w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-black/20 border border-white/10 rounded-2xl text-xs backdrop-blur-md focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-primary-300/50'
                  placeholder='Trouver un orateur, une date...'
                  onClick={() => setIsGlobalSearchOpen(true)}
                  readOnly
                />
              </div>
              <div className='flex items-center gap-3 text-[10px] font-bold text-primary-300 uppercase tracking-widest'>
                <Zap className='w-3 h-3 text-amber-400' />
                Appuyez sur CTRL + K partout
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Activity Heartbeat (4/12) */}
        <div className='xl:col-span-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-700'>
          <Card className='border-none shadow-sm bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-3xl overflow-hidden'>
            <div className='p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between'>
              <div>
                <h3 className='text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-1'>
                  Planning à venir
                </h3>
                <p className='text-xs text-gray-500 font-medium'>
                  Visites programmées nécessitant un suivi
                </p>
              </div>
              <Button
                variant='secondary'
                size='sm'
                onClick={() => navigate('/planning')}
                className='rounded-full font-bold'
              >
                Voir tout
              </Button>
            </div>
            <CardBody className='p-4'>
              {upcomingVisits.length > 0 ? (
                <div className='space-y-3'>
                  {upcomingVisits.map((v) => (
                    <DashboardVisitItem key={v.id} visit={v} onClick={() => handleVisitClick(v)} />
                  ))}
                  <div className='pt-4 flex justify-center'>
                    <button className='text-[10px] font-black text-primary-500 uppercase tracking-widest hover:underline'>
                      + {visits.length - upcomingVisits.length} autres dans le futur
                    </button>
                  </div>
                </div>
              ) : (
                <div className='py-20 text-center opacity-40'>
                  <Calendar className='w-12 h-12 mx-auto mb-4' />
                  <p className='text-xs font-bold uppercase tracking-widest'>
                    Aucun planning programmé
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {selectedVisit && (
        <Modal
          isOpen={isVisitModalOpen}
          onClose={() => setIsVisitModalOpen(false)}
          title=''
          size='xl'
          padding='none'
          className='max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw]'
        >
          <div className='h-[80vh]'>
            <VisitEditor visit={selectedVisit} onClose={() => setIsVisitModalOpen(false)} />
          </div>
        </Modal>
      )}

      <GlobalSearch isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />

      <ScheduleVisitModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {messageModalParams.isOpen && (
        <MessageGeneratorModal
          isOpen={messageModalParams.isOpen}
          onClose={() => setMessageModalParams({ ...messageModalParams, isOpen: false })}
          speaker={messageModalParams.speaker}
          visit={messageModalParams.visit}
          host={messageModalParams.host}
          initialType={messageModalParams.type}
          isGroupMessage={messageModalParams.isGroup}
          initialChannel={messageModalParams.channel}
        />
      )}
    </div>
  );
};

export default Dashboard;
