import { useCallback } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Visit } from '@/types';
import { useSettings } from '@/contexts/SettingsContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function useVisitNotifications() {
  const { settings } = useSettings();

  const requestPermissions = useCallback(async () => {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }, []);

  const scheduleVisitReminder = useCallback(
    async (visit: Visit) => {
      if (!settings.notifications.enabled) return;

      const visitDate = new Date(visit.visitDate);
      // Programmer les rappels pour chaque délai configuré
      const reminders =
        settings.notifications.reminderDays.length > 0 ? settings.notifications.reminderDays : [3]; // Par défaut 3 jours avant

      for (const daysBefore of reminders) {
        const reminderDate = new Date(visitDate);
        reminderDate.setDate(visitDate.getDate() - daysBefore);
        reminderDate.setHours(9, 0, 0, 0); // À 9h du matin

        // Ne pas programmer si la date est passée
        if (reminderDate.getTime() < Date.now()) continue;

        try {
          await LocalNotifications.schedule({
            notifications: [
              {
                title: 'Rappel de visite',
                body: `Visite de ${visit.nom} prévue le ${format(visitDate, 'EEEE d MMMM', { locale: fr })} (J-${daysBefore})`,
                id:
                  parseInt(visit.id.replace(/\D/g, '').substring(0, 5)) + daysBefore * 10000 ||
                  Math.floor(Math.random() * 100000),
                schedule: { at: reminderDate },
                sound: 'default',
                attachments: [],
                actionTypeId: '',
                extra: { visitId: visit.id },
              },
            ],
          });
        } catch (error) {
          console.error('Erreur lors de la programmation de la notification:', error);
        }
      }
    },
    [settings.notifications]
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
