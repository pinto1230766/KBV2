import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { VisitFeedback } from '@/types';
import { IOSButton } from '@/components/ui/IOSButton';
import { usePlatform } from '@/hooks/usePlatform';
import { Send } from 'lucide-react';

interface FeedbackFormProps {
  visitId: string;
  initialFeedback?: VisitFeedback;
  onSubmit: (feedback: Omit<VisitFeedback, 'id' | 'visitId' | 'submittedBy' | 'submittedAt'>) => void;
  onCancel: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({

  initialFeedback,
  onSubmit,
  onCancel
}) => {
  const { platform } = usePlatform();
  const isIOS = platform === 'ios';
  const [speakerRating, setSpeakerRating] = useState(initialFeedback?.speakerRating || 0);
  const [hostRating, setHostRating] = useState(initialFeedback?.hostRating || 0);
  const [organizationRating, setOrganizationRating] = useState(initialFeedback?.organizationRating || 0);
  const [comments, setComments] = useState(initialFeedback?.comments || '');
  const [isPrivate, setIsPrivate] = useState(initialFeedback?.isPrivate || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      speakerRating,
      hostRating,
      organizationRating,
      comments,
      isPrivate
    });
  };

  const ActionButton = isIOS ? IOSButton : Button;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Appréciation de l'orateur (Encouragement)
          </label>
          <StarRating 
            rating={speakerRating} 
            onRatingChange={setSpeakerRating} 
            size="lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Accueil et Hospitalité
          </label>
          <StarRating 
            rating={hostRating} 
            onRatingChange={setHostRating} 
            size="lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Organisation Générale
          </label>
          <StarRating 
            rating={organizationRating} 
            onRatingChange={setOrganizationRating} 
            size="lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Commentaires & Suggestions
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            rows={4}
            placeholder="Partagez votre expérience globale..."
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="isPrivate" className="text-sm text-gray-600 dark:text-gray-400">
            Note confidentielle (Admin/Coordinateur uniquement)
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <ActionButton
          type="submit"
          variant="primary"
          leftIcon={isIOS ? undefined : <Send className="w-4 h-4" />}
          disabled={speakerRating === 0}
        >
          Envoyer le bilan
        </ActionButton>
      </div>
    </form>
  );
};
