import { Visit, Speaker } from '@/types';
import { generateUUID } from './uuid';
import { parseDate } from './formatters';
import { NA_HOST, UNASSIGNED_HOST } from '@/data/commonConstants';
import { getTalkTitle } from '@/data/talkTitles';

// Constante pour la date pivot du changement de planning (1er Fév 2026)
const CUTOFF_DATE = (() => { const today = new Date(); today.setHours(0, 0, 0, 0); return today; })();
/**
 * Traite les lignes brutes du Google Sheet pour produire une liste de visites nettoyée et filtrée.
 */
export const processSheetRows = (
  rawRows: any[], 
  cols: any[],
  existingSpeakers: Speaker[], 
  congregationProfile: any
): Visit[] => {
  // 1. Détection dynamique des colonnes
  const headers = cols.map((h: any) =>
    h.label
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  );

  const dateIndex = headers.findIndex((h: string) => h.includes('data'));
  const speakerIndex = headers.findIndex((h: string) => h.includes('orador'));
  const congIndex = headers.findIndex((h: string) => h.includes('kongregason'));
  const talkNoIndex = headers.findIndex((h: string) => h === 'n' || h === 'no');
  const themeIndex = headers.findIndex((h: string) => h.includes('tema'));

  if ([dateIndex, speakerIndex, congIndex].some((i) => i === -1)) {
    console.error('Missing headers in Sheet');
    return [];
  }

  const speakerMap = new Map(existingSpeakers.map((s) => [s.nom.toLowerCase(), s]));
  const candidateVisits: Visit[] = [];

  // 2. Parsing des lignes
  for (const row of rawRows) {
    const cells = row.c;
    const dateValue = cells[dateIndex]?.v;
    let visitDateObj: Date | null = null;

    if (typeof dateValue === 'string' && dateValue.startsWith('Date(')) {
      const dateParts = dateValue.substring(5, dateValue.length - 1).split(',');
      visitDateObj = new Date(
        Number(dateParts[0]),
        Number(dateParts[1]),
        Number(dateParts[2])
      );
    } else if (typeof dateValue === 'string') {
      visitDateObj = parseDate(dateValue);
    }

    const speakerName = cells[speakerIndex]?.v?.trim();
    const congregation = cells[congIndex]?.v?.trim() || '';

    if (!visitDateObj || !speakerName) {
      continue;
    }

    // Timezone-safe date formatting
    const year = visitDateObj.getFullYear();
    const month = String(visitDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(visitDateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Récupération ou création temporaire de l'orateur
    let speakerId = generateUUID();
    let speakerPhone = '';
    let speakerPhoto = '';
    
    const existingSpeaker = speakerMap.get(speakerName.toLowerCase());
    if (existingSpeaker) {
      speakerId = existingSpeaker.id;
      speakerPhone = existingSpeaker.telephone || '';
      speakerPhoto = existingSpeaker.photoUrl || '';
    }

    const talkNoValue =
      talkNoIndex > -1
        ? cells[talkNoIndex]?.v !== null
          ? String(cells[talkNoIndex]?.v)
          : null
        : null;

    // Génération d'un ID stable pour identifier cette visite de façon unique
    const externalId = `${speakerName.toLowerCase().trim()}__${congregation.toLowerCase().trim()}__${talkNoValue || 'notalk'}`;
    const themeValue =
      themeIndex > -1
        ? cells[themeIndex]?.v !== null
          ? String(cells[themeIndex]?.v)
          : null
        : null;
    
    const finalTheme = themeValue || getTalkTitle(talkNoValue);

    candidateVisits.push({
      id: speakerId,
      nom: speakerName,
      congregation,
      telephone: speakerPhone, // On garde le tel local si dispo via le match orateur
      photoUrl: speakerPhoto,
      visitId: generateUUID(), // ID temporaire
      externalId: externalId,
      visitDate: formattedDate,
      visitTime: congregationProfile.meetingTime || '14:30',
      host: congregation.toLowerCase().includes('zoom') ||
          congregation.toLowerCase().includes('streaming') ||
          congregation.toLowerCase().includes('lyon')
          ? NA_HOST
          : UNASSIGNED_HOST,
      accommodation: '',
      meals: '',
      status: 'pending',
      locationType: congregation.toLowerCase().includes('zoom')
          ? 'zoom'
          : congregation.toLowerCase().includes('streaming')
          ? 'streaming'
          : 'physical',
      talkNoOrType: talkNoValue,
      talkTheme: finalTheme,
      communicationStatus: {},
    });
  }

  // 3. Filtrage et Dédoublonnage
  return filterAndDeduplicateVisits(candidateVisits);
};

/**
 * Version robuste de filterVisits qui implémente strictement les règles demandées.
 */
export const filterAndDeduplicateVisits = (visits: Visit[]): Visit[] => {
  // 1. Séparer historique et futur
  const pastVisits = visits.filter(v => new Date(v.visitDate) < CUTOFF_DATE);
  const futureVisits = visits.filter(v => new Date(v.visitDate) >= CUTOFF_DATE);

  // 2. Grouper les visites futures par Orateur
  // Clé = ID (si présent) ou Nom+Congrégation
  const futureBySpeaker = new Map<string, Visit[]>();
  
  for (const visit of futureVisits) {
    // Si l'ID est 'temp-uuid', il n'est pas stable entre les synchros si on ne le réconcilie pas.
    // On préfère la clé fonctionnelle (Nom + Congrégation) pour le dédoublonnage du Sheet qui n'a pas d'IDs.
    const key = `${visit.nom.trim().toLowerCase()}|${visit.congregation.trim().toLowerCase()}`;
    
    if (!futureBySpeaker.has(key)) {
      futureBySpeaker.set(key, []);
    }
    futureBySpeaker.get(key)?.push(visit);
  }

  // 3. Sélection du "gagnant" pour chaque orateur
  const keptFutureVisits: Visit[] = [];

  futureBySpeaker.forEach((candidates) => {
    if (candidates.length === 0) return;
    if (candidates.length === 1) {
      keptFutureVisits.push(candidates[0]);
      return;
    }

    // Résolution de conflit : Priorité au Dimanche (0)
    const best = candidates.reduce((prev, curr) => {
      const prevDate = new Date(prev.visitDate);
      const currDate = new Date(curr.visitDate);
      const prevDay = prevDate.getDay();
      const currDay = currDate.getDay();

      // Dimanche (0) > Samedi (6) ou autre
      if (prevDay === 0 && currDay !== 0) return prev;
      if (currDay === 0 && prevDay !== 0) return curr;

      // Si égalité de jour (ex: 2 dimanches), on garde le plus proche dans le temps ? 
      // ou le premier fourni par le sheet ?
      // On va dire le plus récent (max date) pour éviter de garder une vieille date annulée ?
      // Ou le plus tôt ?
      // Arbitrage : Chronologique.
      return prevDate < currDate ? prev : curr;
    });

    keptFutureVisits.push(best);
  });

  // 4. Recombiner et trier
  return [...pastVisits, ...keptFutureVisits].sort((a, b) => 
    new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
  );
};

/**
 * Fonction idempotente pour mettre à jour la base locale (state) avec les nouvelles visites.
 * Gère la fusion intelligente (retention des IDs existants, logs, etc.)
 */
export const mergeVisitsIdempotent = (
  currentVisits: Visit[],
  incomingVisits: Visit[]
): { mergedVisits: Visit[], stats: { added: number, updated: number, deleted: number } } => {
  const stats = { added: 0, updated: 0, deleted: 0 };
  const mergedVisits = [...currentVisits];

  // 1. Indexer les visites actuelles par date (clé simple pour recherche rapide, attention doublons possibles en base sale)
  // On utilise une map plus complexe pour matcher : Date + Nom (approximatif)
  
  for (const incoming of incomingVisits) {
    // Recherche d'une visite existante correspondante
    // Critère de "Même Visite" : Même Date ET Même Orateur
        // Recherche par externalId en priorité
    const matchIndex = mergedVisits.findIndex(existing => {
      // Si les deux ont un externalId, on matche dessus
      if (existing.externalId && incoming.externalId) {
        return existing.externalId === incoming.externalId;
      }
      // Sinon fallback sur l'ancien système (date + nom)
      return existing.visitDate === incoming.visitDate && 
             existing.nom.toLowerCase() === incoming.nom.toLowerCase();
    });
    if (matchIndex > -1) {
      // UPDATE
      const existing = mergedVisits[matchIndex];
      // On ne met à jour que les champs pilotés par le Sheet
      // On préserve les données locales (ID, status, hostAssignments, feedback, etc.)
      const updated: Visit = {
        ...existing,
      // Préserver l'ID de visite existant et mettre à jour externalId
      visitId: existing.visitId,
      externalId: incoming.externalId,
      visitDate: incoming.visitDate,
        // Champs Sheet qui écrasent (source de vérité)
        congregation: incoming.congregation,
        talkNoOrType: incoming.talkNoOrType,
        talkTheme: incoming.talkTheme,
        // On peut mettre à jour le nom si c'est une correction mineure, mais on garde l'ID existant
        nom: incoming.nom, 
        telephone: incoming.telephone || existing.telephone, // Sheet peut apporter un tel
        photoUrl: incoming.photoUrl || existing.photoUrl,
      };
      
      mergedVisits[matchIndex] = updated;
      stats.updated++;
    } else {
      // INSERT
      // C'est une nouvelle visite, on l'ajoute.
      mergedVisits.push(incoming);
      stats.added++;
    }
  }

  // 2. Nettoyage (Anti-doublon post-merge)
  // On réapplique le filtrage sur la totalité pour être sûr qu'aucun vieux doublon ne traîne
  const cleanedVisits = filterAndDeduplicateVisits(mergedVisits);
  
  if (cleanedVisits.length < mergedVisits.length) {
    stats.deleted = mergedVisits.length - cleanedVisits.length;
  }

  return { mergedVisits: cleanedVisits, stats };
};

/**
 * Fonction pour ajouter les externalId aux visites existantes qui n'en ont pas encore.
 * À appeler une fois pour migrer les données existantes.
 */
export const backfillExternalIds = (visits: Visit[]): Visit[] => {
  return visits.map(v => {
    if (!v.externalId) {
      // Recalculer l'externalId à partir des données existantes
      const externalId = `${v.nom.toLowerCase().trim()}__${v.congregation.toLowerCase().trim()}__${v.talkNoOrType || 'notalk'}`;
      return { ...v, externalId };
    }
    return v;
  });
};
