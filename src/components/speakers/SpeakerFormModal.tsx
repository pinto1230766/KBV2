import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Speaker, Gender } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/contexts/ConfirmContext';
import { v4 as uuidv4 } from 'uuid';
import { User, Phone, Mail, FileText, CheckCircle2, Car, Users, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SpeakerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  speaker?: Speaker;
}

export const SpeakerFormModal: React.FC<SpeakerFormModalProps> = ({ isOpen, onClose, speaker }) => {
  const { addSpeaker, updateSpeaker, speakers, deleteSpeaker } = useData();
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Speaker>>({
    nom: '',
    congregation: '',
    telephone: '',
    email: '',
    photoUrl: '',
    gender: 'male',
    notes: '',
    isVehiculed: true,
  });

  useEffect(() => {
    if (speaker) {
      setFormData({
        ...speaker,
        nom: speaker.nom || '',
        congregation: speaker.congregation || '',
        telephone: speaker.telephone || '',
        email: speaker.email || '',
        photoUrl: speaker.photoUrl || '',
        gender: speaker.gender || 'male',
        notes: speaker.notes || '',
        isVehiculed: speaker.isVehiculed ?? true,
      });
    } else {
      setFormData({
        nom: '',
        congregation: '',
        telephone: '',
        email: '',
        photoUrl: '',
        gender: 'male',
        notes: '',
        isVehiculed: true,
      });
    }
  }, [speaker, isOpen]);

  const handleDelete = async () => {
    if (!speaker) return;

    const isConfirmed = await confirm({
      title: "Supprimer l'orateur",
      message: `Êtes-vous sûr de vouloir supprimer ${speaker.nom} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      confirmVariant: 'danger',
    });

    if (isConfirmed) {
      deleteSpeaker(speaker.id);
      addToast('Orateur supprimé avec succès', 'success');
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.nom || !formData.congregation) {
        throw new Error('Le nom et la congrégation sont obligatoires');
      }

      if (!speaker && speakers.some((s) => s.nom.toLowerCase() === formData.nom?.toLowerCase())) {
        throw new Error('Un orateur avec ce nom existe déjà');
      }

      const speakerData: Speaker = {
        ...(formData as Speaker),
        id: speaker ? speaker.id : uuidv4(),
        talkHistory: speaker ? speaker.talkHistory : [],
        updatedAt: new Date().toISOString(),
        createdAt: speaker ? speaker.createdAt : new Date().toISOString(),
      };

      if (speaker) {
        updateSpeaker(speakerData);
        addToast('Orateur mis à jour avec succès', 'success');
      } else {
        addSpeaker(speakerData);
        addToast('Orateur ajouté avec succès', 'success');
      }
      onClose();
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Erreur lors de l'enregistrement", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=''
      size='lg'
      padding='none'
      hideCloseButton={true}
      className='overflow-hidden'
    >
      <div className='flex flex-col max-h-[90vh]'>
        {/* Header */}
        <div className='bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shrink-0 relative overflow-hidden'>
          <Users className='absolute right-[-10px] top-[-10px] w-32 h-32 opacity-10 rotate-12' />
          <div className='relative z-10'>
            <h2 className='text-2xl font-black tracking-tighter mb-1'>
              {speaker ? `Modifier ${speaker.nom}` : 'Nouvel Orateur'}
            </h2>
            <p className='text-emerald-100 text-sm'>
              {speaker 
                ? "Mettez à jour les informations et coordonnées de l'orateur."
                : "Ajoutez les coordonnées d'un frère qualifié pour les discours."}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-gray-900'>
          <form id='speaker-form' onSubmit={handleSubmit} className='space-y-8'>
            {/* Profile Photo */}
            <div className='flex justify-center'>
              <div className='relative group'>
                <ImageUpload
                  value={formData.photoUrl || ''}
                  onChange={(url) => setFormData((prev) => ({ ...prev, photoUrl: url }))}
                  label=''
                  size='lg'
                  className='w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl'
                />
                <div className='absolute inset-0 rounded-full ring-1 ring-black/5 dark:ring-white/10 pointer-events-none' />
              </div>
            </div>

            {/* Identity Section */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 mb-4'>
                <User className='w-4 h-4 text-emerald-500' />
                <h3 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider'>
                  Identité
                </h3>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                    Nom Complet
                  </label>
                  <input
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData((p) => ({ ...p, nom: e.target.value }))}
                    placeholder='Ex: Jean Dupont'
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 transition-all'
                  />
                </div>

                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                    Congrégation
                  </label>
                  <input
                    required
                    value={formData.congregation}
                    onChange={(e) => setFormData((p) => ({ ...p, congregation: e.target.value }))}
                    placeholder='Ex: Lyon Centre'
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 transition-all'
                  />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 mb-4'>
                <Phone className='w-4 h-4 text-emerald-500' />
                <h3 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider'>
                  Contact
                </h3>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                    Téléphone
                  </label>
                  <div className='relative'>
                    <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                      value={formData.telephone}
                      onChange={(e) => setFormData((p) => ({ ...p, telephone: e.target.value }))}
                      placeholder='06 12 34 56 78'
                      className='w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 transition-all'
                    />
                  </div>
                </div>

                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                    Email
                  </label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                      type='email'
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      placeholder='jean@example.com'
                      className='w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 transition-all'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 mb-4'>
                <FileText className='w-4 h-4 text-emerald-500' />
                <h3 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider'>
                  Détails
                </h3>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                    Genre
                  </label>
                  <div className='flex gap-2'>
                    {[
                      { id: 'male', label: 'Frère' },
                      { id: 'female', label: 'Sœur' },
                      { id: 'couple', label: 'Couple' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type='button'
                        onClick={() => setFormData((p) => ({ ...p, gender: g.id as Gender }))}
                        className={cn(
                          'flex-1 py-2 px-3 rounded-lg text-sm font-bold border transition-all',
                          formData.gender === g.id
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                            : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        )}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='flex items-end pb-3'>
                  <button
                    type='button'
                    onClick={() => setFormData((p) => ({ ...p, isVehiculed: !p.isVehiculed }))}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-xl border transition-all',
                      formData.isVehiculed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                        : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      <Car className='w-4 h-4' />
                      <span className='text-sm font-bold'>Est véhiculé</span>
                    </div>
                    {formData.isVehiculed && <CheckCircle2 className='w-4 h-4 text-emerald-500' />}
                  </button>
                </div>
              </div>

              <div className='space-y-1 pt-2'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                  placeholder='Particularités, disponibilités...'
                  className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 transition-all resize-none'
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className='p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 shrink-0'>
          <div>
            {speaker && (
              <Button
                variant='ghost'
                onClick={handleDelete}
                className='text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                leftIcon={<Trash2 className='w-4 h-4' />}
              >
                Supprimer
              </Button>
            )}
          </div>
          <div className='flex gap-2'>
            <Button variant='ghost' onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              type='submit'
              form='speaker-form'
              isLoading={isLoading}
              className='bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-200 dark:shadow-none'
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
