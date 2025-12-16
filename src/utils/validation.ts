import { z } from 'zod';

// Schémas de validation pour les entités principales

// Validation des dépenses
export const ExpenseSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string()
    .min(1, 'La description est requise')
    .max(255, 'La description ne peut pas dépasser 255 caractères')
    .trim(),
  amount: z.number()
    .positive('Le montant doit être positif')
    .max(999999.99, 'Le montant ne peut pas dépasser 999 999,99'),
  category: z.string()
    .max(50, 'La catégorie ne peut pas dépasser 50 caractères')
    .optional()
    .or(z.literal('')),
  date: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Date invalide'),
  receiptUrl: z.string().url('URL de reçu invalide').optional().or(z.literal('')),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Validation des orateurs
export const SpeakerSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string()
    .min(1, 'Le prénom est requis')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .trim(),
  lastName: z.string()
    .min(1, 'Le nom est requis')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),
  email: z.string()
    .email('Email invalide')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères')
    .trim(),
  phone: z.string()
    .regex(/^[+]?[0-9][\d]{0,15}$/, 'Téléphone invalide')
    .optional()
    .or(z.literal('')),
  company: z.string()
    .max(100, 'L\'entreprise ne peut pas dépasser 100 caractères')
    .optional()
    .or(z.literal('')),
  bio: z.string()
    .max(500, 'La biographie ne peut pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
  tags: z.array(z.string()).optional(),
  socialLinks: z.object({
    linkedin: z.string().url('URL LinkedIn invalide').optional().or(z.literal('')),
    twitter: z.string().url('URL Twitter invalide').optional().or(z.literal('')),
    website: z.string().url('URL site web invalide').optional().or(z.literal(''))
  }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Validation des hôtes
export const HostSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string()
    .min(1, 'Le prénom est requis')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .trim(),
  lastName: z.string()
    .min(1, 'Le nom est requis')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),
  email: z.string()
    .email('Email invalide')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères')
    .trim(),
  phone: z.string()
    .regex(/^[+]?[0-9][\d]{0,15}$/, 'Téléphone invalide')
    .optional()
    .or(z.literal('')),
  address: z.object({
    street: z.string().min(1, 'La rue est requise').max(200, 'La rue ne peut pas dépasser 200 caractères'),
    city: z.string().min(1, 'La ville est requise').max(100, 'La ville ne peut pas dépasser 100 caractères'),
    postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide'),
    country: z.string().min(1, 'Le pays est requis').max(50, 'Le pays ne peut pas dépasser 50 caractères')
  }),
  capacity: z.number()
    .positive('La capacité doit être positive')
    .max(1000, 'La capacité ne peut pas dépasser 1000'),
  amenities: z.array(z.string()).optional(),
  notes: z.string()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Validation des visites
export const VisitSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string()
    .min(1, 'Le titre est requis')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères')
    .trim(),
  description: z.string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional()
    .or(z.literal('')),
  date: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Date de visite invalide'),
  startTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Heure de début invalide (format HH:MM)'),
  endTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Heure de fin invalide (format HH:MM)'),
  speakerId: z.string().uuid('ID d\'orateur invalide'),
  hostId: z.string().uuid('ID d\'hôte invalide'),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled']),
  notes: z.string()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Fonctions de validation exportées
export const validateSpeaker = (data: unknown) => validateData(SpeakerSchema, data);
export const validateHost = (data: unknown) => validateData(HostSchema, data);
export const validateVisit = (data: unknown) => validateData(VisitSchema, data);
    // Validation des messages
export const MessageSchema = z.object({
  id: z.string().uuid().optional(),
  recipientId: z.string().uuid('ID de destinataire invalide'),
  subject: z.string()
    .min(1, 'Le sujet est requis')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères')
    .trim(),
  content: z.string()
    .min(1, 'Le contenu est requis')
    .max(5000, 'Le contenu ne peut pas dépasser 5000 caractères')
    .trim(),
  template: z.string().optional(),
  status: z.enum(['draft', 'sent', 'delivered', 'read']),
  priority: z.enum(['low', 'normal', 'high']),
  scheduledAt: z.string().datetime('Date de programmation invalide').optional(),
  sentAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Validation générique pour les formulaires
export const FormValidationSchema = z.object({
  isValid: z.boolean(),
  errors: z.record(z.string(), z.array(z.string())),
  warnings: z.record(z.string(), z.array(z.string())).optional()
});

// Fonctions utilitaires de validation

/**
 * Valide des données selon un schéma Zod
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown, _options?: any): { 
  success: boolean; 
  data?: T; 
  errors?: Record<string, string[]>; 
} {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return {
        success: false,
        errors
      };
    }
    return {
      success: false,
      errors: { general: ['Erreur de validation inconnue'] }
    };
  }
}

/**
 * Valide un formulaire avec des règles spécifiques
 */
export function validateForm(formData: Record<string, any>, rules: Record<string, z.ZodSchema<any>>): {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
} {
  const errors: Record<string, string[]> = {};
  const warnings: Record<string, string[]> = {};

  for (const [fieldName, rule] of Object.entries(rules)) {
    const value = formData[fieldName];
    const fieldResult = validateData(rule, value, {});
    
    if (!fieldResult.success && fieldResult.errors) {
      errors[fieldName] = Object.values(fieldResult.errors).flat();
    }

    // Règles de validation supplémentaires
    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        if (!errors[fieldName]) errors[fieldName] = [];
        errors[fieldName].push('Format d\'email invalide');
      }
    }

    if (fieldName === 'phone' && value) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-()]/g, ''))) {
        if (!errors[fieldName]) errors[fieldName] = [];
        errors[fieldName].push('Format de téléphone invalide');
      }
    }

    // Validation des mots de passe
    if (fieldName === 'password' && value) {
      if (value.length < 8) {
        if (!errors[fieldName]) errors[fieldName] = [];
        errors[fieldName].push('Le mot de passe doit contenir au moins 8 caractères');
      }
      if (!/(?=.*[a-z])/.test(value)) {
        if (!warnings[fieldName]) warnings[fieldName] = [];
        warnings[fieldName].push('Le mot de passe devrait contenir au moins une minuscule');
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        if (!warnings[fieldName]) warnings[fieldName] = [];
        warnings[fieldName].push('Le mot de passe devrait contenir au moins une majuscule');
      }
      if (!/(?=.*\d)/.test(value)) {
        if (!warnings[fieldName]) warnings[fieldName] = [];
        warnings[fieldName].push('Le mot de passe devrait contenir au moins un chiffre');
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings: Object.keys(warnings).length > 0 ? warnings : {}
  };
}

/**
 * Nettoie et sanitise les données d'entrée
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (input == null) return '';
  return String(input)
    .trim()
    .replace(/[<>]/g, '') // Supprime les balises HTML de base
    .replace(/javascript:/gi, '') // Supprime les protocoles JavaScript
    .replace(/on\w+=/gi, ''); // Supprime les event handlers
}

/**
 * Valide et nettoie les données d'un formulaire
 */
export function sanitizeFormData(formData: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Handle nested objects recursively
      sanitized[key] = sanitizeFormData(value);
    } else if (Array.isArray(value)) {
      // Handle arrays of objects
      sanitized[key] = value.map(item =>
        typeof item === 'object' && item !== null ? sanitizeFormData(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// Export des types TypeScript inférés
export type Expense = z.infer<typeof ExpenseSchema>;
export type Speaker = z.infer<typeof SpeakerSchema>;
export type Host = z.infer<typeof HostSchema>;
export type Visit = z.infer<typeof VisitSchema>;
export type Message = z.infer<typeof MessageSchema>;

// Fonctions de validation spécifiques
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  // Must start with + or digit, and be at least 7 digits long (excluding +)
  const phoneRegex = /^[+]?[0-9][\d]{6,14}$/;
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 7;
};

export const isValidDate = (date: string): boolean => {
  if (!date || typeof date !== 'string') return false;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return false;

  // Check if the date components match what was parsed
  const [year, month, day] = date.split('T')[0].split('-').map(Number);
  if (dateObj.getFullYear() !== year || dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day) {
    return false;
  }

  return true;
};

export default {
  ExpenseSchema,
  SpeakerSchema,
  HostSchema,
  VisitSchema,
  MessageSchema,
  validateData,
  validateForm,
  sanitizeInput,
  sanitizeFormData,
  isValidEmail,
  isValidPhone,
  isValidDate
};
