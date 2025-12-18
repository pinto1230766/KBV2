import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Save } from 'lucide-react';
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

  const StarRating = ({
    rating,
    onRate,
    label,
  }: {
    rating: number;
    onRate: (rating: number) => void;
    label: string;
  }) => (
    <div className='space-y-2'>
      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>{label}</label>
      <div className='flex gap-2'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type='button'
            onClick={() => onRate(star)}
            aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
            className='focus:outline-none transition-transform hover:scale-110'
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className='ml-2 text-sm text-gray-600 dark:text-gray-400 self-center'>
            {rating}/5
          </span>
        )}
      </div>
    </div>
  );

  const getOverallRating = () => {
    const ratings = [speakerRating, hostRating, organizationRating].filter((r) => r > 0);
    if (ratings.length === 0) return 0;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Évaluation de la visite' size='lg'>
      <div className='space-y-6'>
        {/* En-tête de la visite */}
        <div className='p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg'>
          <h4 className='font-semibold text-gray-900 dark:text-white mb-1'>{visit.nom}</h4>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          {visit.talkTheme && (
            <p className='text-sm text-gray-700 dark:text-gray-300 mt-2'>
              <strong>Discours :</strong> {visit.talkNoOrType} - {visit.talkTheme}
            </p>
          )}
        </div>

        {/* Note globale */}
        {speakerRating > 0 && (
          <div className='flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg'>
            <div className='text-center'>
              <div className='text-4xl font-bold text-yellow-600'>{getOverallRating()}</div>
              <div className='text-sm text-yellow-800 dark:text-yellow-300'>Note globale</div>
            </div>
          </div>
        )}

        {/* Évaluation de l'orateur */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700'>
            <Star className='w-5 h-5 text-primary-600' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Évaluation de l'orateur
            </h3>
          </div>

          <StarRating
            rating={speakerRating}
            onRate={(rating) => handleStarClick(rating, 'speaker')}
            label="Note générale de l'orateur *"
          />

          {/* Évaluation par catégorie */}
          <div className='space-y-3'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Évaluation détaillée (optionnel)
            </label>
            {FEEDBACK_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
              >
                <div className='flex items-center gap-2'>
                  <span className='text-xl'>{category.icon}</span>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>{category.label}</span>
                </div>
                <div className='flex gap-1'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => handleCategoryRating(category.id, star)}
                      aria-label={`${category.label}: ${star} étoile${star > 1 ? 's' : ''}`}
                      className='focus:outline-none'
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= (categoryRatings[category.id] || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Axes d'amélioration */}
        <div className='space-y-3'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Axes d'amélioration suggérés (optionnel)
          </label>
          <div className='grid grid-cols-2 gap-2'>
            {IMPROVEMENT_AREAS.map((area) => (
              <button
                key={area}
                type='button'
                onClick={() => toggleImprovement(area)}
                className={`p-2 text-sm rounded-lg border-2 transition-all ${
                  selectedImprovements.includes(area)
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Évaluation de l'hôte */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700'>
            <ThumbsUp className='w-5 h-5 text-green-600' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Évaluation de l'accueil
            </h3>
          </div>

          <StarRating
            rating={hostRating}
            onRate={(rating) => handleStarClick(rating, 'host')}
            label="Qualité de l'accueil (optionnel)"
          />
        </div>

        {/* Évaluation de l'organisation */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700'>
            <MessageSquare className='w-5 h-5 text-blue-600' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Évaluation de l'organisation
            </h3>
          </div>

          <StarRating
            rating={organizationRating}
            onRate={(rating) => handleStarClick(rating, 'organization')}
            label='Organisation générale (optionnel)'
          />
        </div>

        {/* Commentaires */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Commentaires détaillés
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            rows={4}
            placeholder="Partagez vos impressions, points forts, suggestions d'amélioration..."
          />
        </div>

        {/* Options de confidentialité */}
        <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <label className='flex items-start gap-3 cursor-pointer'>
            <input
              type='checkbox'
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className='mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
            />
            <div>
              <span className='font-medium text-gray-900 dark:text-white'>
                Évaluation confidentielle
              </span>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                Cette évaluation sera visible uniquement par les coordinateurs et ne sera pas
                partagée avec l'orateur
              </p>
            </div>
          </label>
        </div>

        {/* Résumé */}
        {speakerRating > 0 && (
          <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
            <div className='flex items-center gap-2 mb-2'>
              <MessageSquare className='w-4 h-4 text-blue-600' />
              <span className='text-sm font-medium text-blue-900 dark:text-blue-200'>
                Résumé de l'évaluation
              </span>
            </div>
            <div className='text-sm text-blue-800 dark:text-blue-300 space-y-1'>
              <p>• Note orateur : {speakerRating}/5</p>
              {hostRating > 0 && <p>• Note accueil : {hostRating}/5</p>}
              {organizationRating > 0 && <p>• Note organisation : {organizationRating}/5</p>}
              {selectedImprovements.length > 0 && (
                <p>• {selectedImprovements.length} axe(s) d'amélioration suggéré(s)</p>
              )}
              {comments && <p>• Commentaires ajoutés</p>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className='flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button variant='primary' onClick={handleSubmit} disabled={speakerRating === 0}>
            <Save className='w-4 h-4 mr-2' />
            Enregistrer l'évaluation
          </Button>
        </div>
      </div>
    </Modal>
  );
};
