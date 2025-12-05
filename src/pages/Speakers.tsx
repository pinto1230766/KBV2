import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { SpeakerList } from '@/components/speakers/SpeakerList';
import { SpeakerFormModal } from '@/components/speakers/SpeakerFormModal';
import { HostList } from '@/components/hosts/HostList';
import { HostFormModal } from '@/components/hosts/HostFormModal';
import { Button } from '@/components/ui/Button';
import { Plus, Users, Home } from 'lucide-react';
import { Speaker, Host } from '@/types';

type Tab = 'speakers' | 'hosts';

export const Speakers: React.FC = () => {
  const { speakers, deleteSpeaker, hosts, deleteHost } = useData();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('speakers');
  
  // Modal states
  const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | undefined>(undefined);

  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [editingHost, setEditingHost] = useState<Host | undefined>(undefined);

  // Speaker Handlers
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

  const handleCloseSpeakerModal = () => {
    setIsSpeakerModalOpen(false);
    setEditingSpeaker(undefined);
  };

  // Host Handlers
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

  const handleCloseHostModal = () => {
    setIsHostModalOpen(false);
    setEditingHost(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeTab === 'speakers' ? 'Gestion des Orateurs' : "Gestion de l'Accueil"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {activeTab === 'speakers' 
              ? `${speakers.length} orateur${speakers.length > 1 ? 's' : ''} enregistré${speakers.length > 1 ? 's' : ''}`
              : `${hosts.length} contact${hosts.length > 1 ? 's' : ''} d'accueil`
            }
          </p>
        </div>
        <Button 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            if (activeTab === 'speakers') {
              setEditingSpeaker(undefined);
              setIsSpeakerModalOpen(true);
            } else {
              setEditingHost(undefined);
              setIsHostModalOpen(true);
            }
          }}
        >
          {activeTab === 'speakers' ? 'Ajouter un orateur' : 'Ajouter un contact'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('speakers')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'speakers'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
            `}
          >
            <Users className="w-4 h-4" />
            Orateurs
          </button>
          <button
            onClick={() => setActiveTab('hosts')}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'hosts'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
            `}
          >
            <Home className="w-4 h-4" />
            Contacts d'accueil
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'speakers' ? (
          <SpeakerList 
            speakers={speakers}
            onEdit={handleEditSpeaker}
            onDelete={handleDeleteSpeaker}
          />
        ) : (
          <HostList 
            hosts={hosts}
            onEdit={handleEditHost}
            onDelete={handleDeleteHost}
          />
        )}
      </div>

      {/* Modals */}
      <SpeakerFormModal
        isOpen={isSpeakerModalOpen}
        onClose={handleCloseSpeakerModal}
        speaker={editingSpeaker}
      />
      
      <HostFormModal
        isOpen={isHostModalOpen}
        onClose={handleCloseHostModal}
        host={editingHost}
      />
    </div>
  );
};
