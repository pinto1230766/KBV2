import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Host, Gender } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { Home, Users, MapPin, Phone, Mail, FileText, Dog } from 'lucide-react';
import { cn } from '@/utils/cn';

interface HostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  host?: Host;
}

export const HostFormModal: React.FC<HostFormModalProps> = ({ isOpen, onClose, host }) => {
  const { addHost, updateHost, hosts } = useData();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const DEFAULT_CAPACITY = 2;

  const [formData, setFormData] = useState<Partial<Host>>({
    nom: '',
    address: '',
    telephone: '',
    email: '',
    photoUrl: '',
    gender: 'couple',
    notes: '',
    capacity: DEFAULT_CAPACITY,
    hasPets: false,
    isSmoker: false,
  });

  useEffect(() => {
    if (host) {
      setFormData({
        ...host,
         capacity: host.capacity ?? DEFAULT_CAPACITY,
         hasPets: host.hasPets ?? false,
         isSmoker: host.isSmoker ?? false,
      });
    } else {
       setFormData({
        nom: '',
        address: '',
        telephone: '',
        email: '',
        photoUrl: '',
        gender: 'couple',
        notes: '',
        capacity: DEFAULT_CAPACITY,
        hasPets: false,
        isSmoker: false,
      });
    }
  }, [host, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.nom) throw new Error('Le nom est obligatoire');

      if (!host && hosts.some((h) => h.nom.toLowerCase() === formData.nom?.toLowerCase())) {
        throw new Error('Un contact avec ce nom existe déjà');
      }

      const hostData: Host = {
        ...(formData as Host),
        unavailableDates: host ? host.unavailableDates : [],
      };

      if (host) {
        updateHost(host.nom, hostData);
        addToast('Contact mis à jour avec succès', 'success');
      } else {
        addHost(hostData);
        addToast('Contact ajouté avec succès', 'success');
      }
      onClose();
    } catch (error) {
       addToast(error instanceof Error ? error.message : "Erreur", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
      padding="none"
      hideCloseButton={true}
      className="overflow-hidden"
    >
      <div className="flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white shrink-0 relative overflow-hidden">
           <Home className="absolute right-[-10px] top-[-10px] w-32 h-32 opacity-10 rotate-12" />
           <div className="relative z-10"> 
             <h2 className="text-2xl font-black tracking-tighter mb-1">
                {host ? "Modifier le foyer" : "Nouveau Foyer"}
             </h2>
             <p className="text-teal-100 text-sm">
                Gérez les capacités d'accueil de la congrégation.
             </p>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-gray-900">
           <form id="host-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* Profile Photo */}
              <div className="flex justify-center">
                 <div className="relative group">
                    <ImageUpload
                      value={formData.photoUrl || ''}
                      onChange={(url) => setFormData((prev) => ({ ...prev, photoUrl: url }))}
                      label=""
                      size="lg"
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
                    />
                    <div className="absolute inset-0 rounded-full ring-1 ring-black/5 dark:ring-white/10 pointer-events-none" />
                 </div>
              </div>

              {/* Foyer Info */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">
                    <Users className="w-4 h-4 text-teal-500" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Le Foyer</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Nom du foyer</label>
                       <input 
                         required
                         value={formData.nom}
                         onChange={e => setFormData(p => ({ ...p, nom: e.target.value }))}
                         placeholder="Ex: Famille Martin"
                         className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-teal-500 transition-all"
                       />
                    </div>
                    
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Type</label>
                       <div className="flex bg-gray-50 dark:bg-gray-800 rounded-xl p-1">
                          {[
                            { id: 'couple', label: 'Couple' },
                            { id: 'male', label: 'Frère' },
                            { id: 'female', label: 'Sœur' }
                          ].map(g => (
                             <button
                                key={g.id}
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, gender: g.id as Gender }))}
                                className={cn(
                                   "flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all",
                                   formData.gender === g.id 
                                     ? "bg-white dark:bg-gray-700 text-teal-600 shadow-sm" 
                                     : "text-gray-500 hover:text-gray-700"
                                )}
                             >
                                {g.label}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>

                  <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Adresse</label>
                       <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            value={formData.address}
                            onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                            placeholder="12 rue de la Paix, Lyon"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-teal-500 transition-all"
                          />
                       </div>
                   </div>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">
                    <Phone className="w-4 h-4 text-teal-500" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Contact</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                       <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input 
                         value={formData.telephone}
                         onChange={e => setFormData(p => ({ ...p, telephone: e.target.value }))}
                         placeholder="06 12 34 56 78"
                         className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-teal-500"
                       />
                    </div>
                    <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input 
                         value={formData.email}
                         onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                         placeholder="famille@example.com"
                         className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-teal-500"
                       />
                    </div>
                 </div>
              </div>

              {/* Capacity & Constraints */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">
                    <FileText className="w-4 h-4 text-teal-500" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Capacité & Particularités</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Capacité (personnes)</label>
                       <input 
                          type="number"
                          min={1}
                          value={formData.capacity}
                          onChange={e => setFormData(p => ({ ...p, capacity: parseInt(e.target.value) }))}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-teal-500"
                       />
                    </div>

                    <div className="flex flex-col gap-3 py-1">
                       <button
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, hasPets: !p.hasPets }))}
                          className={cn(
                             "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                             formData.hasPets
                               ? "bg-teal-50 text-teal-700 border-teal-200" 
                               : "bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700"
                          )}
                       >
                          <div className="flex items-center gap-2">
                             <Dog className="w-4 h-4" />
                             <span className="text-sm font-bold">Animaux</span>
                          </div>
                          <div className={cn("w-4 h-4 rounded-full border transition-colors", formData.hasPets ? "bg-teal-500 border-teal-500" : "border-gray-300")} />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-1 pt-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Contraintes / Préférences</label>
                    <textarea 
                       rows={3}
                       value={formData.notes}
                       onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                       placeholder="Allergies, escaliers, régimes particuliers..."
                       className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                 </div>
              </div>
           </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 shrink-0">
           <Button variant="ghost" onClick={onClose} disabled={isLoading}>Annuler</Button>
           <Button 
              type="submit" 
              form="host-form" 
              isLoading={isLoading} 
              className="bg-teal-600 hover:bg-teal-700 text-white border-none shadow-lg shadow-teal-200 dark:shadow-none"
           >
              Enregistrer
           </Button>
        </div>
      </div>
    </Modal>
  );
};
