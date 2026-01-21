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
  const actions: QuickAction[] = [];
  const visitDate = new Date(visit.visitDate);
  const daysUntil = Math.ceil((visitDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isPastVisit = daysUntil < 0;

  // 1. Confirmation orateur (si en attente)
  if (visit.status === 'pending' && !visit.communicationStatus?.confirmation?.speaker) {
    actions.push({
      id: 'confirm_speaker',
      label: 'Confirmer',
      priority: 'high',
      description: 'Confirmer la visite avec l\'orateur'
    });
  }

  // 2. Demande d'accueil groupe (si confirmé et pas d'hôtes)
  if (visit.status === 'confirmed' && !visit.hostAssignments?.length && !visit.communicationStatus?.host_request?.group) {
    actions.push({
      id: 'find_hosts',
      label: 'Chercher hôtes',
      priority: 'high',
      description: 'Demander des volontaires au groupe'
    });
  }

  // 3. Préparation/Logistique (si confirmé mais pas préparé)
  if (visit.status === 'confirmed' && !visit.communicationStatus?.preparation?.speaker && daysUntil > 2) {
    actions.push({
      id: 'plan_logistics',
      label: 'Préparer',
      priority: daysUntil <= 7 ? 'high' : 'medium',
      description: 'Envoyer infos logistiques'
    });
  }

  // 4. Récapitulatif groupe (si hôtes assignés et pas envoyé)
  if (visit.hostAssignments?.length && !visit.communicationStatus?.visit_recap?.group && daysUntil > 0 && daysUntil <= 7) {
    actions.push({
      id: 'visit_recap',
      label: 'Récap groupe',
      priority: 'medium',
      description: 'Envoyer planning au groupe'
    });
  }

  // 5. Rappel J-7 (si préparé et 7 jours avant)
  if (visit.communicationStatus?.preparation?.speaker && !visit.communicationStatus?.reminder?.speaker && daysUntil <= 7 && daysUntil > 2) {
    actions.push({
      id: 'reminder_week',
      label: 'Rappel J-7',
      priority: 'medium',
      description: 'Rappel une semaine avant'
    });
  }

  // 6. Rappel J-2 (si 2 jours avant ou moins)
  if (visit.status === 'confirmed' && daysUntil <= 2 && daysUntil >= 0 && !visit.communicationStatus?.reminder?.speaker) {
    actions.push({
      id: 'reminder_final',
      label: 'Rappel J-2',
      priority: 'high',
      description: 'Dernier rappel avant visite'
    });
  }

  // 7. Remerciements orateur (après la visite)
  if (isPastVisit && visit.status === 'confirmed' && !visit.communicationStatus?.thanks?.speaker && daysUntil >= -7) {
    actions.push({
      id: 'send_thanks',
      label: 'Remercier orateur',
      priority: 'low',
      description: 'Remercier l\'orateur'
    });
  }

  // 8. Remerciements hôtes (après la visite)
  if (isPastVisit && visit.hostAssignments?.length && !visit.communicationStatus?.thanks?.host && daysUntil >= -7) {
    actions.push({
      id: 'host_thanks',
      label: 'Remercier hôtes',
      priority: 'low',
      description: 'Remercier les hôtes'
    });
  }

  return actions;
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