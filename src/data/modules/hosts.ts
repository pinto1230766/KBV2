/**
 * Module Hôtes (Hosts)
 * Gestion modulaire avec validation
 */

import { Host, ValidationError, Gender } from '@/types';

// ============================================================================
// VALIDATION
// ============================================================================

export interface HostValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export function validateHost(host: Partial<Host>): HostValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!host.nom?.trim()) {
    errors.push({ field: 'nom', message: 'Le nom est obligatoire' });
  }

  if (!host.gender) {
    errors.push({ field: 'gender', message: 'Le genre est obligatoire' });
  }

  // Phone validation (recommended)
  if (!host.telephone?.trim()) {
    warnings.push('Le numéro de téléphone est recommandé');
  } else {
    const phoneRegex = /^[+]?[\d\s\-().]{8,20}$/;
    if (!phoneRegex.test(host.telephone)) {
      warnings.push('Le format du téléphone semble incorrect');
    }
  }

  // Email validation (optional)
  if (host.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(host.email)) {
      warnings.push('Le format de l\'email semble incorrect');
    }
  }

  // Capacity validation
  if (host.capacity !== undefined && (host.capacity < 0 || host.capacity > 20)) {
    warnings.push('La capacité d\'accueil semble inhabituelle');
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

export function createHost(data: Omit<Host, 'createdAt' | 'updatedAt'>): Host {
  const now = new Date().toISOString();
  return {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateHostData(host: Host, updates: Partial<Host>): Host {
  return {
    ...host,
    ...updates,
    nom: host.nom, // Prevent name change (it's the ID)
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// AVAILABILITY
// ============================================================================

export function isHostAvailable(host: Host, date: string): boolean {
  if (!host.unavailableDates?.length) return true;
  return !host.unavailableDates.includes(date);
}

export function getAvailableHosts(hosts: Host[], date: string): Host[] {
  return hosts.filter((host) => isHostAvailable(host, date));
}

export function addUnavailableDate(host: Host, date: string): Host {
  const unavailableDates = host.unavailableDates || [];
  if (unavailableDates.includes(date)) return host;
  
  return {
    ...host,
    unavailableDates: [...unavailableDates, date].sort(),
    updatedAt: new Date().toISOString(),
  };
}

export function removeUnavailableDate(host: Host, date: string): Host {
  if (!host.unavailableDates?.includes(date)) return host;
  
  return {
    ...host,
    unavailableDates: host.unavailableDates.filter((d) => d !== date),
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

export interface HostFilters {
  search?: string;
  tags?: string[];
  hasPhone?: boolean;
  availableOn?: string;
  gender?: Gender;
  hasParking?: boolean;
  hasElevator?: boolean;
  minCapacity?: number;
}

export function filterHosts(hosts: Host[], filters: HostFilters): Host[] {
  return hosts.filter((host) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        host.nom.toLowerCase().includes(searchLower) ||
        host.address?.toLowerCase().includes(searchLower) ||
        host.telephone?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Tags filter
    if (filters.tags?.length) {
      const hasAllTags = filters.tags.every((tag) => host.tags?.includes(tag));
      if (!hasAllTags) return false;
    }

    // Has phone filter
    if (filters.hasPhone !== undefined) {
      const hasPhone = !!host.telephone?.trim();
      if (hasPhone !== filters.hasPhone) return false;
    }

    // Availability filter
    if (filters.availableOn && !isHostAvailable(host, filters.availableOn)) {
      return false;
    }

    // Gender filter
    if (filters.gender && host.gender !== filters.gender) {
      return false;
    }

    // Parking filter
    if (filters.hasParking !== undefined && host.hasParking !== filters.hasParking) {
      return false;
    }

    // Elevator filter
    if (filters.hasElevator !== undefined && host.hasElevator !== filters.hasElevator) {
      return false;
    }

    // Capacity filter
    if (filters.minCapacity !== undefined && (host.capacity || 0) < filters.minCapacity) {
      return false;
    }

    return true;
  });
}

// ============================================================================
// UTILITIES
// ============================================================================

export function getHostByName(hosts: Host[], name: string): Host | undefined {
  return hosts.find((h) => h.nom.toLowerCase() === name.toLowerCase());
}

export function getUniqueTags(hosts: Host[]): string[] {
  const tags = new Set<string>();
  hosts.forEach((h) => h.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

// ============================================================================
// DUPLICATE DETECTION
// ============================================================================

export interface HostDuplicateGroup {
  key: string;
  hosts: Host[];
  reason: string;
}

export function findDuplicateHosts(hosts: Host[]): HostDuplicateGroup[] {
  const duplicates: HostDuplicateGroup[] = [];
  const nameMap = new Map<string, Host[]>();

  // Group by normalized name
  hosts.forEach((host) => {
    const normalizedName = host.nom.toLowerCase().trim();
    const existing = nameMap.get(normalizedName) || [];
    existing.push(host);
    nameMap.set(normalizedName, existing);
  });

  // Find duplicates
  nameMap.forEach((group, key) => {
    if (group.length > 1) {
      duplicates.push({
        key,
        hosts: group,
        reason: 'Même nom',
      });
    }
  });

  return duplicates;
}

// ============================================================================
// MERGE
// ============================================================================

export function mergeHosts(primary: Host, secondary: Host): Host {
  return {
    ...primary,
    // Merge tags
    tags: Array.from(new Set([...(primary.tags || []), ...(secondary.tags || [])])),
    // Merge unavailable dates
    unavailableDates: Array.from(
      new Set([...(primary.unavailableDates || []), ...(secondary.unavailableDates || [])])
    ).sort(),
    // Use secondary data if primary is missing
    telephone: primary.telephone || secondary.telephone,
    email: primary.email || secondary.email,
    address: primary.address || secondary.address,
    photoUrl: primary.photoUrl || secondary.photoUrl,
    capacity: primary.capacity ?? secondary.capacity,
    hasParking: primary.hasParking ?? secondary.hasParking,
    hasElevator: primary.hasElevator ?? secondary.hasElevator,
    hasPets: primary.hasPets ?? secondary.hasPets,
    notes: primary.notes
      ? secondary.notes
        ? `${primary.notes}\n---\n${secondary.notes}`
        : primary.notes
      : secondary.notes,
    updatedAt: new Date().toISOString(),
  };
}
