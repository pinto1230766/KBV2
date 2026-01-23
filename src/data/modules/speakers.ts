/**
 * Module Orateurs (Speakers)
 * Gestion modulaire avec validation
 */

import { Speaker, ValidationError } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// VALIDATION
// ============================================================================

export interface SpeakerValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export function validateSpeaker(speaker: Partial<Speaker>): SpeakerValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!speaker.nom?.trim()) {
    errors.push({ field: 'nom', message: 'Le nom est obligatoire' });
  }

  if (!speaker.congregation?.trim()) {
    errors.push({ field: 'congregation', message: 'La congrégation est obligatoire' });
  }

  if (!speaker.gender) {
    errors.push({ field: 'gender', message: 'Le genre est obligatoire' });
  }

  // Phone validation (optional but if provided, check format)
  if (speaker.telephone) {
    const phoneRegex = /^[+]?[\d\s\-().]{8,20}$/;
    if (!phoneRegex.test(speaker.telephone)) {
      warnings.push('Le format du téléphone semble incorrect');
    }
  }

  // Email validation (optional)
  if (speaker.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(speaker.email)) {
      warnings.push('Le format de l\'email semble incorrect');
    }
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

export function createSpeaker(data: Omit<Speaker, 'id' | 'talkHistory' | 'createdAt' | 'updatedAt'>): Speaker {
  const now = new Date().toISOString();
  return {
    ...data,
    id: uuidv4(),
    talkHistory: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function updateSpeakerData(speaker: Speaker, updates: Partial<Speaker>): Speaker {
  return {
    ...speaker,
    ...updates,
    id: speaker.id, // Prevent ID change
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

export interface SpeakerFilters {
  search?: string;
  congregation?: string;
  tags?: string[];
  hasPhone?: boolean;
  isVehiculed?: boolean;
}

export function filterSpeakers(speakers: Speaker[], filters: SpeakerFilters): Speaker[] {
  return speakers.filter((speaker) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        speaker.nom.toLowerCase().includes(searchLower) ||
        speaker.congregation.toLowerCase().includes(searchLower) ||
        speaker.telephone?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Congregation filter
    if (filters.congregation && speaker.congregation !== filters.congregation) {
      return false;
    }

    // Tags filter
    if (filters.tags?.length) {
      const hasAllTags = filters.tags.every((tag) => speaker.tags?.includes(tag));
      if (!hasAllTags) return false;
    }

    // Has phone filter
    if (filters.hasPhone !== undefined) {
      const hasPhone = !!speaker.telephone?.trim();
      if (hasPhone !== filters.hasPhone) return false;
    }

    // Is vehiculed filter
    if (filters.isVehiculed !== undefined && speaker.isVehiculed !== filters.isVehiculed) {
      return false;
    }

    return true;
  });
}

// ============================================================================
// UTILITIES
// ============================================================================

export function getSpeakerById(speakers: Speaker[], id: string): Speaker | undefined {
  return speakers.find((s) => s.id === id);
}

export function getSpeakerByName(speakers: Speaker[], name: string): Speaker | undefined {
  return speakers.find((s) => s.nom.toLowerCase() === name.toLowerCase());
}

export function getUniqueCongregations(speakers: Speaker[]): string[] {
  const congregations = new Set(speakers.map((s) => s.congregation));
  return Array.from(congregations).sort();
}

export function getUniqueTags(speakers: Speaker[]): string[] {
  const tags = new Set<string>();
  speakers.forEach((s) => s.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

// ============================================================================
// DUPLICATE DETECTION
// ============================================================================

export interface DuplicateGroup {
  key: string;
  speakers: Speaker[];
  reason: string;
}

export function findDuplicateSpeakers(speakers: Speaker[]): DuplicateGroup[] {
  const duplicates: DuplicateGroup[] = [];
  const nameMap = new Map<string, Speaker[]>();

  // Group by normalized name
  speakers.forEach((speaker) => {
    const normalizedName = speaker.nom.toLowerCase().trim();
    const existing = nameMap.get(normalizedName) || [];
    existing.push(speaker);
    nameMap.set(normalizedName, existing);
  });

  // Find duplicates
  nameMap.forEach((group, key) => {
    if (group.length > 1) {
      duplicates.push({
        key,
        speakers: group,
        reason: 'Même nom',
      });
    }
  });

  return duplicates;
}

// ============================================================================
// MERGE
// ============================================================================

export function mergeSpeakers(primary: Speaker, secondary: Speaker): Speaker {
  return {
    ...primary,
    // Merge talk history
    talkHistory: [
      ...primary.talkHistory,
      ...secondary.talkHistory.filter(
        (th) => !primary.talkHistory.some((pth) => pth.visitId === th.visitId)
      ),
    ],
    // Merge tags
    tags: Array.from(new Set([...(primary.tags || []), ...(secondary.tags || [])])),
    // Use secondary data if primary is missing
    telephone: primary.telephone || secondary.telephone,
    email: primary.email || secondary.email,
    photoUrl: primary.photoUrl || secondary.photoUrl,
    notes: primary.notes
      ? secondary.notes
        ? `${primary.notes}\n---\n${secondary.notes}`
        : primary.notes
      : secondary.notes,
    updatedAt: new Date().toISOString(),
  };
}
