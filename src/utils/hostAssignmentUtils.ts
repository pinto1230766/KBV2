import { Visit } from '@/types';

/**
 * Vérifie si une visite a besoin d'hôtes en fonction de son type de lieu et de sa congrégation
 * @param visit - La visite à vérifier
 * @returns true si la visite a besoin d'hôtes, false sinon
 */
export const needsHosts = (visit: Visit): boolean => {
  // Les visites en streaming ou vidéoconférence n'ont pas besoin d'hôtes
  if (visit.locationType === 'streaming' || visit.locationType === 'zoom') {
    return false;
  }

  // Les visiteurs de l'agrégation Lyon KBV n'ont pas besoin d'hôtes car ils sont sur place
  const lyonKbvCongregations = [
    'Lyon KBV',
    'Lyon - KBV',
    'KBV Lyon',
    'Lyon',
    'Lyon Centre',
    'Lyon Est',
    'Lyon Ouest',
    'Lyon Sud'
  ];

  // Vérifier si la congrégation du visiteur fait partie de l'agrégation Lyon KBV
  if (lyonKbvCongregations.some(lyonCong => 
    visit.congregation.toLowerCase().includes(lyonCong.toLowerCase()) ||
    lyonCong.toLowerCase().includes(visit.congregation.toLowerCase())
  )) {
    return false;
  }

  // Tous les autres cas (visites physiques hors Lyon KBV) ont besoin d'hôtes
  return visit.locationType === 'physical';
};

/**
 * Retourne la raison pour laquelle une visite n'a pas besoin d'hôtes
 * @param visit - La visite à vérifier
 * @returns La raison ou null si des hôtes sont nécessaires
 */
export const getNoHostReason = (visit: Visit): string | null => {
  if (visit.locationType === 'streaming') {
    return 'Visite en streaming - aucun hébergement nécessaire';
  }

  if (visit.locationType === 'zoom') {
    return 'Visite en vidéoconférence - aucun hébergement nécessaire';
  }

  const lyonKbvCongregations = [
    'Lyon KBV',
    'Lyon - KBV',
    'KBV Lyon',
    'Lyon',
    'Lyon Centre',
    'Lyon Est',
    'Lyon Ouest',
    'Lyon Sud'
  ];

  if (lyonKbvCongregations.some(lyonCong => 
    visit.congregation.toLowerCase().includes(lyonCong.toLowerCase()) ||
    lyonCong.toLowerCase().includes(visit.congregation.toLowerCase())
  )) {
    return 'Visiteur de l\'agrégation Lyon KBV - sur place, aucun hébergement nécessaire';
  }

  return null;
};

/**
 * Filtre les visites qui ont besoin d'hôtes
 * @param visits - Liste des visites
 * @returns Visites qui nécessitent des hôtes
 */
export const filterVisitsNeedingHosts = (visits: Visit[]): Visit[] => {
  return visits.filter(visit => needsHosts(visit));
};

/**
 * Filtre les visites qui n'ont pas besoin d'hôtes
 * @param visits - Liste des visites
 * @returns Visites qui ne nécessitent pas d'hôtes
 */
export const filterVisitsNotNeedingHosts = (visits: Visit[]): Visit[] => {
  return visits.filter(visit => !needsHosts(visit));
};
