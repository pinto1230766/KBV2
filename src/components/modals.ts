// ============================================================================
// EXPORT CENTRALISÉ DES NOUVELLES MODALES
// ============================================================================

// Planning & Coordination
export { ConflictDetectionModal } from './planning/ConflictDetectionModal';
export { CancellationModal } from './planning/CancellationModal';
export { EmergencyReplacementModal } from './planning/EmergencyReplacementModal';

// Feedback & Évaluation
export { FeedbackFormModal } from './feedback/FeedbackFormModal';

// Logistique
export { TravelCoordinationModal } from './logistics/TravelCoordinationModal';
export { MealPlanningModal } from './logistics/MealPlanningModal';

// Paramètres & Gestion
export { DuplicateDetectionModal } from './settings/DuplicateDetectionModal';
export { BackupManagerModal } from './settings/BackupManagerModal';
export { ImportWizardModal } from './settings/ImportWizardModal';

// Rapports
export { ReportGeneratorModal } from './reports/ReportGeneratorModal';

// Types exportés
export type { CancellationData } from './planning/CancellationModal';
export type { TravelPlan } from './logistics/TravelCoordinationModal';
export type { MealPlan } from './logistics/MealPlanningModal';
export type { ReportConfig } from './reports/ReportGeneratorModal';
