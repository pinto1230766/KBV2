import { Speaker, Visit, Host, ValidationError } from '@/types';

// ============================================================================
// VALIDATION D'ORATEUR
// ============================================================================

export function validateSpeaker(speaker: Partial<Speaker>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Nom requis
  if (!speaker.nom || speaker.nom.trim() === '') {
    errors.push({ field: 'nom', message: 'Le nom est requis' });
  } else if (speaker.nom.length < 2) {
    errors.push({ field: 'nom', message: 'Le nom doit contenir au moins 2 caractères' });
  }

  // Congrégation requise
  if (!speaker.congregation || speaker.congregation.trim() === '') {
    errors.push({ field: 'congregation', message: 'La congrégation est requise' });
  }

  // Téléphone optionnel mais doit être valide si fourni
  if (speaker.telephone) {
    if (!isValidPhone(speaker.telephone)) {
      errors.push({ field: 'telephone', message: 'Le numéro de téléphone est invalide' });
    }
  }

  // Email optionnel mais doit être valide si fourni
  if (speaker.email) {
    if (!isValidEmail(speaker.email)) {
      errors.push({ field: 'email', message: "L'adresse email est invalide" });
    }
  }

  // Genre requis
  if (!speaker.gender) {
    errors.push({ field: 'gender', message: 'Le genre est requis' });
  }

  return errors;
}

// ============================================================================
// VALIDATION DE VISITE
// ============================================================================

export function validateVisit(visit: Partial<Visit>): ValidationError[] {
  const errors: ValidationError[] = [];

  // ID orateur requis
  if (!visit.id) {
    errors.push({ field: 'id', message: "L'orateur est requis" });
  }

  // Date requise
  if (!visit.visitDate) {
    errors.push({ field: 'visitDate', message: 'La date est requise' });
  } else {
    // Vérifier que la date est valide
    const date = new Date(visit.visitDate);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'visitDate', message: 'La date est invalide' });
    }
  }

  // Heure requise
  if (!visit.visitTime) {
    errors.push({ field: 'visitTime', message: "L'heure est requise" });
  } else if (!isValidTime(visit.visitTime)) {
    errors.push({ field: 'visitTime', message: "L'heure est invalide (format: HH:MM)" });
  }

  // Type de visite requis
  if (!visit.locationType) {
    errors.push({ field: 'locationType', message: 'Le type de visite est requis' });
  }

  // Si visite physique, contact d'accueil souhaitable
  if (visit.locationType === 'physical' && visit.host === 'À définir') {
    // Avertissement seulement, pas d'erreur
  }

  return errors;
}

// ============================================================================
// VALIDATION DE CONTACT D'ACCUEIL
// ============================================================================

export function validateHost(host: Partial<Host>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Nom requis
  if (!host.nom || host.nom.trim() === '') {
    errors.push({ field: 'nom', message: 'Le nom est requis' });
  }

  // Téléphone optionnel mais doit être valide si fourni
  if (host.telephone) {
    if (!isValidPhone(host.telephone)) {
      errors.push({ field: 'telephone', message: 'Le numéro de téléphone est invalide' });
    }
  }

  // Email optionnel mais doit être valide si fourni
  if (host.email) {
    if (!isValidEmail(host.email)) {
      errors.push({ field: 'email', message: "L'adress email est invalide" });
    }
  }

  // Genre requis
  if (!host.gender) {
    errors.push({ field: 'gender', message: 'Le genre est requis' });
  }

  return errors;
}

// ============================================================================
// VALIDATION D'EMAIL
// ============================================================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================================================
// VALIDATION DE TÉLÉPHONE
// ============================================================================

export function isValidPhone(phone: string): boolean {
  // Accepter les formats:
  // +33 6 12 34 56 78
  // +33612345678
  // 06 12 34 56 78
  // 0612345678
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Format international
  if (cleaned.startsWith('+')) {
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  // Format local français
  if (cleaned.startsWith('0')) {
    return cleaned.length === 10;
  }

  return false;
}

// ============================================================================
// VALIDATION DE TIME (HH:MM)
// ============================================================================

export function isValidTime(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

// ============================================================================
// SANITISATION XSS
// ============================================================================

export function sanitizeInput(input: string): string {
  // Remplacer les caractères dangereux
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// ============================================================================
// VALIDATION D'URL
// ============================================================================

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// VALIDATION DE DATE
// ============================================================================

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

// ============================================================================
// NETTOYAGE DE DONNÉES
// ============================================================================

export function trimAllStrings<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };

  for (const key in result) {
    if (typeof result[key] === 'string') {
      result[key] = result[key].trim() as any;
    }
  }

  return result;
}

export function removeEmptyFields<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: any = {};

  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== '') {
      result[key] = value;
    }
  }

  return result;
}
