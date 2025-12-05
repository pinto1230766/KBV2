import React from 'react';
import { Visit } from '@/types';
import { CheckCircle2, Circle } from 'lucide-react';

interface CommunicationProgressProps {
  visit: Visit;
  showLabels?: boolean;
  size?: 'sm' | 'md';
}

export const CommunicationProgress: React.FC<CommunicationProgressProps> = ({
  visit,
  showLabels = false,
  size = 'md'
}) => {
  // Définir les étapes de communication
  const steps = [
    { key: 'confirmation', label: 'Confirmation', role: 'speaker' },
    { key: 'preparation', label: 'Préparation', role: 'speaker' },
    { key: 'reminder-7', label: 'Rappel J-7', role: 'speaker' },
    { key: 'reminder-2', label: 'Rappel J-2', role: 'speaker' },
    { key: 'thanks', label: 'Remerciements', role: 'speaker' }
  ];

  // Calculer le nombre d'étapes complétées
  const completedSteps = steps.filter(step => {
    const stepData = visit.communicationStatus?.[step.key as keyof typeof visit.communicationStatus];
    return stepData && (stepData as any)[step.role];
  });

  const totalSteps = steps.length;
  const completedCount = completedSteps.length;
  const progress = (completedCount / totalSteps) * 100;

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="space-y-2">
      {/* Barre de progression */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Texte de progression */}
      <div className="flex items-center justify-between">
        <p className={`text-gray-600 dark:text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {completedCount}/{totalSteps} étapes
        </p>
        <span className={`font-medium ${
          progress === 100 
            ? 'text-green-600 dark:text-green-400' 
            : progress > 50 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400'
        } ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Liste détaillée des étapes (optionnel) */}
      {showLabels && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {steps.map((step) => {
            const isCompleted = completedSteps.some(s => s.key === step.key);
            return (
              <div 
                key={step.key}
                className={`flex items-center gap-2 text-xs ${
                  isCompleted 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className={iconSize} />
                ) : (
                  <Circle className={iconSize} />
                )}
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
