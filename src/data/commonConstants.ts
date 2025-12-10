// ============================================================================
// CONSTANTES COMMUNES
// ============================================================================

// Hôtes
export const UNASSIGNED_HOST = 'À définir';
export const NA_HOST = 'N/A';

// Statuts
export const VISIT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// Types de localisation
export const LOCATION_TYPES = {
  PHYSICAL: 'physical',
  ZOOM: 'zoom',
  STREAMING: 'streaming'
} as const;

// Messages
export const DEFAULT_MEETING_TIME = '14:30';
export const REMINDER_DAYS = [7, 2] as const;
