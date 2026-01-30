import { Visit } from '@/types';
import { getUpcomingAutomations, AutomationRule } from './automationEngine';

/**
 * Service de planification des automations
 */
export class AutomationScheduler {
  private static instance: AutomationScheduler;
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private automationCallbacks: Map<string, (visitId: string, actionId: string) => void> = new Map();

  private constructor() {}

  static getInstance(): AutomationScheduler {
    if (!AutomationScheduler.instance) {
      AutomationScheduler.instance = new AutomationScheduler();
    }
    return AutomationScheduler.instance;
  }

  /**
   * Programme une automation pour une visite
   */
  scheduleAutomation(visit: Visit, rule: AutomationRule, callback: (visitId: string, actionId: string) => void): void {
    const visitId = visit.visitId;
    const automationId = `${visitId}-${rule.id}`;

    // Annule tout timer existant pour cette automation
    this.cancelAutomation(automationId);

    // Calcule le délai jusqu'à l'exécution
    const upcoming = getUpcomingAutomations(visit);
    const automation = upcoming.find(a => a.rule.id === rule.id);

    if (!automation) return;

    const delayMs = automation.scheduledFor.getTime() - Date.now();

    if (delayMs <= 0) {
      // Exécute immédiatement si le délai est dépassé
      callback(visitId, rule.action.actionId);
      return;
    }

    // Programme l'exécution
    const timer = setTimeout(() => {
      callback(visitId, rule.action.actionId);
      this.timers.delete(automationId);
      this.automationCallbacks.delete(automationId);
    }, delayMs);

    this.timers.set(automationId, timer);
    this.automationCallbacks.set(automationId, callback);

    console.log(`Automation programmée: ${rule.name} pour visite ${visitId} dans ${Math.round(delayMs / (1000 * 60))} minutes`);
  }

  /**
   * Annule une automation programmée
   */
  cancelAutomation(automationId: string): void {
    const timer = this.timers.get(automationId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(automationId);
      this.automationCallbacks.delete(automationId);
      console.log(`Automation annulée: ${automationId}`);
    }
  }

  /**
   * Annule toutes les automations pour une visite
   */
  cancelVisitAutomations(visitId: string): void {
    const automationIds = Array.from(this.timers.keys()).filter(id => id.startsWith(`${visitId}-`));
    automationIds.forEach(id => this.cancelAutomation(id));
  }

  /**
   * Obtient les automations actives pour une visite
   */
  getActiveAutomations(visitId: string): Array<{ id: string; callback: (visitId: string, actionId: string) => void }> {
    const active: Array<{ id: string; callback: (visitId: string, actionId: string) => void }> = [];

    this.automationCallbacks.forEach((callback, automationId) => {
      if (automationId.startsWith(`${visitId}-`)) {
        active.push({ id: automationId, callback });
      }
    });

    return active;
  }

  /**
   * Nettoie toutes les automations (pour les tests ou le développement)
   */
  clearAll(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.automationCallbacks.clear();
    console.log('Toutes les automations ont été nettoyées');
  }

  /**
   * Obtient le nombre d'automatisations actives
   */
  getActiveCount(): number {
    return this.timers.size;
  }
}

// Instance globale
export const automationScheduler = AutomationScheduler.getInstance();

/**
 * Fonctions utilitaires pour l'intégration avec le système de messagerie
 */

/**
 * Programme toutes les automations pour une visite
 */
export function scheduleVisitAutomations(
  visit: Visit,
  onAutomationExecute: (visitId: string, actionId: string) => void
): void {
  const upcoming = getUpcomingAutomations(visit);

  upcoming.forEach(({ rule }) => {
    automationScheduler.scheduleAutomation(visit, rule, onAutomationExecute);
  });
}

/**
 * Met à jour les automations après un changement de visite
 */
export function updateVisitAutomations(
  visit: Visit,
  onAutomationExecute: (visitId: string, actionId: string) => void
): void {
  // Annule les automations existantes
  automationScheduler.cancelVisitAutomations(visit.visitId);

  // Programme les nouvelles automations
  scheduleVisitAutomations(visit, onAutomationExecute);
}

/**
 * Nettoie les automations après suppression ou annulation de visite
 */
export function cleanupVisitAutomations(visitId: string): void {
  automationScheduler.cancelVisitAutomations(visitId);
}