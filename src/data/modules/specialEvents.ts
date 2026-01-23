/**
 * Module Événements Spéciaux (Special Events)
 * Gestion des Assemblées, Visites de Surveillant, Mémorial, etc.
 */

import { SpecialDate, SpecialDateType, ValidationError } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// EXTENDED TYPES FOR SPECIAL EVENTS
// ============================================================================

export interface SpecialEvent extends SpecialDate {
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  location?: string;
  blocksPlanning: boolean; // If true, no visits can be scheduled
  recurring?: {
    frequency: 'yearly' | 'monthly';
    dayOfWeek?: number; // 0-6 for Sunday-Saturday
    weekOfMonth?: number; // 1-4 for first-fourth week
  };
  attendees?: string[]; // Names of people expected
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Event type configurations
export const EVENT_TYPE_CONFIG: Record<SpecialDateType, {
  label: string;
  color: string;
  icon: string;
  blocksPlanning: boolean;
}> = {
  co_visit: {
    label: 'Visite du Surveillant de Circonscription',
    color: '#8B5CF6', // Purple
    icon: '👔',
    blocksPlanning: true,
  },
  assembly: {
    label: 'Assemblée',
    color: '#EC4899', // Pink
    icon: '🏛️',
    blocksPlanning: true,
  },
  special_talk: {
    label: 'Discours Spécial',
    color: '#F59E0B', // Amber
    icon: '🎤',
    blocksPlanning: true,
  },
  memorial: {
    label: 'Mémorial',
    color: '#EF4444', // Red
    icon: '🍷',
    blocksPlanning: true,
  },
  convention: {
    label: 'Congrès',
    color: '#10B981', // Green
    icon: '🎪',
    blocksPlanning: true,
  },
  other: {
    label: 'Autre événement',
    color: '#6B7280', // Gray
    icon: '📅',
    blocksPlanning: false,
  },
};

// ============================================================================
// VALIDATION
// ============================================================================

export interface SpecialEventValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export function validateSpecialEvent(event: Partial<SpecialEvent>): SpecialEventValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!event.name?.trim()) {
    errors.push({ field: 'name', message: 'Le nom de l\'événement est obligatoire' });
  }

  if (!event.date) {
    errors.push({ field: 'date', message: 'La date est obligatoire' });
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(event.date)) {
      errors.push({ field: 'date', message: 'Format de date invalide (YYYY-MM-DD)' });
    }
  }

  if (!event.type) {
    errors.push({ field: 'type', message: 'Le type d\'événement est obligatoire' });
  }

  // Time validation
  if (event.startTime) {
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(event.startTime)) {
      warnings.push('Format d\'heure de début invalide');
    }
  }

  if (event.endTime) {
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(event.endTime)) {
      warnings.push('Format d\'heure de fin invalide');
    }
  }

  // Logical validation
  if (event.startTime && event.endTime && event.startTime > event.endTime) {
    warnings.push('L\'heure de fin est avant l\'heure de début');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

export function createSpecialEvent(
  data: Omit<SpecialEvent, 'id' | 'createdAt' | 'updatedAt'>
): SpecialEvent {
  const now = new Date().toISOString();
  const typeConfig = EVENT_TYPE_CONFIG[data.type];

  return {
    ...data,
    id: uuidv4(),
    color: data.color || typeConfig.color,
    blocksPlanning: data.blocksPlanning ?? typeConfig.blocksPlanning,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateSpecialEvent(
  event: SpecialEvent,
  updates: Partial<SpecialEvent>
): SpecialEvent {
  return {
    ...event,
    ...updates,
    id: event.id, // Prevent ID change
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// RECURRING EVENTS
// ============================================================================

/**
 * Generate occurrences of a recurring event for a given year
 */
export function generateRecurringOccurrences(
  event: SpecialEvent,
  year: number
): SpecialEvent[] {
  if (!event.recurring) return [event];

  const occurrences: SpecialEvent[] = [];

  if (event.recurring.frequency === 'yearly') {
    // Extract month and day from the original date
    const originalDate = new Date(event.date);
    const month = originalDate.getMonth();
    const day = originalDate.getDate();

    const newDate = new Date(year, month, day);
    occurrences.push({
      ...event,
      id: `${event.id}-${year}`,
      date: newDate.toISOString().slice(0, 10),
    });
  } else if (event.recurring.frequency === 'monthly') {
    for (let month = 0; month < 12; month++) {
      if (event.recurring.dayOfWeek !== undefined && event.recurring.weekOfMonth !== undefined) {
        // Calculate the nth weekday of the month
        const date = getNthWeekdayOfMonth(
          year,
          month,
          event.recurring.dayOfWeek,
          event.recurring.weekOfMonth
        );
        if (date) {
          occurrences.push({
            ...event,
            id: `${event.id}-${year}-${month}`,
            date: date.toISOString().slice(0, 10),
          });
        }
      }
    }
  }

  return occurrences;
}

function getNthWeekdayOfMonth(
  year: number,
  month: number,
  dayOfWeek: number,
  weekOfMonth: number
): Date | null {
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = firstDay.getDay();

  // Calculate the first occurrence of the target weekday
  let dayOffset = dayOfWeek - firstDayOfWeek;
  if (dayOffset < 0) dayOffset += 7;

  const targetDay = 1 + dayOffset + (weekOfMonth - 1) * 7;

  // Check if the date is valid
  const result = new Date(year, month, targetDay);
  if (result.getMonth() !== month) return null;

  return result;
}

// ============================================================================
// CONFLICT DETECTION
// ============================================================================

export interface EventConflict {
  event: SpecialEvent;
  message: string;
}

/**
 * Check if a date conflicts with any blocking special events
 */
export function checkDateConflict(
  date: string,
  events: SpecialEvent[]
): EventConflict | null {
  const blockingEvent = events.find(
    (e) => e.date === date && e.blocksPlanning
  );

  if (blockingEvent) {
    return {
      event: blockingEvent,
      message: `Cette date est bloquée: ${blockingEvent.name}`,
    };
  }

  return null;
}

/**
 * Get all blocking dates from special events
 */
export function getBlockingDates(events: SpecialEvent[]): string[] {
  return events
    .filter((e) => e.blocksPlanning)
    .map((e) => e.date);
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

export interface SpecialEventFilters {
  search?: string;
  type?: SpecialDateType | SpecialDateType[];
  dateFrom?: string;
  dateTo?: string;
  blocksPlanning?: boolean;
}

export function filterSpecialEvents(
  events: SpecialEvent[],
  filters: SpecialEventFilters
): SpecialEvent[] {
  return events.filter((event) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        event.name.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      if (!types.includes(event.type)) return false;
    }

    // Date range filter
    if (filters.dateFrom && event.date < filters.dateFrom) return false;
    if (filters.dateTo && event.date > filters.dateTo) return false;

    // Blocks planning filter
    if (filters.blocksPlanning !== undefined && event.blocksPlanning !== filters.blocksPlanning) {
      return false;
    }

    return true;
  });
}

// ============================================================================
// UTILITIES
// ============================================================================

export function getEventById(events: SpecialEvent[], id: string): SpecialEvent | undefined {
  return events.find((e) => e.id === id);
}

export function getEventsForMonth(events: SpecialEvent[], year: number, month: number): SpecialEvent[] {
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  return events.filter((e) => e.date.startsWith(monthStr));
}

export function getUpcomingEvents(events: SpecialEvent[], days: number = 30): SpecialEvent[] {
  const today = new Date().toISOString().slice(0, 10);
  const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return filterSpecialEvents(events, {
    dateFrom: today,
    dateTo: futureDate,
  }).sort((a, b) => a.date.localeCompare(b.date));
}

export function sortEventsByDate(events: SpecialEvent[], order: 'asc' | 'desc' = 'asc'): SpecialEvent[] {
  return [...events].sort((a, b) => {
    const comparison = a.date.localeCompare(b.date);
    return order === 'desc' ? -comparison : comparison;
  });
}

// ============================================================================
// STANDARD EVENTS TEMPLATES
// ============================================================================

export const STANDARD_EVENTS: Partial<SpecialEvent>[] = [
  {
    name: 'Mémorial',
    type: 'memorial',
    blocksPlanning: true,
    description: 'Commémoration de la mort du Christ',
  },
  {
    name: 'Visite du Surveillant de Circonscription',
    type: 'co_visit',
    blocksPlanning: true,
    description: 'Visite semestrielle du SC',
  },
  {
    name: 'Assemblée de Circonscription',
    type: 'assembly',
    blocksPlanning: true,
    description: 'Assemblée semestrielle',
  },
  {
    name: 'Congrès Régional',
    type: 'convention',
    blocksPlanning: true,
    description: 'Congrès annuel',
  },
];

/**
 * Create a standard event with predefined settings
 */
export function createFromTemplate(
  templateName: string,
  date: string,
  overrides?: Partial<SpecialEvent>
): SpecialEvent | null {
  const template = STANDARD_EVENTS.find(
    (t) => t.name?.toLowerCase() === templateName.toLowerCase()
  );

  if (!template || !template.type) return null;

  return createSpecialEvent({
    ...template,
    date,
    type: template.type,
    blocksPlanning: template.blocksPlanning ?? true,
    ...overrides,
  } as Omit<SpecialEvent, 'id' | 'createdAt' | 'updatedAt'>);
}
