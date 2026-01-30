import { Visit } from '@/types';

/**
 * États intelligents du workflow de communication
 */
export enum CommunicationState {
  URGENT = 'urgent',        // Action immédiate requise (J-2 et moins)
  TO_PROCESS = 'to_process', // À traiter (confirmé mais pas préparé)
  IN_PROGRESS = 'in_progress', // En cours (messages envoyés)
  COMPLETED = 'completed'   // Terminé (tous messages requis envoyés)
}

/**
 * Actions contextuelles disponibles selon l'état
 */
export interface QuickAction {
  id: string;
  label: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

/**
 * Détermine l'état intelligent de communication d'une visite
 */
export function getWorkflowState(visit: Visit): CommunicationState {
  const now = new Date();
  const visitDate = new Date(visit.visitDate);
  const daysUntil = Math.ceil((visitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // URGENT : visites dans les 2 jours sans confirmation ou préparation
  if (daysUntil <= 2 && daysUntil >= -1) {
    if (visit.status === 'pending') return CommunicationState.URGENT;
    if (visit.status === 'confirmed' &&
        (!visit.communicationStatus?.confirmation?.speaker ||
         !visit.communicationStatus?.preparation?.speaker)) {
      return CommunicationState.URGENT;
    }
  }

  // À TRAITER : visites confirmées sans préparation complète (J-7 à J-3)
  if (daysUntil <= 7 && daysUntil > 2 && visit.status === 'confirmed') {
    if (!visit.communicationStatus?.preparation?.speaker) {
      return CommunicationState.TO_PROCESS;
    }
  }

  // EN COURS : visites avec des messages envoyés récemment
  if (visit.communicationStatus &&
      (visit.communicationStatus.confirmation?.speaker ||
       visit.communicationStatus.preparation?.speaker ||
       visit.communicationStatus.reminder?.speaker)) {
    return CommunicationState.IN_PROGRESS;
  }

  // TERMINÉ : tous les messages requis envoyés
  const hasConfirmation = visit.communicationStatus?.confirmation?.speaker;
  const hasPreparation = visit.communicationStatus?.preparation?.speaker;
  const hasReminder = visit.communicationStatus?.reminder?.speaker;

  if (visit.status === 'confirmed' && hasConfirmation && hasPreparation) {
    if (daysUntil <= 2) {
      // Proche de la visite, vérifie le rappel
      return hasReminder ? CommunicationState.COMPLETED : CommunicationState.IN_PROGRESS;
    }
    return CommunicationState.COMPLETED;
  }

  // Par défaut : à traiter si confirmé, urgent si en attente
  return visit.status === 'confirmed' ? CommunicationState.TO_PROCESS : CommunicationState.URGENT;
}

/**
 * Couleur associée à l'état du workflow
 */
export function getWorkflowStateColor(state: CommunicationState): string {
  switch (state) {
    case CommunicationState.URGENT: return '#ef4444'; // Red
    case CommunicationState.TO_PROCESS: return '#f97316'; // Orange
    case CommunicationState.IN_PROGRESS: return '#eab308'; // Yellow
    case CommunicationState.COMPLETED: return '#22c55e'; // Green
    default: return '#6b7280'; // Gray
  }
}

/**
 * Label associé à l'état du workflow
 */
export function getWorkflowStateLabel(state: CommunicationState): string {
  switch (state) {
    case CommunicationState.URGENT: return 'Urgent';
    case CommunicationState.TO_PROCESS: return 'À préparer';
    case CommunicationState.IN_PROGRESS: return 'En cours';
    case CommunicationState.COMPLETED: return 'Terminé';
    default: return 'Inconnu';
  }
}

/**
 * Actions rapides disponibles selon l'état de la visite
 */
export function getQuickActions(visit: Visit): QuickAction[] {
  const state = getWorkflowState(visit);
  const visitDate = new Date(visit.visitDate);
  const daysUntil = Math.ceil((visitDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  // Pour les visites en streaming/zoom ou orateurs de Lyon : seulement confirmation et remerciement
  const isRemoteOrLocal = visit.locationType === 'zoom' || visit.locationType === 'streaming' || visit.congregation?.includes('Lyon');
  
  if (isRemoteOrLocal) {
    if (visit.status === 'pending') {
      return [{
        id: 'confirm_speaker',
        label: 'Confirmer',
        priority: 'high',
        description: 'Envoyer confirmation orateur'
      }];
    } else if (visit.status === 'confirmed' && daysUntil <= 1) {
      return [{
        id: 'send_thanks',
        label: 'Remercier',
        priority: 'low',
        description: 'Remerciements post-visite'
      }];
    }
    return [];
  }

  switch (state) {
    case CommunicationState.URGENT:
      if (visit.status === 'pending') {
        return [{
          id: 'confirm_speaker',
          label: 'Confirmer',
          priority: 'high',
          description: 'Envoyer confirmation orateur'
        }];
      } else {
        // Visite confirmée mais incomplète proche
        if (!visit.communicationStatus?.preparation?.speaker) {
          return [{
            id: 'plan_logistics',
            label: 'Préparer',
            priority: 'high',
            description: 'Envoyer préparation logistique'
          }];
        } else {
          return [{
            id: 'reminder_final',
            label: 'Rappeler',
            priority: 'high',
            description: 'Dernier rappel avant visite'
          }];
        }
      }

    case CommunicationState.TO_PROCESS:
      // Visite confirmée, besoin de préparation (J-7 à J-3)
      if (!visit.communicationStatus?.preparation?.speaker) {
        return [{
          id: 'plan_logistics',
          label: 'Préparer',
          priority: 'medium',
          description: 'Envoyer logistique complète'
        }];
      } else if (daysUntil <= 3) {
        return [{
          id: 'reminder_week',
          label: 'Rappeler',
          priority: 'medium',
          description: 'Rappel une semaine avant'
        }];
      }
      return [];

    case CommunicationState.IN_PROGRESS:
      // Messages envoyés, vérifier si besoin de suivi
      if (daysUntil <= 1 && visit.status === 'confirmed') {
        return [{
          id: 'send_thanks',
          label: 'Remercier',
          priority: 'low',
          description: 'Remerciements post-visite'
        }];
      }
      return [];

    case CommunicationState.COMPLETED:
      // Rien à faire, tout est OK
      return [];

    default:
      return [];
  }
}

/**
 * Détermine si une visite nécessite une action immédiate
 */
export function needsImmediateAction(visit: Visit): boolean {
  return getWorkflowState(visit) === CommunicationState.URGENT;
}

/**
 * Priorité d'une visite pour le tri
 */
export function getVisitPriority(visit: Visit): number {
  const state = getWorkflowState(visit);
  const visitDate = new Date(visit.visitDate);
  const daysUntil = Math.ceil((visitDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  // URGENT = priorité maximale
  if (state === CommunicationState.URGENT) return 1000 - Math.max(0, daysUntil);

  // À traiter = priorité moyenne
  if (state === CommunicationState.TO_PROCESS) return 500 - daysUntil;

  // En cours = priorité basse
  if (state === CommunicationState.IN_PROGRESS) return 100 - daysUntil;

  // Terminé = priorité minimale
  return -daysUntil;
}