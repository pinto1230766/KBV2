import { Speaker, Visit, WorkloadBalance } from '@/types';
import { parseISO, isAfter, subMonths } from 'date-fns';

// Facteurs de pondération

// Seuil de visite critique (max par mois pour ne pas surcharger)
const MAX_VISITS_PER_MONTH = 2;

export const calculateWorkload = (
  speaker: Speaker,
  visits: Visit[],
  currentDate: Date = new Date()
): WorkloadBalance => {
  // On regarde les 6 derniers mois
  const sixMonthsAgo = subMonths(currentDate, 6);

  // Filtrer les visites passées de cet orateur
  const speakerVisits = visits.filter(
    (v) =>
      v.id === speaker.id &&
      (v.status === 'completed' || v.status === 'confirmed') &&
      isAfter(parseISO(v.visitDate), sixMonthsAgo)
  );

  // 1. Calcul de la charge actuelle (%)
  // Basé sur la fréquence récente : si > 1 visite/mois = charge élevée
  const visitsPerMonth = speakerVisits.length / 6;
  const rawLoad = (visitsPerMonth / MAX_VISITS_PER_MONTH) * 100;
  const currentLoad = Math.min(Math.round(rawLoad), 100);

  // 2. Score de charge (1-5)
  let workloadScore = 1;
  if (currentLoad > 80) workloadScore = 5;
  else if (currentLoad > 60) workloadScore = 4;
  else if (currentLoad > 40) workloadScore = 3;
  else if (currentLoad > 20) workloadScore = 2;

  // 3. Dernière visite
  const sortedVisits = [...speakerVisits].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );
  const lastVisit = sortedVisits.length > 0 ? sortedVisits[0].visitDate : null;

  // 4. Estimation temps trajet (Simulé ici, idéalement viendrait de Google Maps API)
  // On pourrait utiliser la localisation de la congrégation vs domicile orateur
  const travelTime = 30; // Valeur par défaut

  return {
    speakerId: speaker.id,
    speakerName: speaker.nom,
    currentLoad,
    maxCapacity: MAX_VISITS_PER_MONTH * 100, // Capacité théorique relative pour l'affichage
    lastVisit,
    travelTime,
    workloadScore,
    availabilityNextMonth: currentLoad < 80, // Si < 80% chargé, dispo
  };
};

export const getWorkloadColor = (score: number): string => {
  switch (score) {
    case 5:
      return 'bg-red-500 text-white';
    case 4:
      return 'bg-orange-500 text-white';
    case 3:
      return 'bg-yellow-500 text-white';
    case 2:
      return 'bg-blue-500 text-white';
    default:
      return 'bg-green-500 text-white';
  }
};

export const getWorkloadLabel = (score: number): string => {
  switch (score) {
    case 5:
      return 'Surchargé';
    case 4:
      return 'Très occupé';
    case 3:
      return 'Occupé';
    case 2:
      return 'Modéré';
    default:
      return 'Disponible';
  }
};
