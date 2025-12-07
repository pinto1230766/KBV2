/**
 * Calcule la distance de Levenshtein entre deux chaînes de caractères.
 * Cette mesure indique le nombre minimum d'opérations (insertion, suppression, substitution)
 * nécessaires pour transformer une chaîne en l'autre.
 */
export function levenshteinDistance(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;

  // Création d'une matrice (len1 + 1) x (len2 + 1)
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // Suppression
        matrix[i][j - 1] + 1,      // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calcule le pourcentage de similarité entre deux chaînes (0 à 1).
 * 1 = identique, 0 = totalement différent.
 */
export function calculateSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;
  
  const maxLength = Math.max(s1.length, s2.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(s1.toLowerCase(), s2.toLowerCase());
  return 1 - (distance / maxLength);
}
