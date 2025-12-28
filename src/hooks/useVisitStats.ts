import { useMemo } from 'react';
import { Visit, Speaker, Host } from '@/types';

/**
 * Hook centralisé pour calculer toutes les statistiques des visites
 * Remplace les calculs dupliqués dans Dashboard.tsx, Messages.tsx, etc.
 */
export const useVisitStats = (visits: Visit[]) => {
  return useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Calculs de base
    const pendingTotal = visits.filter((v) => v.status === 'pending').length;
    const confirmedTotal = visits.filter((v) => v.status === 'confirmed').length;
    const completedTotal = visits.filter((v) => v.status === 'completed').length;
    const cancelledTotal = visits.filter((v) => v.status === 'cancelled').length;

    // Visites de ce mois
    const thisMonthVisits = visits.filter((v) => {
      const visitDate = new Date(v.visitDate);
      return (
        visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear()
      );
    });

    // Prochaines visites (5 prochaines, pas annulées)
    const upcomingVisits = visits
      .filter((v) => {
        const visitDate = new Date(v.visitDate);
        return visitDate >= today && v.status !== 'cancelled';
      })
      .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime())
      .slice(0, 5);

    // Visites nécessitant une action
    const needsAction = visits.filter((v) => {
      const visitDate = new Date(v.visitDate);
      return (
        v.status === 'pending' ||
        (v.status === 'confirmed' && !v.host) ||
        (v.status === 'completed' && visitDate < today)
      );
    });

    // Statuts des visites
    const statusStats = {
      pending: pendingTotal,
      confirmed: confirmedTotal,
      completed: completedTotal,
      cancelled: cancelledTotal,
    };

    // Pourcentages
    const totalNonCancelled = confirmedTotal + completedTotal;
    const completionRate =
      totalNonCancelled > 0 ? Math.round((completedTotal / totalNonCancelled) * 100) : 0;

    const confirmationRate =
      thisMonthVisits.length > 0 ? Math.round((confirmedTotal / thisMonthVisits.length) * 100) : 0;

    return {
      // Comptes de base
      pendingTotal,
      confirmedTotal,
      completedTotal,
      cancelledTotal,
      totalNonCancelled,

      // Visites par période
      thisMonthCount: thisMonthVisits.length,
      upcomingCount: upcomingVisits.length,
      needsActionCount: needsAction.length,

      // Prochaines visites triées
      upcomingVisits,

      // Statuts détaillés
      statusStats,

      // Pourcentages calculés
      completionRate,
      confirmationRate,

      // Mois et statistiques temporelles
      currentMonth: now.getMonth(),
      currentYear: now.getFullYear(),

      // Données complètes pour les graphiques
      monthlyData: generateMonthlyData(visits, now),
    };
  }, [visits]);
};

/**
 * Génère les données mensuelles pour les graphiques
 */
const generateMonthlyData = (visits: Visit[], referenceDate: Date) => {
  const data = [];
  const months = [
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Juin',
    'Jul',
    'Août',
    'Sep',
    'Oct',
    'Nov',
    'Déc',
  ];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
    const monthVisits = visits.filter((v) => {
      const visitDate = new Date(v.visitDate);
      return (
        visitDate.getMonth() === date.getMonth() && visitDate.getFullYear() === date.getFullYear()
      );
    });

    data.push({
      name: months[date.getMonth()],
      value: monthVisits.length,
      confirmed: monthVisits.filter((v) => v.status === 'confirmed').length,
      completed: monthVisits.filter((v) => v.status === 'completed').length,
    });
  }

  return data;
};

/**
 * Hook pour calculer les statistiques globales de l'application
 */
export const useAppStats = (visits: Visit[], speakers: Speaker[], hosts: Host[]) => {
  const visitStats = useVisitStats(visits);

  return useMemo(
    () => ({
      // Statistiques des visites
      visits: visitStats,

      // Statistiques des orateurs
      speakers: {
        total: speakers.length,
        // Tous les orateurs sont actifs par défaut
        active: speakers.length,
        inactive: 0,
      },

      // Statistiques des hôtes
      hosts: {
        total: hosts.length,
        // Les hôtes sans dates d'indisponibilité sont disponibles
        available: hosts.filter((h) => !h.unavailableDates || h.unavailableDates.length === 0)
          .length,
        unavailable: hosts.filter((h) => h.unavailableDates && h.unavailableDates.length > 0)
          .length,
      },

      // Indicateurs globaux
      global: {
        totalEntities: visits.length + speakers.length + hosts.length,
        activeEntities:
          visitStats.confirmedTotal +
          speakers.length +
          hosts.filter((h) => !h.unavailableDates || h.unavailableDates.length === 0).length,
        pendingActions: visitStats.needsActionCount,
      },
    }),
    [visits, speakers, hosts]
  );
};
