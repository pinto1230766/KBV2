import { Speaker, Host, Visit } from '@/types';
import { calculateSimilarity } from './levenshtein';

export interface DuplicateGroup {
  id: string;
  type: 'speaker' | 'host' | 'visit';
  items: any[];
  similarity: number;
  reason: string;
}

// Seuil de similarité pour considérer comme doublon potentiel
const SIMILARITY_THRESHOLD = 0.85;

export function detectDuplicates(
  speakers: Speaker[], 
  hosts: Host[], 
  visits: Visit[]
): DuplicateGroup[] {
  const duplicates: DuplicateGroup[] = [];

  // 1. Détection doublons Orateurs
  const speakerDuplicates = findSpeakerDuplicates(speakers);
  duplicates.push(...speakerDuplicates);

  // 2. Détection doublons Accueillants
  const hostDuplicates = findHostDuplicates(hosts);
  duplicates.push(...hostDuplicates);

  // 3. Détection doublons Visites (même date, même heure, même orateur)
  const visitDuplicates = findVisitDuplicates(visits);
  duplicates.push(...visitDuplicates);

  return duplicates;
}

function findSpeakerDuplicates(items: Speaker[]): DuplicateGroup[] {
  const duplicates: DuplicateGroup[] = [];
  const processed = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    if (processed.has(items[i].id)) continue;

    const current = items[i];
    const group = [current];

    for (let j = i + 1; j < items.length; j++) {
      if (processed.has(items[j].id)) continue;

      const compare = items[j];
      const similarity = calculateSimilarity(current.nom, compare.nom);

      // Critères de doublon :
      // - Nom très similaire
      // - OU (Même téléphone ET nom un peu similaire)
      const samePhone = current.telephone && compare.telephone && 
                        current.telephone.replace(/\s/g, '') === compare.telephone.replace(/\s/g, '');
      
      if (similarity >= SIMILARITY_THRESHOLD || (samePhone && similarity > 0.6)) {
        group.push(compare);
        processed.add(compare.id);
      }
    }

    if (group.length > 1) {
      processed.add(current.id);
      duplicates.push({
        id: `dup-speaker-${current.id}`,
        type: 'speaker',
        items: group,
        similarity: calculateSimilarity(group[0].nom, group[1].nom),
        reason: 'Noms similaires ou téléphone identique'
      });
    }
  }

  return duplicates;
}

function findHostDuplicates(items: Host[]): DuplicateGroup[] {
  const duplicates: DuplicateGroup[] = [];
  const processed = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const current = items[i];
    // Utiliser le nom comme identifiant car Host n'a pas d'ID
    if (processed.has(current.nom)) continue;

    const group = [current];

    for (let j = i + 1; j < items.length; j++) {
      const compare = items[j];
      if (processed.has(compare.nom)) continue;

      const similarity = calculateSimilarity(current.nom, compare.nom);
      
      const samePhone = current.telephone && compare.telephone && 
                        current.telephone.replace(/\s/g, '') === compare.telephone.replace(/\s/g, '');

      if (similarity >= SIMILARITY_THRESHOLD || samePhone) {
        group.push(compare);
        processed.add(compare.nom);
      }
    }

    if (group.length > 1) {
      processed.add(current.nom);
      duplicates.push({
        id: `dup-host-${current.nom.replace(/\s+/g, '-').toLowerCase()}`,
        type: 'host',
        items: group,
        similarity: calculateSimilarity(group[0].nom, group[1].nom),
        reason: 'Noms similaires ou téléphone identique'
      });
    }
  }

  return duplicates;
}

function findVisitDuplicates(items: Visit[]): DuplicateGroup[] {
  const duplicates: DuplicateGroup[] = [];
  // Regrouper par date
  const byDate = new Map<string, Visit[]>();

  items.forEach(visit => {
    const key = visit.visitDate; // YYYY-MM-DD
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(visit);
  });

  byDate.forEach((visitsOnDate) => {
    // Chercher doublons le même jour
    const processed = new Set<string>();

    for (let i = 0; i < visitsOnDate.length; i++) {
      if (processed.has(visitsOnDate[i].id)) continue;

      const current = visitsOnDate[i];
      const group = [current];

      for (let j = i + 1; j < visitsOnDate.length; j++) {
        if (processed.has(visitsOnDate[j].id)) continue;
        
        const compare = visitsOnDate[j];
        
        // Critères : Même orateur ET (même discours OU heure très proche)
        const sameSpeaker = calculateSimilarity(current.nom, compare.nom) > 0.9;
        const sameTalk = current.talkNoOrType === compare.talkNoOrType;
        const sameTime = current.visitTime === compare.visitTime;

        if (sameSpeaker && (sameTalk || sameTime)) {
          group.push(compare);
          processed.add(compare.id);
        }
      }

      if (group.length > 1) {
        processed.add(current.id);
        duplicates.push({
          id: `dup-visit-${current.id}`,
          type: 'visit',
          items: group,
          similarity: 1.0,
          reason: 'Même orateur le même jour'
        });
      }
    }
  });

  return duplicates;
}
