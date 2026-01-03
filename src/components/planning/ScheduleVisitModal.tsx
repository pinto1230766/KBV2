import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { Visit, HostAssignment } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import {
  AlertTriangle,
  Calendar,
  Clock,
  User,
  MapPin,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Info,
  X,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { useVisitNotifications } from '@/hooks/useVisitNotifications';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  isOpen,
  onClose,
  initialDate,
}) => {
  const { speakers, hosts, addVisit, publicTalks, visits, congregationProfile } = useData();
  const { addToast } = useToast();
  const { scheduleVisitReminder } = useVisitNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dateError, setDateError] = useState<string>('');
  const [dateConflict, setDateConflict] = useState<{ has: boolean; speakerName?: string }>({
    has: false,
  });

  const [formData, setFormData] = useState<Partial<Visit>>({
    visitDate: initialDate ? initialDate.toISOString().split('T')[0] : '',
    visitTime: congregationProfile.meetingTime || '14:30',
    locationType: 'physical',
    status: 'pending',
    talkNoOrType: '',
    talkTheme: '',
    nom: '',
    id: '',
    host: '',
    congregation: '',
    hostAssignments: [],
  });

  // Reset step on open
  useEffect(() => {
    if (isOpen) setCurrentStep(1);
    if (initialDate) {
      setFormData((prev) => ({ ...prev, visitDate: initialDate.toISOString().split('T')[0] }));
    }
  }, [isOpen, initialDate]);

  useEffect(() => {
    if (formData.visitDate) {
      validateDate(formData.visitDate);
      checkDateConflict(formData.visitDate);
    }
  }, [formData.visitDate]);

  const validateDate = (dateStr: string) => {
    const visitDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (visitDate < today) {
      setDateError('La date doit être dans le futur');
      return false;
    }
    setDateError('');
    return true;
  };

  const checkDateConflict = (date: string) => {
    const conflict = visits.find((v) => v.visitDate === date);
    if (conflict) {
      setDateConflict({
        has: true,
        speakerName: conflict.nom,
      });
    } else {
      setDateConflict({ has: false });
    }
  };

  const handleSpeakerChange = (speakerId: string) => {
    const speaker = speakers.find((s) => s.id === speakerId);
    if (speaker) {
      const isLocal = speaker.congregation === 'Lyon KBV' || speaker.congregation === 'Lyon';
      setFormData((prev) => ({
        ...prev,
        id: speaker.id,
        nom: speaker.nom,
        congregation: speaker.congregation,
        host: isLocal ? '' : prev.host,
      }));
    }
  };

  const handleTalkChange = (talkNumber: string) => {
    const talk = publicTalks.find((t) => t.number.toString() === talkNumber);
    if (talk) {
      setFormData((prev) => ({
        ...prev,
        talkNoOrType: talk.number.toString(),
        talkTheme: talk.theme,
      }));
    } else {
      // Allow manual input
      setFormData((prev) => ({
        ...prev,
        talkNoOrType: talkNumber,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateDate(formData.visitDate || '')) {
      addToast('Veuillez sélectionner une date valide', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (!formData.id || !formData.visitDate) {
        throw new Error('Champs obligatoires manquants');
      }

      const newVisit: Visit = {
        ...(formData as Visit),
        visitId: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addVisit(newVisit);
      await scheduleVisitReminder(newVisit);
      addToast('Visite programmée avec succès', 'success');
      onClose();
    } catch (_error) {
      addToast('Erreur lors de la création', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isLocalSpeaker = formData.congregation === 'Lyon KBV' || formData.congregation === 'Lyon';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=''
      size='lg'
      padding='none'
      hideCloseButton={true}
      className='max-sm:rounded-none overflow-hidden'
    >
      <div className='flex flex-col h-[85vh] md:h-auto bg-white dark:bg-gray-900 md:max-h-[85vh]'>
        {/* 1. Header */}
        <div className='bg-gradient-to-r from-indigo-600 to-violet-600 p-6 md:p-8 text-white relative overflow-hidden shrink-0'>
          <Calendar className='absolute right-[-10px] top-[-10px] w-32 h-32 opacity-10 rotate-12' />
          <div className='relative z-10'>
            <h2 className='text-2xl font-black tracking-tighter mb-1'>Nouvelle Visite</h2>
            <p className='text-indigo-100 text-sm'>Organisez le programme spirituel</p>

            {/* Stepper */}
            <div className='flex items-center gap-2 mt-6'>
              {[1, 2, 3].map((step) => (
                <div key={step} className='flex items-center'>
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                      currentStep >= step
                        ? 'bg-white text-indigo-600 shadow-md scale-110'
                        : 'bg-indigo-900/40 text-indigo-300'
                    )}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={cn(
                        'w-8 md:w-16 h-1 mx-2 rounded-full',
                        currentStep > step ? 'bg-white/50' : 'bg-indigo-900/20'
                      )}
                    />
                  )}
                </div>
              ))}
              <span className='ml-auto text-xs font-bold uppercase tracking-widest opacity-80'>
                {currentStep === 1
                  ? 'Date & Orateur'
                  : currentStep === 2
                    ? 'Logistique'
                    : 'Confirmation'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Content */}
        <div className='flex-1 overflow-y-auto p-6 md:p-8 space-y-8'>
          {/* STEP 1: DATE & SPEAKER */}
          {currentStep === 1 && (
            <div className='space-y-6 animate-in fade-in slide-in-from-right-8 duration-300'>
              {/* Date Selection */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                    Date
                  </label>
                  <div className='relative'>
                    <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                      type='date'
                      value={formData.visitDate}
                      onChange={(e) => setFormData((p) => ({ ...p, visitDate: e.target.value }))}
                      className={cn(
                        'w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium focus:ring-2 transition-all',
                        dateError
                          ? 'focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'focus:ring-indigo-500'
                      )}
                      aria-label='Date de visite'
                      placeholder='JJ/MM/AAAA'
                    />
                  </div>
                  {dateError && (
                    <p className='text-xs text-red-600 font-medium pl-1'>{dateError}</p>
                  )}
                </div>
                <div className='space-y-2'>
                  <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                    Heure
                  </label>
                  <div className='relative'>
                    <Clock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                      type='time'
                      value={formData.visitTime}
                      onChange={(e) => setFormData((p) => ({ ...p, visitTime: e.target.value }))}
                      className='w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500'
                      aria-label='Heure de visite'
                      placeholder='HH:MM'
                    />
                  </div>
                </div>
              </div>

              {dateConflict.has && (
                <div className='p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl flex items-start gap-3'>
                  <AlertTriangle className='w-5 h-5 text-orange-600 shrink-0' />
                  <div>
                    <h4 className='text-sm font-bold text-orange-800 dark:text-orange-200'>
                      Attention : Conflit potentiel
                    </h4>
                    <p className='text-xs text-orange-600 dark:text-orange-300 mt-1'>
                      Une visite est déjà prévue ce jour avec {dateConflict.speakerName}.
                    </p>
                  </div>
                </div>
              )}

              {/* Speaker Selection */}
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                  Orateur
                </label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <select
                    value={formData.id || ''}
                    onChange={(e) => handleSpeakerChange(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 appearance-none'
                    aria-label='Sélectionner un orateur'
                    title='Choisir l&apos;orateur pour la visite'
                  >
                    <option value=''>Sélectionner un orateur...</option>
                    {speakers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nom} ({s.congregation})
                      </option>
                    ))}
                  </select>
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                    <ChevronRight className='w-4 h-4 text-gray-400 rotate-90' />
                  </div>
                </div>
              </div>

              {/* Talk Selection */}
              <div className='space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800'>
                <div className='flex items-center gap-2'>
                  <BookOpen className='w-4 h-4 text-indigo-500' />
                  <h4 className='text-sm font-bold text-gray-900 dark:text-white'>Discours</h4>
                </div>
                <div className='grid grid-cols-[1fr,2fr] gap-4'>
                  <input
                    placeholder='N°'
                    value={formData.talkNoOrType || ''}
                    onChange={(e) => handleTalkChange(e.target.value)}
                    list='talks-list'
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500'
                  />
                  <input
                    placeholder='Thème du discours...'
                    value={formData.talkTheme || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, talkTheme: e.target.value }))}
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500'
                  />
                  <datalist id='talks-list'>
                    {publicTalks.map((t) => (
                      <option key={t.number} value={t.number}>
                        {t.theme}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOGISTICS */}
          {currentStep === 2 && (
            <div className='space-y-6 animate-in fade-in slide-in-from-right-8 duration-300'>
              <div className='space-y-3'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-widest pl-1'>
                  Mode de diffusion
                </label>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                  {[
                    { id: 'physical', label: 'Présentiel', icon: MapPin },
                    { id: 'zoom', label: 'Zoom', icon: User },
                    { id: 'streaming', label: 'Streaming', icon: User },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData((p) => ({ ...p, locationType: type.id as any }))}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                        formData.locationType === type.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                          : 'border-gray-100 dark:border-gray-800 text-gray-500 hover:border-gray-200'
                      )}
                    >
                      <type.icon className='w-5 h-5' />
                      <span className='text-xs font-bold'>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.locationType === 'physical' && !isLocalSpeaker && (
                <div className='space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-in fade-in duration-300'>
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4 text-teal-500' />
                    <h4 className='text-sm font-bold text-gray-900 dark:text-white'>Hospitalité</h4>
                  </div>

                  {/* Host Assignments */}
                  <div className='space-y-3'>
                    {/* Existing assignments */}
                    {(formData.hostAssignments || []).map((assignment, index) => (
                      <div
                        key={assignment.id}
                        className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl'
                      >
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                              {assignment.hostName}
                            </span>
                            <Badge
                              variant='default'
                              className='text-[10px] px-2 py-0.5 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                            >
                              {assignment.role === 'accommodation' && 'Hébergement'}
                              {assignment.role === 'pickup' && 'Ramassage'}
                              {assignment.role === 'meals' && 'Repas'}
                              {assignment.role === 'transport' && 'Transport'}
                              {assignment.role === 'other' && 'Autre'}
                            </Badge>
                          </div>
                          {assignment.notes && (
                            <p className='text-xs text-gray-500 mt-1'>{assignment.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            const newAssignments = (formData.hostAssignments || []).filter(
                              (_, i) => i !== index
                            );
                            setFormData((p) => ({
                              ...p,
                              hostAssignments: newAssignments,
                              host: newAssignments.find(a => a.role === 'accommodation')?.hostName || '',
                            }));
                          }}
                          className='text-red-500 hover:text-red-700 p-1'
                          aria-label='Supprimer l&apos;assignation'
                          title='Supprimer cette assignation'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    ))}

                    {/* Add new assignment form */}
                    <div className='p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl'>
                      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                        <select
                          className='w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500'
                          aria-label='Sélectionner un hôte'
                          title='Choisir l&apos;hôte pour cette assignation'
                          onChange={(e) => {
                            const hostId = e.target.value;
                            if (hostId) {
                              const host = hosts.find(h => h.nom === hostId);
                              if (host) {
                                const newAssignment: HostAssignment = {
                                  id: uuidv4(),
                                  hostId: host.nom, // Using name as ID for simplicity
                                  hostName: host.nom,
                                  role: 'accommodation',
                                  createdAt: new Date().toISOString(),
                                };
                                setFormData((p) => ({
                                  ...p,
                                  hostAssignments: [...(p.hostAssignments || []), newAssignment],
                                  host: p.host || host.nom, // Keep legacy field for backward compatibility
                                }));
                              }
                            }
                            e.target.value = '';
                          }}
                        >
                          <option value=''>Sélectionner un hôte...</option>
                          {hosts
                            .filter(h => !(formData.hostAssignments || []).some(a => a.hostId === h.nom))
                            .map((h) => (
                              <option key={h.nom} value={h.nom}>
                                {h.nom}
                              </option>
                            ))}
                        </select>

                        <select
                          className='w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500'
                          aria-label='Sélectionner un rôle'
                          title='Choisir le rôle de l&apos;hôte'
                          onChange={(e) => {
                            const role = e.target.value as HostAssignment['role'];
                            if (role && formData.hostAssignments && formData.hostAssignments.length > 0) {
                              const lastIndex = formData.hostAssignments.length - 1;
                              const updatedAssignments = [...formData.hostAssignments];
                              updatedAssignments[lastIndex] = {
                                ...updatedAssignments[lastIndex],
                                role,
                              };
                              setFormData((p) => ({
                                ...p,
                                hostAssignments: updatedAssignments,
                              }));
                            }
                            e.target.value = '';
                          }}
                        >
                          <option value=''>Rôle...</option>
                          <option value='accommodation'>Hébergement</option>
                          <option value='pickup'>Ramassage gare</option>
                          <option value='meals'>Repas</option>
                          <option value='transport'>Transport</option>
                          <option value='other'>Autre</option>
                        </select>

                        <input
                          type='text'
                          placeholder='Notes (optionnel)'
                          className='w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500'
                          onChange={(e) => {
                            const notes = e.target.value;
                            if (formData.hostAssignments && formData.hostAssignments.length > 0) {
                              const lastIndex = formData.hostAssignments.length - 1;
                              const updatedAssignments = [...formData.hostAssignments];
                              updatedAssignments[lastIndex] = {
                                ...updatedAssignments[lastIndex],
                                notes: notes || undefined,
                              };
                              setFormData((p) => ({
                                ...p,
                                hostAssignments: updatedAssignments,
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl flex gap-3 text-blue-700 dark:text-blue-300 text-xs leading-relaxed'>
                    <Info className='w-4 h-4 shrink-0 mt-0.5' />
                    <p>
                      L'orateur vient d'une autre congrégation. Vous pouvez assigner plusieurs hôtes pour différentes tâches : hébergement, ramassage à la gare, repas, etc.
                    </p>
                  </div>
                </div>
              )}

              {isLocalSpeaker && (
                <div className='p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center'>
                  <p className='text-sm text-gray-500'>
                    Aucune logistique nécessaire pour un orateur local.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SUMMARY */}
          {currentStep === 3 && (
            <div className='space-y-6 animate-in fade-in slide-in-from-right-8 duration-300 text-center'>
              <div className='w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CheckCircle2 className='w-10 h-10 text-green-600 dark:text-green-400' />
              </div>
              <h3 className='text-xl font-black text-gray-900 dark:text-white'>
                Tout semble correct ?
              </h3>
              <p className='text-gray-500 text-sm max-w-sm mx-auto'>
                Vérifiez les détails ci-dessous avant de confirmer la programmation de cette visite.
              </p>

              <div className='bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-left space-y-4'>
                <div className='flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2'>
                  <span className='text-xs font-bold text-gray-400 uppercase'>Date</span>
                  <span className='text-sm font-bold text-gray-900 dark:text-white'>
                    {new Date(formData.visitDate!).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
                <div className='flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2'>
                  <span className='text-xs font-bold text-gray-400 uppercase'>Orateur</span>
                  <span className='text-sm font-bold text-gray-900 dark:text-white'>
                    {formData.nom}
                  </span>
                </div>
                <div className='flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2'>
                  <span className='text-xs font-bold text-gray-400 uppercase'>Discours</span>
                  <span className='text-sm font-medium text-gray-900 dark:text-white text-right max-w-[200px] truncate'>
                    {formData.talkNoOrType
                      ? `N°${formData.talkNoOrType} - ${formData.talkTheme}`
                      : 'Non défini'}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-xs font-bold text-gray-400 uppercase'>Logistique</span>
                  <div className='text-right'>
                    {(formData.hostAssignments && formData.hostAssignments.length > 0) ? (
                      <div className='space-y-1'>
                        {formData.hostAssignments.slice(0, 2).map((assignment) => (
                          <Badge key={assignment.id} variant='default' className='text-xs block'>
                            {assignment.role === 'accommodation' && `🏠 ${assignment.hostName}`}
                            {assignment.role === 'pickup' && `🚗 ${assignment.hostName}`}
                            {assignment.role === 'meals' && `🍽️ ${assignment.hostName}`}
                            {assignment.role === 'transport' && `🚌 ${assignment.hostName}`}
                            {assignment.role === 'other' && `📋 ${assignment.hostName}`}
                          </Badge>
                        ))}
                        {formData.hostAssignments.length > 2 && (
                          <Badge variant='default' className='text-xs'>
                            +{formData.hostAssignments.length - 2} autres
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <Badge variant='default' className='text-xs'>
                        {formData.host || 'Aucun hôte'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Footer Actions */}
        <div className='p-6 md:p-8 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 flex justify-between items-center'>
          {currentStep > 1 && (
            <Button variant='ghost' onClick={() => setCurrentStep((p) => p - 1)}>
              Précédent
            </Button>
          )}
          {currentStep === 1 && (
            <Button variant='ghost' onClick={onClose} className='text-red-500 hover:bg-red-50'>
              Annuler
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              className='ml-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
              onClick={() => {
                if (!formData.visitDate || !formData.id) {
                  addToast('Veuillez remplir les champs obligatoires', 'error');
                  return;
                }
                setCurrentStep((p) => p + 1);
              }}
            >
              Suivant <ChevronRight className='w-4 h-4 ml-1' />
            </Button>
          ) : (
            <Button
              className='ml-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 dark:shadow-none px-8'
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              Confirmer
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
