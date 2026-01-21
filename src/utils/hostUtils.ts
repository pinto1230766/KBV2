import { Visit, HostAssignment } from '@/types';

/**
 * Obtient le nom de l'hôte principal (celui qui fait l'hébergement) d'une visite
 * Supporte à la fois l'ancien système (visit.host) et le nouveau système (visit.hostAssignments)
 */
export const getPrimaryHostName = (visit: Visit): string => {
  // Si on a des hostAssignments, prendre celui avec le rôle 'accommodation'
  if (visit.hostAssignments && visit.hostAssignments.length > 0) {
    const accommodationHost = visit.hostAssignments.find(
      (assignment) => assignment.role === 'accommodation'
    );
    if (accommodationHost) {
      return accommodationHost.hostName;
    }
    // Si pas d'hébergement spécifié, prendre le premier hôte
    return visit.hostAssignments[0].hostName;
  }

  // Fallback vers l'ancien système
  return visit.host || '';
};

/**
 * Vérifie si une visite a un hôte assigné (nouveau ou ancien système)
 */
export const hasHostAssigned = (visit: Visit): boolean => {
  if (visit.hostAssignments && visit.hostAssignments.length > 0) {
    return true;
  }
  return !!(visit.host && visit.host !== 'À définir' && visit.host !== '');
};

/**
 * Obtient tous les hôtes assignés à une visite avec leurs rôles
 */
export const getAllHostsWithRoles = (visit: Visit): HostAssignment[] => {
  return visit.hostAssignments || [];
};

/**
 * Vérifie si un orateur a besoin d'un hôte (pas local)
 */
export const needsHost = (visit: Visit): boolean => {
  // Les orateurs de Lyon n'ont pas besoin d'hôtes
  if (visit.congregation?.toLowerCase().includes('lyon')) {
    return false;
  }

  // Pour les visites physiques, vérifier si on a un hôte
  if (visit.locationType === 'physical') {
    return !hasHostAssigned(visit);
  }

  // Les visites virtuelles n'ont pas besoin d'hôtes
  return false;
};

/**
 * Filtre les visites qui ont besoin d'hôtes
 */
export const filterVisitsNeedingHost = (visits: Visit[]): Visit[] => {
  return visits.filter((visit) => needsHost(visit));
};

/**
 * Obtient le nombre d'hôtes actifs (ceux qui ont des visites assignées)
 */
export const getActiveHostsCount = (visits: Visit[]): number => {
  const activeHostNames = new Set<string>();

  visits.forEach((visit) => {
    if (visit.hostAssignments && visit.hostAssignments.length > 0) {
      visit.hostAssignments.forEach((assignment) => {
        activeHostNames.add(assignment.hostName);
      });
    } else if (visit.host && visit.host !== 'À définir') {
      activeHostNames.add(visit.host);
    }
  });

  return activeHostNames.size;
};
