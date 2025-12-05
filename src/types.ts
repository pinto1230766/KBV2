// ============================================================================
// TYPES PRINCIPAUX
// ============================================================================

export type Language = 'fr' | 'cv' | 'en' | 'es';
export type MessageType = 'confirmation' | 'preparation' | 'reminder-7' | 'reminder-2' | 'thanks';
export type MessageRole = 'speaker' | 'host';
export type VisitStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type LocationType = 'physical' | 'zoom' | 'streaming';
export type Gender = 'male' | 'female' | 'couple';
export type SpecialDateType = 'co_visit' | 'assembly' | 'special_talk' | 'memorial' | 'convention' | 'other';
export type Theme = 'light' | 'dark' | 'auto';
export type CommunicationChannel = 'whatsapp' | 'sms' | 'email';

// ============================================================================
// ORATEUR (SPEAKER)
// ============================================================================

export interface TalkHistory {
  visitId: string;
  date: string; // Format: YYYY-MM-DD
  talkNo: string | number;
  talkTheme: string;
  locationType: LocationType;
  feedback?: string;
}

export interface Speaker {
  id: string;
  nom: string;
  congregation: string;
  telephone?: string;
  email?: string;
  photoUrl?: string;
  gender: Gender;
  talkHistory: TalkHistory[];
  notes?: string;
  tags?: string[];
  isVehiculed?: boolean;
  createdAt?: string; // ISO date
  updatedAt?: string; // ISO date
}

// ============================================================================
// VISITE (VISIT)
// ============================================================================

export interface CommunicationStatus {
  [messageType: string]: {
    [role: string]: string; // Date ISO de l'envoi
  };
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string; // ISO date
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string; // ISO date
}

export interface Feedback {
  rating?: number; // 1-5
  comments?: string;
  submittedBy?: string;
  submittedAt?: string; // ISO date
}

export interface Visit {
  id: string; // ID de l'orateur
  visitId: string; // ID unique de la visite
  nom: string;
  congregation: string;
  telephone?: string;
  photoUrl?: string;
  visitDate: string; // Format: YYYY-MM-DD
  visitTime: string; // Format: HH:MM
  host: string; // Nom du contact d'accueil
  accommodation: string;
  meals: string;
  status: VisitStatus;
  locationType: LocationType;
  talkNoOrType: string | null;
  talkTheme: string | null;
  communicationStatus?: CommunicationStatus;
  notes?: string;
  attachments?: Attachment[];
  expenses?: Expense[];
  checklist?: ChecklistItem[];
  feedback?: Feedback;
  zoomLink?: string;
  streamingLink?: string;
  createdAt?: string; // ISO date
  updatedAt?: string; // ISO date
}

// ============================================================================
// CONTACT D'ACCUEIL (HOST)
// ============================================================================

export interface Host {
  nom: string;
  telephone?: string;
  email?: string;
  address?: string;
  gender: Gender;
  notes?: string;
  tags?: string[];
  unavailableDates?: string[]; // Dates au format YYYY-MM-DD
  photoUrl?: string;
  capacity?: number;
  hasParking?: boolean;
  hasElevator?: boolean;
  hasPets?: boolean;
  isSmoker?: boolean;
  createdAt?: string; // ISO date
  updatedAt?: string; // ISO date
}

// ============================================================================
// DISCOURS PUBLIC (PUBLIC TALK)
// ============================================================================

export interface PublicTalk {
  number: number | string;
  theme: string;
  language?: Language;
  category?: string;
  lastUsed?: string; // ISO date
  useCount?: number;
}

// ============================================================================
// DATE SPÉCIALE (SPECIAL DATE)
// ============================================================================

export interface SpecialDate {
  id: string;
  date: string; // Format: YYYY-MM-DD
  name: string;
  type: SpecialDateType;
  description?: string;
  allDay?: boolean;
  color?: string;
}

// ============================================================================
// MESSAGES ORATEUR (SPEAKER MESSAGES)
// ============================================================================

export interface SpeakerMessage {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerPhone: string;
  receivedAt: string; // Date ISO
  read: boolean;
  notificationSent: boolean;
  subject?: string;
  message: string;
  reply?: string;
  repliedAt?: string; // ISO date
}

// ============================================================================
// PROFIL CONGRÉGATION
// ============================================================================

export interface CongregationProfile {
  name: string;
  address?: string;
  city?: string;
  hospitalityOverseer: string;
  hospitalityOverseerPhone: string;
  logoUrl?: string;
  meetingDay?: string;
  meetingTime?: string;
  kingdomHall?: string;
}

// ============================================================================
// PARAMÈTRES (SETTINGS)
// ============================================================================

export interface NotificationSettings {
  enabled: boolean;
  reminderDays: number[]; // Ex: [7, 2] pour rappels J-7 et J-2
  sound: boolean;
  vibration: boolean;
}

export interface AISettings {
  enabled: boolean;
  model: string;
  temperature: number;
  apiKey?: string;
}

export interface Settings {
  theme: Theme;
  language: Language;
  notifications: NotificationSettings;
  aiSettings: AISettings;
  encryptionEnabled: boolean;
  sessionTimeout?: number; // minutes
  autoArchiveDays?: number;
}

// ============================================================================
// MODÈLES DE MESSAGES PERSONNALISÉS
// ============================================================================

export interface MessageTemplate {
  [language: string]: {
    [messageType: string]: {
      [role: string]: string;
    };
  };
}

export interface CustomMessageTemplates {
  [language: string]: {
    [messageType: string]: {
      [role: string]: string | null;
    };
  };
}

export interface CustomHostRequestTemplates {
  [language: string]: string | null;
}

// ============================================================================
// VUES SAUVEGARDÉES
// ============================================================================

export interface SavedView {
  id: string;
  name: string;
  type: 'dashboard' | 'planning' | 'messaging' | 'talks' | 'statistics';
  filters: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  createdAt: string; // ISO date
}

// ============================================================================
// DONNÉES GLOBALES DE L'APPLICATION
// ============================================================================

export interface AppData {
  speakers: Speaker[];
  visits: Visit[];
  hosts: Host[];
  archivedVisits: Visit[];
  customTemplates: CustomMessageTemplates;
  customHostRequestTemplates: CustomHostRequestTemplates;
  congregationProfile: CongregationProfile;
  publicTalks: PublicTalk[];
  savedViews: SavedView[];
  specialDates: SpecialDate[];
  speakerMessages: SpeakerMessage[];
  lastSync?: string; // ISO date
  dataVersion: string; // Pour gérer les migrations
}

// ============================================================================
// TYPES UTILITAIRES
// ============================================================================

export interface DateRange {
  start: Date;
  end: Date;
}

export interface Filters {
  search?: string;
  status?: VisitStatus;
  type?: LocationType;
  dateRange?: DateRange;
  congregations?: string[];
  tags?: string[];
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

// ============================================================================
// TYPES DE RÉPONSES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

export interface ImportResult {
  speakersAdded: number;
  speakersUpdated: number;
  visitsAdded: number;
  visitsUpdated: number;
  hostsAdded: number;
  hostsUpdated: number;
  errors: string[];
}

// ============================================================================
// TYPES POUR LES STATISTIQUES
// ============================================================================

export interface MonthlyStats {
  month: string;
  count: number;
  year: number;
}

export interface TypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface SpeakerStats {
  speakerId: string;
  speakerName: string;
  visitCount: number;
  lastVisit?: string; // ISO date
  averageRating?: number;
}

export interface TalkStats {
  talkNo: string | number;
  theme: string;
  useCount: number;
  lastUsed?: string; // ISO date
  speakers: string[];
}

// ============================================================================
// TYPES POUR LE CACHE
// ============================================================================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en millisecondes
}

export interface CachedData {
  upcomingVisits?: CacheEntry<Visit[]>;
  pastVisits?: CacheEntry<Visit[]>;
  visitsNeedingAction?: CacheEntry<any[]>;
  monthlyStats?: CacheEntry<MonthlyStats[]>;
  speakerTags?: CacheEntry<string[]>;
  hostTags?: CacheEntry<string[]>;
}
