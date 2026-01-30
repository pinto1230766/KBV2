import { Visit, WorkflowState } from '@/types';

/**
 * Types pour l'automation
 */
export interface AutomationRule {
  id: string;
  trigger: AutomationTrigger;
  condition: AutomationCondition;
  action: AutomationAction;
  enabled: boolean;
  name: string;
  description: string;
}

export interface AutomationTrigger {
  event: 'visit_created' | 'workflow_state_changed' | 'time_based' | 'manual';
  workflowState?: WorkflowState;
  delay?: {
    amount: number;
    unit: 'hours' | 'days' | 'weeks';
  };
}

export interface AutomationCondition {
  check: (visit: Visit) => boolean;
  description: string;
}

export interface AutomationAction {
  type: 'send_message' | 'update_status' | 'notification';
  actionId: string; // Correspond aux actions du SimpleMessageModal
  priority: 'low' | 'medium' | 'high';
}

/**
 * Règles d'automation par défaut basées sur le workflow utilisateur
 */
export const DEFAULT_AUTOMATION_RULES: AutomationRule[] = [
  // Après confirmation orateur → Recherche hôtes dans 2h
  {
    id: 'post_confirmation_host_search',
    trigger: {
      event: 'workflow_state_changed',
      workflowState: 'speaker_confirmed',
      delay: { amount: 2, unit: 'hours' }
    },
    condition: {
      check: (visit) => visit.status === 'confirmed',
      description: 'Visite confirmée par l\'orateur'
    },
    action: {
      type: 'send_message',
      actionId: 'find_hosts',
      priority: 'high'
    },
    enabled: true,
    name: 'Recherche hôtes post-confirmation',
    description: 'Envoie automatiquement une demande aux hôtes 2h après confirmation orateur'
  },

  // Rappel J-5 avant visite
  {
    id: 'reminder_j5',
    trigger: {
      event: 'time_based',
      delay: { amount: 5, unit: 'days' }
    },
    condition: {
      check: (visit) => {
        const now = new Date();
        const visitDate = new Date(visit.visitDate);
        const daysUntilVisit = Math.ceil((visitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilVisit === 5 && visit.status !== 'cancelled' && visit.status !== 'completed';
      },
      description: '5 jours avant la visite'
    },
    action: {
      type: 'send_message',
      actionId: 'reminder_week',
      priority: 'medium'
    },
    enabled: true,
    name: 'Rappel automatique J-5',
    description: 'Envoie un rappel 5 jours avant la visite'
  },

  // Remerciements après visite
  {
    id: 'thank_you_post_visit',
    trigger: {
      event: 'workflow_state_changed',
      workflowState: 'completed',
      delay: { amount: 1, unit: 'days' }
    },
    condition: {
      check: (visit) => visit.status === 'completed',
      description: 'Visite terminée'
    },
    action: {
      type: 'send_message',
      actionId: 'send_thanks',
      priority: 'low'
    },
    enabled: true,
    name: 'Remerciements post-visite',
    description: 'Envoie automatiquement les remerciements le lendemain de la visite'
  },

  // Rappel J-2 pour visites urgentes
  {
    id: 'reminder_j2_urgent',
    trigger: {
      event: 'time_based',
      delay: { amount: 2, unit: 'days' }
    },
    condition: {
      check: (visit) => {
        const now = new Date();
        const visitDate = new Date(visit.visitDate);
        const daysUntilVisit = Math.ceil((visitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilVisit === 2 &&
               visit.status !== 'cancelled' &&
               visit.status !== 'completed' &&
               !hasRecentCommunication(visit, 'reminder-7');
      },
      description: '2 jours avant visite et pas de rappel J-7 récent'
    },
    action: {
      type: 'send_message',
      actionId: 'reminder_final',
      priority: 'high'
    },
    enabled: true,
    name: 'Rappel J-2 urgent',
    description: 'Rappel final si pas de J-7 envoyé'
  }
];

/**
 * Vérifie si une communication récente existe pour un type donné
 */
function hasRecentCommunication(visit: Visit, messageType: string, maxAgeDays: number = 7): boolean {
  const commStatus = visit.communicationStatus || {};
  const lastCommunication = commStatus[messageType]?.speaker;

  if (!lastCommunication) return false;

  const now = new Date();
  const commDate = new Date(lastCommunication);
  const daysSince = (now.getTime() - commDate.getTime()) / (1000 * 60 * 60 * 24);

  return daysSince <= maxAgeDays;
}

/**
 * Exécute les automations pour une visite
 */
export function executeAutomations(visit: Visit, rules: AutomationRule[] = DEFAULT_AUTOMATION_RULES): AutomationAction[] {
  const actionsToExecute: AutomationAction[] = [];

  rules.forEach(rule => {
    if (!rule.enabled) return;

    // Vérification de la condition
    if (!rule.condition.check(visit)) return;

    // Vérification du trigger selon le type
    let shouldExecute = false;

    switch (rule.trigger.event) {
      case 'workflow_state_changed':
        // Pour l'instant, on exécute si l'état correspond (logique temporelle à implémenter)
        shouldExecute = true; // TODO: implémenter logique temporelle
        break;

      case 'time_based':
        // Pour l'instant, on simule (logique temporelle à implémenter)
        shouldExecute = false; // TODO: calculer si le timing correspond
        break;

      default:
        shouldExecute = false;
    }

    if (shouldExecute && !hasActionBeenExecuted(visit, rule.id)) {
      actionsToExecute.push(rule.action);
    }
  });

  return actionsToExecute;
}

/**
 * Vérifie si une action d'automation a déjà été exécutée
 */
function hasActionBeenExecuted(visit: Visit, ruleId: string): boolean {
  // TODO: implémenter suivi des automations exécutées
  // Pour l'instant, on utilise les communicationStatus existants
  const commStatus = visit.communicationStatus || {};

  switch (ruleId) {
    case 'post_confirmation_host_search':
      return !!commStatus['host_request']?.speaker;
    case 'reminder_j5':
      return !!commStatus['reminder-7']?.speaker;
    case 'reminder_j2_urgent':
      return !!commStatus['reminder-2']?.speaker;
    case 'thank_you_post_visit':
      return !!commStatus['thanks']?.speaker;
    default:
      return false;
  }
}

/**
 * Calcule les prochaines automations pour une visite
 */
export function getUpcomingAutomations(visit: Visit): Array<{ rule: AutomationRule; scheduledFor: Date }> {
  const upcoming: Array<{ rule: AutomationRule; scheduledFor: Date }> = [];

  DEFAULT_AUTOMATION_RULES.forEach(rule => {
    if (!rule.enabled || hasActionBeenExecuted(visit, rule.id)) return;

    let scheduledFor: Date | null = null;

    if (rule.trigger.delay) {
      const baseDate = getAutomationBaseDate(visit, rule);
      if (baseDate) {
        scheduledFor = calculateDelayDate(baseDate, rule.trigger.delay);
      }
    }

    if (scheduledFor && scheduledFor > new Date()) {
      upcoming.push({ rule, scheduledFor });
    }
  });

  return upcoming.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
}

/**
 * Détermine la date de base pour une automation
 */
function getAutomationBaseDate(visit: Visit, rule: AutomationRule): Date | null {
  switch (rule.id) {
    case 'post_confirmation_host_search': {
      // Après confirmation orateur
      const confirmationDate = visit.communicationStatus?.confirmation?.speaker;
      return confirmationDate ? new Date(confirmationDate) : null;
    }

    case 'reminder_j5':
    case 'reminder_j2_urgent': {
      // Avant la date de visite
      return new Date(visit.visitDate);
    }

    case 'thank_you_post_visit': {
      // Après la date de visite (si terminée)
      return visit.status === 'completed' ? new Date(visit.visitDate) : null;
    }

    default:
      return null;
  }
}

/**
 * Calcule une date avec un délai
 */
function calculateDelayDate(baseDate: Date, delay: { amount: number; unit: 'hours' | 'days' | 'weeks' }): Date {
  const result = new Date(baseDate);

  switch (delay.unit) {
    case 'hours':
      result.setHours(result.getHours() + delay.amount);
      break;
    case 'days':
      result.setDate(result.getDate() + delay.amount);
      break;
    case 'weeks':
      result.setDate(result.getDate() + (delay.amount * 7));
      break;
  }

  return result;
}

/**
 * Obtient toutes les automations actives pour le moment
 */
export function getActiveAutomations(visits: Visit[]): Array<{ visit: Visit; automation: AutomationRule; scheduledFor: Date }> {
  const activeAutomations: Array<{ visit: Visit; automation: AutomationRule; scheduledFor: Date }> = [];

  visits.forEach(visit => {
    const upcoming = getUpcomingAutomations(visit);
    upcoming.forEach(({ rule, scheduledFor }) => {
      activeAutomations.push({ visit, automation: rule, scheduledFor });
    });
  });

  return activeAutomations.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
}