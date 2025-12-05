import { Language } from '@/types';
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';

// ============================================================================
// LOCALES DATE-FNS
// ============================================================================

const locales = {
  fr: fr,
  en: enUS,
  es: es,
  cv: fr, // Utiliser français pour capverdien (pas de locale CV disponible)
};

// ============================================================================
// FORMATAGE DES DATES
// ============================================================================

export function formatDate(
  date: string | Date,
  formatString: string = 'PPP',
  language: Language = 'fr'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';

    return format(dateObj, formatString, {
      locale: locales[language],
    });
  } catch {
    return '';
  }
}

export function formatFullDate(date: string | Date, language: Language = 'fr'): string {
  return formatDate(date, 'EEEE d MMMM yyyy', language);
}

export function formatShortDate(date: string | Date, language: Language = 'fr'): string {
  return formatDate(date, 'dd/MM/yyyy', language);
}

export function formatTime(time: string): string {
  // Format: "HH:MM" -> "14:30"
  return time;
}

export function formatDateTime(
  date: string | Date,
  time: string,
  language: Language = 'fr'
): string {
  const dateStr = formatFullDate(date, language);
  return `${dateStr} à ${time}`;
}

export function formatRelativeTime(
  date: string | Date,
  language: Language = 'fr'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';

    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: locales[language],
    });
  } catch {
    return '';
  }
}

// ============================================================================
// FORMATAGE DES TÉLÉPHONES
// ============================================================================

export function formatPhone(phone?: string): string {
  if (!phone) return '';

  // Supprimer tous les caractères non numériques sauf +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Format français: +33 6 12 34 56 78
  if (cleaned.startsWith('+33')) {
    const number = cleaned.slice(3);
    if (number.length === 9) {
      return `+33 ${number[0]} ${number.slice(1, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7)}`;
    }
  }

  // Format international générique
  if (cleaned.startsWith('+')) {
    return cleaned.replace(/(\+\d{1,3})(\d{1,3})(\d{1,4})(\d{1,4})/, '$1 $2 $3 $4').trim();
  }

  // Format local français: 06 12 34 56 78
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }

  return phone;
}

export function cleanPhone(phone: string): string {
  // Retourner uniquement les chiffres et le +
  return phone.replace(/[^\d+]/g, '');
}

// ============================================================================
// FORMATAGE DES NOMBRES
// ============================================================================

export function formatNumber(num: number, language: Language = 'fr'): string {
  return new Intl.NumberFormat(language === 'cv' ? 'fr' : language).format(num);
}

export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  language: Language = 'fr'
): string {
  return new Intl.NumberFormat(language === 'cv' ? 'fr' : language, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ============================================================================
// CALCUL DE JOURS
// ============================================================================

export function getDaysUntil(date: string | Date): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateObj);
  targetDate.setHours(0, 0, 0, 0);

  const diff = targetDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

export function isThisWeek(date: string | Date): boolean {
  const daysUntil = getDaysUntil(date);
  return daysUntil >= 0 && daysUntil < 7;
}

export function isThisMonth(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();

  return (
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

// ============================================================================
// FORMATAGE DE NOMS
// ============================================================================

export function formatSpeakerName(name: string, gender?: 'male' | 'female' | 'couple'): string {
  if (gender === 'female') {
    return `Sœur ${name}`;
  } else if (gender === 'couple') {
    return name; // Pas de préfixe pour les couples
  } else {
    return `Frère ${name}`;
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ============================================================================
// UTILITAIRES DE STRING
// ============================================================================

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function normalizeString(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .trim();
}
