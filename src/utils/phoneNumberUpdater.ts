// ============================================================================
// UTILITAIRE DE MISE À JOUR DES NUMÉROS DE TÉLÉPHONE
// ============================================================================

import { Speaker, Host } from '@/types';

/**
 * Interface pour les données d'un orateur/hôte avec téléphone
 */
interface PersonWithPhone {
  nom: string;
  telephone?: string;
  congregation?: string;
}

/**
 * Fonction pour extraire les numéros de téléphone du JSON
 */
export function extractPhoneNumbersFromJson(jsonData: any) {
  const speakersWithPhones: PersonWithPhone[] = [];
  const hostsWithPhones: PersonWithPhone[] = [];

  // Extraire des orateurs
  if (jsonData.speakers) {
    jsonData.speakers.forEach((speaker: any) => {
      if (speaker.telephone && speaker.telephone.trim()) {
        speakersWithPhones.push({
          nom: speaker.nom,
          telephone: speaker.telephone,
          congregation: speaker.congregation
        });
      }
    });
  }

  // Extraire des visites (les visites contiennent aussi les infos des orateurs)
  if (jsonData.visits) {
    jsonData.visits.forEach((visit: any) => {
      if (visit.telephone && visit.telephone.trim()) {
        speakersWithPhones.push({
          nom: visit.nom,
          telephone: visit.telephone,
          congregation: visit.congregation
        });
      }
    });
  }

  // Extraire des hôtes
  if (jsonData.hosts) {
    jsonData.hosts.forEach((host: any) => {
      if (host.telephone && host.telephone.trim()) {
        hostsWithPhones.push({
          nom: host.nom,
          telephone: host.telephone
        });
      }
    });
  }

  return { speakersWithPhones, hostsWithPhones };
}

/**
 * Fonction pour mettre à jour les numéros de téléphone des orateurs
 */
export function updateSpeakersWithPhones(
  existingSpeakers: Speaker[],
  speakersWithPhones: PersonWithPhone[]
): Speaker[] {
  const phoneMap = new Map<string, string>();
  
  // Créer une map nom -> téléphone (en normalisant les noms)
  speakersWithPhones.forEach(person => {
    const normalizedName = person.nom.toLowerCase().replace(/\s+/g, ' ').trim();
    phoneMap.set(normalizedName, person.telephone!);
  });

  // Mettre à jour les orateurs existants
  return existingSpeakers.map(speaker => {
    const normalizedName = speaker.nom.toLowerCase().replace(/\s+/g, ' ').trim();
    const phoneFromJson = phoneMap.get(normalizedName);
    
    // Si on trouve un numéro et que l'orateur n'en a pas, on le met à jour
    if (phoneFromJson && !speaker.telephone) {
      return {
        ...speaker,
        telephone: phoneFromJson,
        updatedAt: new Date().toISOString()
      };
    }
    
    return speaker;
  });
}

/**
 * Fonction pour mettre à jour les numéros de téléphone des hôtes
 */
export function updateHostsWithPhones(
  existingHosts: Host[],
  hostsWithPhones: PersonWithPhone[]
): Host[] {
  const phoneMap = new Map<string, string>();
  
  // Créer une map nom -> téléphone
  hostsWithPhones.forEach(host => {
    const normalizedName = host.nom.toLowerCase().replace(/\s+/g, ' ').trim();
    phoneMap.set(normalizedName, host.telephone!);
  });

  // Mettre à jour les hôtes existants
  return existingHosts.map(host => {
    const normalizedName = host.nom.toLowerCase().replace(/\s+/g, ' ').trim();
    const phoneFromJson = phoneMap.get(normalizedName);
    
    // Si on trouve un numéro et que l'hôte n'en a pas, on le met à jour
    if (phoneFromJson && !host.telephone) {
      return {
        ...host,
        telephone: phoneFromJson,
        updatedAt: new Date().toISOString()
      };
    }
    
    return host;
  });
}

/**
 * Fonction pour générer un rapport des modifications
 */
export function generateUpdateReport(
  originalSpeakers: Speaker[],
  updatedSpeakers: Speaker[],
  originalHosts: Host[],
  updatedHosts: Host[]
): {
  speakersUpdated: number;
  hostsUpdated: number;
  speakerDetails: string[];
  hostDetails: string[];
} {
  const speakerDetails: string[] = [];
  const hostDetails: string[] = [];
  
  let speakersUpdated = 0;
  let hostsUpdated = 0;

  // Rapport des orateurs
  originalSpeakers.forEach((original, index) => {
    const updated = updatedSpeakers[index];
    if (original.telephone !== updated.telephone && updated.telephone) {
      speakersUpdated++;
      speakerDetails.push(`✓ ${updated.nom}: +${updated.telephone}`);
    }
  });

  // Rapport des hôtes
  originalHosts.forEach((original, index) => {
    const updated = updatedHosts[index];
    if (original.telephone !== updated.telephone && updated.telephone) {
      hostsUpdated++;
      hostDetails.push(`✓ ${updated.nom}: +${updated.telephone}`);
    }
  });

  return {
    speakersUpdated,
    hostsUpdated,
    speakerDetails,
    hostDetails
  };
}

/**
 * Fonction principale pour mettre à jour tous les numéros
 */
export function processPhoneNumberUpdate(
  jsonData: any,
  currentData: {
    speakers: Speaker[];
    hosts: Host[];
  }
): {
  updatedSpeakers: Speaker[];
  updatedHosts: Host[];
  report: ReturnType<typeof generateUpdateReport>;
} {
  // Extraire les numéros du JSON
  const { speakersWithPhones, hostsWithPhones } = extractPhoneNumbersFromJson(jsonData);
  
  // Mettre à jour les orateurs
  const updatedSpeakers = updateSpeakersWithPhones(currentData.speakers, speakersWithPhones);
  
  // Mettre à jour les hôtes
  const updatedHosts = updateHostsWithPhones(currentData.hosts, hostsWithPhones);
  
  // Générer le rapport
  const report = generateUpdateReport(currentData.speakers, updatedSpeakers, currentData.hosts, updatedHosts);
  
  return {
    updatedSpeakers,
    updatedHosts,
    report
  };
}
