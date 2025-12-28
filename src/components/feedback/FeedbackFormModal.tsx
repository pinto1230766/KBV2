import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Visit, VisitFeedback } from '@/types';

interface FeedbackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit;
  onSubmit: (feedback: VisitFeedback) => void;
}

interface FeedbackCategory {
  id: string;
  label: string;
  icon: string;
}

const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  { id: 'content', label: 'Contenu du discours', icon: '📖' },
  { id: 'delivery', label: 'Présentation', icon: '🎤' },
  { id: 'punctuality', label: 'Ponctualité', icon: '⏰' },
  { id: 'interaction', label: 'Interaction', icon: '🤝' },
  { id: 'preparation', label: 'Préparation', icon: '📝' },
];

const IMPROVEMENT_AREAS = [
  'Volume de la voix',
  'Rythme de parole',
  'Contact visuel',
  'Gestion du temps',
  'Utilisation des Écritures',
  'Applications pratiques',
  "Interaction avec l'auditoire",
  "Clarté de l'expression",
];

export const FeedbackFormModal: React.FC<FeedbackFormModalProps> = ({
  isOpen,
  onClose,
  visit,
  onSubmit,
}) => {
  const [speakerRating, setSpeakerRating] = useState(0);
  const [hostRating, setHostRating] = useState(0);
  const [organizationRating, setOrganizationRating] = useState(0);
  const [comments, setComments] = useState('');
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({});

  const handleStarClick = (rating: number, type: 'speaker' | 'host' | 'organization') => {
    if (type === 'speaker') setSpeakerRating(rating);
    else if (type === 'host') setHostRating(rating);
    else setOrganizationRating(rating);
  };

  const handleCategoryRating = (categoryId: string, rating: number) => {
    setCategoryRatings((prev) => ({
      ...prev,
      [categoryId]: rating,
    }));
  };

  const toggleImprovement = (area: string) => {
    setSelectedImprovements((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = () => {
    const feedback: VisitFeedback = {
      id: `feedback-${Date.now()}`,
      visitId: visit.visitId,
      speakerRating,
      hostRating: hostRating || undefined,
      organizationRating: organizationRating || undefined,
      comments,
      areasForImprovement: selectedImprovements.length > 0 ? selectedImprovements : undefined,
      isPrivate,
      submittedBy: 'Coordinateur', // À remplacer par l'utilisateur connecté
      submittedAt: new Date().toISOString(),
    };

    onSubmit(feedback);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=''
      size='xl'
      hideCloseButton
      padding='none'
      className='border-none bg-slate-50 dark:bg-slate-900'
    >
      <div className='flex flex-col h-[85vh] overflow-hidden'>
        {/* Immersive Header */}
        <div className='relative bg-slate-900 text-white shrink-0 overflow-hidden'>
          <div className='absolute inset-0 z-0 opacity-30'>
            <div className='absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-blue-600/30 blur-[100px] rounded-full'></div>
            <div className='absolute bottom-[-50%] left-[-10%] w-[60%] h-[150%] bg-indigo-600/30 blur-[100px] rounded-full'></div>
          </div>

          <div className='relative z-10 px-8 py-8'>
            <div className='flex justify-between items-start mb-6'>
              <div className='inline-flex items-center px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/10'>
                <span className='w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse'></span>
                <span className='text-[10px] font-bold uppercase tracking-widest text-white/90'>
                  Évaluation de visite
                </span>
              </div>
              <button
                onClick={onClose}
                className='p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white'
              >
                <span className='sr-only'>Fermer</span>
                <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='space-y-1'>
              <h2 className='text-3xl font-black tracking-tight text-white/90'>{visit.nom}</h2>
              <div className='flex items-center gap-3 text-blue-200/80 text-sm font-medium'>
                <span>
                  {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
                <span className='w-1 h-1 bg-white/30 rounded-full'></span>
                <span>{visit.congregation}</span>
              </div>
            </div>

            {visit.talkTheme && (
              <div className='mt-4 p-3 bg-white/5 border border-white/5 rounded-xl backdrop-blur-sm inline-block'>
                <div className='text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1'>
                  Discours
                </div>
                <div className='text-sm font-medium text-white/90 flex items-center gap-2'>
                  <span className='px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs font-bold'>
                    {visit.talkNoOrType}
                  </span>
                  {visit.talkTheme}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-50 dark:bg-slate-900/50'>
          {/* 1. Orateur Card (Main) */}
          <div className='bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6'>
            <div className='flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-4'>
              <div className='w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-2xl shadow-sm'>
                🎤
              </div>
              <div>
                <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                  Performance de l'orateur
                </h3>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  Qualité de l'enseignement & rhétorique
                </p>
              </div>
              {speakerRating > 0 && (
                <div className='ml-auto px-4 py-2 bg-blue-600 text-white font-black text-xl rounded-xl shadow-lg shadow-blue-500/30'>
                  {speakerRating}/5
                </div>
              )}
            </div>

            <div className='flex justify-center py-4'>
              <div className='flex gap-3'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star, 'speaker')}
                    className='group relative focus:outline-none transition-transform hover:scale-110 active:scale-95'
                  >
                    <Star
                      className={`w-12 h-12 transition-all duration-300 ${
                        star <= speakerRating
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-md'
                          : 'text-slate-200 dark:text-slate-600 group-hover:text-yellow-200'
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2'>
              {FEEDBACK_CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className='flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all'
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-lg opacity-80'>{category.icon}</span>
                    <span className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
                      {category.label}
                    </span>
                  </div>
                  <div className='flex gap-0.5'>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleCategoryRating(category.id, s)}
                        className={`w-4 h-4 rounded-sm ${
                          s <= (categoryRatings[category.id] || 0)
                            ? 'bg-blue-500'
                            : 'bg-slate-200 dark:bg-slate-600'
                        } hover:bg-blue-400 transition-colors`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Secondary Sections Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Accueil */}
            <div className='bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='p-2 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400'>
                  <ThumbsUp className='w-5 h-5' />
                </div>
                <h3 className='font-bold text-slate-900 dark:text-white'>Accueil</h3>
              </div>
              <div className='flex justify-center'>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star, 'host')}
                      className='transition-transform hover:scale-110'
                    >
                      <Star
                        className={`w-8 h-8 ${star <= hostRating ? 'fill-green-400 text-green-400' : 'text-slate-200 dark:text-slate-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Organisation */}
            <div className='bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400'>
                  <MessageSquare className='w-5 h-5' />
                </div>
                <h3 className='font-bold text-slate-900 dark:text-white'>Organisation</h3>
              </div>
              <div className='flex justify-center'>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star, 'organization')}
                      className='transition-transform hover:scale-110'
                    >
                      <Star
                        className={`w-8 h-8 ${star <= organizationRating ? 'fill-purple-400 text-purple-400' : 'text-slate-200 dark:text-slate-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Areas of Improvement */}
          <div className='bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-slate-400 mb-4'>
              Pistes d'amélioration
            </h3>
            <div className='flex flex-wrap gap-2'>
              {IMPROVEMENT_AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleImprovement(area)}
                  className={`
                                   px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                                   ${
                                     selectedImprovements.includes(area)
                                       ? 'bg-slate-800 text-white shadow-lg shadow-slate-500/20 scale-105'
                                       : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                                   }
                               `}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Comments */}
          <div className='bg-white dark:bg-slate-800 rounded-3xl p-1 shadow-sm border border-slate-100 dark:border-slate-700'>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className='w-full h-32 p-4 bg-transparent border-none resize-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder-slate-400'
              placeholder='Ajouter une observation personnelle, un détail marquant ou une suggestion...'
            />
          </div>

          {/* Privacy Toggle */}
          <div className='flex items-center gap-3 px-2'>
            <div
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isPrivate ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-600'}`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isPrivate ? 'translate-x-6' : ''}`}
              />
            </div>
            <span className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              Marquer comme confidentiel
            </span>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className='p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0'>
          <button
            onClick={onClose}
            className='px-6 py-3 text-sm font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 dark:hover:text-white transition-colors'
          >
            Annuler
          </button>
          <Button
            onClick={handleSubmit}
            disabled={speakerRating === 0}
            className='px-8 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-bold uppercase tracking-widest shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:shadow-none transition-all hover:scale-[1.02]'
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
