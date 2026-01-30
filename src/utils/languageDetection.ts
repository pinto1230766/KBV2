import { Language } from '@/types';

/**
 * Mapping des congrégations vers leurs langues préférées
 * Basé sur les données historiques et géographiques
 */
const CONGREGATION_LANGUAGE_MAP: Record<string, Language> = {
  // Cap-Vert (Créole)
  'mindelo': 'cv',
  'praia': 'cv',
  'santa maria': 'cv',
  'sal rei': 'cv',
  'tarrafal': 'cv',
  'sao vicente': 'cv',
  'santo antão': 'cv',
  'são vicente': 'cv',
  'santo antónio': 'cv',
  'boa vista': 'cv',
  'sal': 'cv',
  'maio': 'cv',
  'santiago': 'cv',
  'fogo': 'cv',
  'brava': 'cv',

  // Portugal
  'lisboa': 'pt',
  'lisbon': 'pt',
  'porto': 'pt',
  'coimbra': 'pt',
  'albufeira': 'pt',
  'faro': 'pt',
  'setúbal': 'pt',
  'aveiro': 'pt',
  'braga': 'pt',
  'leiria': 'pt',
  'santarem': 'pt',
  'évora': 'pt',
  'beja': 'pt',
  'castelo branco': 'pt',
  'portalegre': 'pt',
  'guarda': 'pt',
  'viseu': 'pt',
  'vila real': 'pt',
  'bragança': 'pt',

  // France (et autres)
  'lyon': 'fr',
  'paris': 'fr',
  'marseille': 'fr',
  'toulouse': 'fr',
  'nice': 'fr',
  'nantes': 'fr',
  'strasbourg': 'fr',
  'montpellier': 'fr',
  'bordeaux': 'fr',
  'lille': 'fr',
  'luxembourg': 'fr',
  'ettelbruck': 'fr',
  'esch-sur-alzette': 'fr',
  'differdange': 'fr',

  // International (défaut français si non reconnu)
  'new york': 'fr',
  'london': 'fr',
  'berlin': 'fr',
  'madrid': 'fr',
  'rome': 'fr'
};

/**
 * Détecte automatiquement la langue appropriée pour une congrégation
 */
export function detectLanguageFromCongregation(congregation: string): Language {
  if (!congregation) return 'fr'; // Défaut français

  const normalized = congregation
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .trim();

  // Recherche exacte
  if (CONGREGATION_LANGUAGE_MAP[normalized]) {
    return CONGREGATION_LANGUAGE_MAP[normalized];
  }

  // Recherche partielle (pour les congrégations avec des espaces ou suffixes)
  for (const [key, language] of Object.entries(CONGREGATION_LANGUAGE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return language;
    }
  }

  // Patterns spéciaux pour Cap-Vert
  if (normalized.includes('cap') && normalized.includes('vert')) {
    return 'cv';
  }

  // Patterns pour le Portugal
  if (normalized.includes('portugal') || normalized.endsWith('al') || normalized.endsWith('ão')) {
    return 'pt';
  }

  // Défaut français pour tout le reste
  return 'fr';
}

/**
 * Liste des congrégations par langue pour référence
 */
export function getCongregationsByLanguage(language: Language): string[] {
  return Object.entries(CONGREGATION_LANGUAGE_MAP)
    .filter(([_, lang]) => lang === language)
    .map(([congregation, _]) => congregation);
}

/**
 * Validation d'une détection de langue
 */
export function validateLanguageDetection(congregation: string, detectedLanguage: Language): boolean {
  const expected = detectLanguageFromCongregation(congregation);
  return expected === detectedLanguage;
}

/**
 * Stats de couverture des congrégations
 */
export function getLanguageDetectionStats(): {
  totalCongregations: number;
  frenchCongregations: number;
  portugueseCongregations: number;
  creoleCongregations: number;
  coverage: Record<Language, number>;
} {
  const entries = Object.values(CONGREGATION_LANGUAGE_MAP);
  const total = entries.length;

  return {
    totalCongregations: total,
    frenchCongregations: entries.filter(l => l === 'fr').length,
    portugueseCongregations: entries.filter(l => l === 'pt').length,
    creoleCongregations: entries.filter(l => l === 'cv').length,
    coverage: {
      fr: Math.round((entries.filter(l => l === 'fr').length / total) * 100),
      pt: Math.round((entries.filter(l => l === 'pt').length / total) * 100),
      cv: Math.round((entries.filter(l => l === 'cv').length / total) * 100)
    }
  };
}