import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { SpeakerList } from '@/components/speakers/SpeakerList';
import { SpeakerFormModal } from '@/components/speakers/SpeakerFormModal';
import { HostList } from '@/components/hosts/HostList';
import { HostFormModal } from '@/components/hosts/HostFormModal';
import { Button } from '@/components/ui/Button';
import { Speaker, Host, Visit } from '@/types';
import { FeedbackFormModal } from '@/components/modals';
import { 
  Plus, 
  Users, 
  Home, 
  Search, 
  Filter, 
  Download, 
  Mic2, 
  MapPin, 
  Star,
  UserCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

type Tab = 'speakers' | 'hosts';

// Premium Stat Card (Consistent with Planning/Dashboard)
const StatCard = ({ icon: Icon, value, label, colorClasses }: any) => (
  <div className={cn(
    "relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] shadow-sm",
    colorClasses.bg,
    "border-white/20 dark:border-gray-700/50"
  )}>
    <div className="relative z-10 flex items-center justify-between">
       <div>
          <p className={cn("text-xs font-bold uppercase tracking-widest mb-1", colorClasses.text, "opacity-70")}>{label}</p>
          <h3 className={cn("text-3xl font-black tracking-tighter", colorClasses.text)}>{value}</h3>
       </div>
       <div className={cn("p-3 rounded-xl", colorClasses.iconBg)}>
          <Icon className={cn("w-6 h-6", colorClasses.text)} />
       </div>
    </div>
  </div>
);

export const Speakers: React.FC = () => {
  const { speakers, deleteSpeaker, hosts, deleteHost } = useData();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('speakers');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | undefined>(undefined);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [editingHost, setEditingHost] = useState<Host | undefined>(undefined);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackVisit, setFeedbackVisit] = useState<Visit | null>(null);

  // Statistics
  const stats = useMemo(() => ({
    totalSpeakers: speakers.length,
    localSpeakers: speakers.filter(s => s.congregation.toLowerCase().includes('lyon')).length,
    totalHosts: hosts.length,
    activeHosts: hosts.filter(h => h.isActive).length,
  }), [speakers, hosts]);

  // Handlers
  const handleEditSpeaker = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    setIsSpeakerModalOpen(true);
  };

  const handleDeleteSpeaker = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet orateur ?')) {
      deleteSpeaker(id);
      addToast('Orateur supprimé', 'success');
    }
  };

  const handleEditHost = (host: Host) => {
    setEditingHost(host);
    setIsHostModalOpen(true);
  };

  const handleDeleteHost = async (name: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      deleteHost(name);
      addToast('Contact supprimé', 'success');
    }
  };

  const handleOpenFeedbackModal = (visit: Visit) => {
    setFeedbackVisit(visit);
    setIsFeedbackModalOpen(true);
  };

  const handleCreate = () => {
    if (activeTab === 'speakers') {
      setEditingSpeaker(undefined);
      setIsSpeakerModalOpen(true);
    } else {
      setEditingHost(undefined);
      setIsHostModalOpen(true);
    }
  };

  return (
    <div className='space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6'>
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-none px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
                  Annuaire
               </Badge>
               <span className="text-gray-400 text-xs font-medium">{activeTab === 'speakers' ? 'Orateurs' : 'Hébergement'}</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
               Contacts & Hospitalité
            </h1>
         </div>
         <div className="flex items-center gap-3">
            <Button 
               variant="secondary" 
               className="font-bold border-gray-200 dark:border-gray-700 shadow-sm"
               leftIcon={<Download className="w-4 h-4" />}
            >
               Exporter
            </Button>
            <Button 
               className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-none font-bold px-6"
               leftIcon={<Plus className="w-5 h-5" />}
               onClick={handleCreate}
            >
               Ajouter
            </Button>
         </div>
      </div>

      {/* 2. Stats Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          icon={Users}
          value={stats.totalSpeakers}
          label='Total Orateurs'
          colorClasses={{ bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-white dark:bg-blue-900/30' }}
        />
        <StatCard
          icon={Mic2}
          value={stats.localSpeakers}
          label='Locaux (Lyon)'
          colorClasses={{ bg: 'bg-indigo-50 dark:bg-indigo-900/10', text: 'text-indigo-600 dark:text-indigo-400', iconBg: 'bg-white dark:bg-indigo-900/30' }}
        />
        <StatCard
          icon={Home}
          value={stats.totalHosts}
          label='Contacts Accueil'
          colorClasses={{ bg: 'bg-teal-50 dark:bg-teal-900/10', text: 'text-teal-600 dark:text-teal-400', iconBg: 'bg-white dark:bg-teal-900/30' }}
        />
        <StatCard
          icon={UserCheck}
          value={stats.activeHosts}
          label='Hôtes Actifs'
          colorClasses={{ bg: 'bg-green-50 dark:bg-green-900/10', text: 'text-green-600 dark:text-green-400', iconBg: 'bg-white dark:bg-green-900/30' }}
        />
      </div>

      {/* 3. Control Panel (Sticky) */}
      <div className="sticky top-20 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-2 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-2">
         
         {/* Tab Switcher */}
         <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center shrink-0">
            {[
              { id: 'speakers', label: 'Orateurs', icon: Users },
              { id: 'hosts', label: 'Accueil', icon: Home },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                 <tab.icon className="w-4 h-4" />
                 {tab.label}
              </button>
            ))}
         </div>

         {/* Search */}
         <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
               type="text" 
               placeholder={activeTab === 'speakers' ? "Rechercher un orateur..." : "Rechercher un hôte..."}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400"
            />
         </div>

         <Button 
            variant="secondary" 
            className="hidden md:flex bg-gray-50 dark:bg-gray-800 border-none text-gray-500 hover:text-gray-700" 
            leftIcon={<Filter className="w-4 h-4" />}
         >
            Filtres
         </Button>
      </div>

      {/* 4. Content Area */}
      <div className="min-h-[500px] animate-in fade-in duration-500">
        {activeTab === 'speakers' ? (
          /* Enclosing SpeakerList in a container that effectively passes search props if supported, 
             or relies on SpeakerList's internal search. 
             Ideally SpeakerList should accept 'searchTerm' prop but standard component might handle it internally.
             For this redesign, we focus on the wrapper. */
          <div className="bg-transparent">
             <SpeakerList
                speakers={speakers.filter(s => 
                   s.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   s.congregation.toLowerCase().includes(searchTerm.toLowerCase())
                )} 
                onEdit={handleEditSpeaker}
                onDelete={handleDeleteSpeaker}
                onFeedback={handleOpenFeedbackModal}
             />
          </div>
        ) : (
          <div className="bg-transparent">
            <HostList 
               hosts={hosts.filter(h => 
                  h.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  h.city.toLowerCase().includes(searchTerm.toLowerCase())
               )} 
               onEdit={handleEditHost} 
               onDelete={handleDeleteHost} 
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <SpeakerFormModal
        isOpen={isSpeakerModalOpen}
        onClose={() => { setIsSpeakerModalOpen(false); setEditingSpeaker(undefined); }}
        speaker={editingSpeaker}
      />

      <HostFormModal 
        isOpen={isHostModalOpen} 
        onClose={() => { setIsHostModalOpen(false); setEditingHost(undefined); }} 
        host={editingHost} 
      />

      {feedbackVisit && (
        <FeedbackFormModal
          isOpen={isFeedbackModalOpen}
          onClose={() => {
            setIsFeedbackModalOpen(false);
            setFeedbackVisit(null);
          }}
          visit={feedbackVisit}
          onSubmit={(feedback) => {
            console.log('Feedback submitted:', feedback);
            addToast('Évaluation enregistrée', 'success');
            setIsFeedbackModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
