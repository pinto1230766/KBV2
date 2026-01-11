import { useCallback } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Visit } from '@/types';
import { useSettings } from '@/contexts/SettingsContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function useVisitNotifications() {
  const { settings } = useSettings();

  const requestPermissions = useCallback(async () => {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      return false;
    }
  }, []);

  const scheduleVisitReminder = useCallback(
    async (visit: Visit) => {
      const { notifications, messagingAutomation } = settings;
      if (!notifications.enabled) return;

      const visitDate = new Date(visit.visitDate);
      const notificationsToSchedule: any[] = [];

      // 1. Rappels de visite classiques (J-7, J-2, etc.)
      const reminders = notifications.reminderDays.length > 0 ? notifications.reminderDays : [3];
      for (const daysBefore of reminders) {
        const reminderDate = new Date(visitDate);
        reminderDate.setDate(visitDate.getDate() - daysBefore);
        reminderDate.setHours(9, 0, 0, 0);

        if (reminderDate.getTime() > Date.now()) {
          notificationsToSchedule.push({
            title: 'Rappel de visite',
            body: `Visite de ${visit.nom} le ${format(visitDate, 'EEEE d MMMM', { locale: fr })} (J-${daysBefore})`,
            id: parseInt(visit.id.replace(/\D/g, '').substring(0, 5)) + daysBefore * 1000,
            schedule: { at: reminderDate },
            extra: { visitId: visit.id, type: 'reminder' }
          });
        }
      }

      // 2. Rappels de communication (si activés)
      if (notifications.communicationReminders && messagingAutomation.enabled) {
        const commSteps = [
          { type: 'confirmation', days: messagingAutomation.confirmationLeadDays, label: 'Confirmation' },
          { type: 'preparation', days: messagingAutomation.preparationLeadDays, label: 'Préparation' },
          { type: 'reminder-7', days: 7, label: 'Rappel J-7', enabled: messagingAutomation.reminder7Enabled },
          { type: 'reminder-2', days: 2, label: 'Rappel J-2', enabled: messagingAutomation.reminder2Enabled },
          { type: 'thanks', days: -1, label: 'Remerciements', enabled: messagingAutomation.thanksEnabled }
        ];

        for (const step of commSteps) {
          if (step.enabled === false) continue;

          const stepDate = new Date(visitDate);
          stepDate.setDate(visitDate.getDate() - step.days);
          stepDate.setHours(10, 0, 0, 0); // 10h pour la communication

          if (stepDate.getTime() > Date.now()) {
            // Vérifier si le message a déjà été envoyé via communicationStatus
            const alreadySent = visit.communicationStatus?.[step.type]?.speaker || visit.communicationStatus?.[step.type]?.host;
            
            if (!alreadySent) {
              notificationsToSchedule.push({
                title: `Action requise : ${step.label}`,
                body: `Il est temps d'envoyer le message de ${step.label} pour ${visit.nom}`,
                id: parseInt(visit.id.replace(/\D/g, '').substring(0, 5)) + (step.days + 100) * 1000,
                schedule: { at: stepDate },
                extra: { visitId: visit.id, messageType: step.type, target: 'communication' }
              });
            }
          }
        }
      }

      if (notificationsToSchedule.length > 0) {
        try {
          await LocalNotifications.schedule({ notifications: notificationsToSchedule });
        } catch (error) {
          console.error('Erreur lors de la programmation des notifications:', error);
        }
      }
    },
    [settings]
  );

  const cancelVisitReminder = useCallback(async (visitId: string) => {
    // Note: Idéalement, il faudrait stocker l'ID de notification associé à la visite
    // Pour l'instant, c'est une implémentation simplifiée
    const pending = await LocalNotifications.getPending();
    const notification = pending.notifications.find((n) => n.extra?.visitId === visitId);

    if (notification) {
      await LocalNotifications.cancel({ notifications: [{ id: notification.id }] });
    }
  }, []);

  return {
    requestPermissions,
    scheduleVisitReminder,
    cancelVisitReminder,
  };
}
