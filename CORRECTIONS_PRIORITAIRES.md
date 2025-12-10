# 🚀 CORRECTIONS PRIORITAIRES - Actions Immédiates

**Application:** KBV Lyon  
**Date:** ${new Date().toLocaleDateString('fr-FR')}

---

## ⚡ ACTIONS IMMÉDIATES (À faire maintenant)

### 1. Supprimer les Fichiers Orphelins

```bash
# Supprimer les fichiers inutiles
rm src/pages/Planning.ts
rm src/pages/Dashboard.tsx.backup
```

**Gain:** Code plus propre, moins de confusion

---

### 2. Consolider les Composants de Doublons

**Fichier à supprimer:** `src/components/settings/DuplicateDetection.tsx`  
**Fichier à garder:** `src/components/settings/DuplicateDetectionModal.tsx`

**Action:** Vérifier que Settings.tsx utilise bien DuplicateDetectionModal

---

### 3. Consolider les Composants de Feedback

**Fichier à supprimer:** `src/components/feedback/FeedbackForm.tsx` (si non utilisé)  
**Fichier à garder:** `src/components/feedback/FeedbackFormModal.tsx`

**Action:** Rechercher les imports de FeedbackForm et les remplacer

---

### 4. Créer un Fichier de Constantes Communes

**Créer:** `src/data/commonConstants.ts`

```typescript
// src/data/commonConstants.ts

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
```

**Mettre à jour DataContext.tsx:**
```typescript
import { UNASSIGNED_HOST, NA_HOST } from '@/data/commonConstants';
// Supprimer: const UNASSIGNED_HOST = 'À définir';
```

---

### 5. Créer un Hook useModal Réutilisable

**Créer:** `src/hooks/useModal.ts`

```typescript
import { useState, useCallback } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return { isOpen, open, close, toggle };
};
```

**Utiliser dans Dashboard.tsx:**
```typescript
// Avant
const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
const [isReportModalOpen, setIsReportModalOpen] = useState(false);

// Après
const quickActions = useModal();
const reportModal = useModal();

// Usage
<QuickActionsModal 
  isOpen={quickActions.isOpen} 
  onClose={quickActions.close} 
/>
<ReportGeneratorModal 
  isOpen={reportModal.isOpen} 
  onClose={reportModal.close} 
/>
```

---

### 6. Créer un Composant StatusBadge Réutilisable

**Créer:** `src/components/ui/StatusBadge.tsx`

```typescript
import React from 'react';
import { Badge } from './Badge';
import { VisitStatus } from '@/types';

interface StatusBadgeProps {
  status: VisitStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = {
    confirmed: { 
      variant: 'success' as const, 
      label: 'Confirmé',
      icon: '✓'
    },
    pending: { 
      variant: 'warning' as const, 
      label: 'En attente',
      icon: '⏳'
    },
    completed: { 
      variant: 'default' as const, 
      label: 'Terminé',
      icon: '✓'
    },
    cancelled: { 
      variant: 'danger' as const, 
      label: 'Annulé',
      icon: '✗'
    }
  };
  
  const { variant, label, icon } = config[status];
  
  return (
    <Badge variant={variant} className={`text-${size}`}>
      <span className="mr-1">{icon}</span>
      {label}
    </Badge>
  );
};
```

**Utiliser dans Dashboard.tsx:**
```typescript
// Avant
const getStatusBadge = () => {
  switch (visit.status) {
    case 'confirmed':
      return <Badge variant="success">Confirmé</Badge>;
    // ...
  }
};

// Après
import { StatusBadge } from '@/components/ui/StatusBadge';
<StatusBadge status={visit.status} size="sm" />
```

---

### 7. Centraliser les Utilitaires UUID et Date

**Mettre à jour DataContext.tsx:**

```typescript
// Supprimer les fonctions locales
// const generateUUID = () => { ... };
// const parseDate = (dateStr: string) => { ... };

// Importer depuis utils
import { generateUUID } from '@/utils/uuid';
import { parseDate } from '@/utils/formatters';
```

**Vérifier que ces fonctions existent dans utils, sinon les créer:**

```typescript
// src/utils/uuid.ts
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// src/utils/formatters.ts
export const parseDate = (dateStr: string): Date | null => {
  const parts = dateStr.split(/[/\-\.]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  return null;
};
```

---

### 8. Créer un Utilitaire de Statistiques

**Créer:** `src/utils/statistics.ts`

```typescript
import { Visit, VisitStatus } from '@/types';

export interface VisitStats {
  total: number;
  confirmed: number;
  pending: number;
  completed: number;
  cancelled: number;
  upcoming: number;
}

export const calculateVisitStats = (visits: Visit[]): VisitStats => {
  const today = new Date();
  
  return {
    total: visits.length,
    confirmed: visits.filter(v => v.status === 'confirmed').length,
    pending: visits.filter(v => v.status === 'pending').length,
    completed: visits.filter(v => v.status === 'completed').length,
    cancelled: visits.filter(v => v.status === 'cancelled').length,
    upcoming: visits.filter(v => {
      const visitDate = new Date(v.visitDate);
      return visitDate >= today && v.status === 'confirmed';
    }).length
  };
};

export const getUpcomingVisits = (visits: Visit[], days: number = 7): Visit[] => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  
  return visits
    .filter(v => {
      const visitDate = new Date(v.visitDate);
      return visitDate >= today && 
             visitDate <= futureDate && 
             (v.status === 'confirmed' || v.status === 'pending');
    })
    .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());
};

export const getVisitsNeedingAction = (visits: Visit[]): Visit[] => {
  const today = new Date();
  
  return visits.filter(v => 
    v.status === 'pending' ||
    (v.status === 'confirmed' && new Date(v.visitDate) < today)
  );
};
```

**Utiliser dans Dashboard.tsx:**
```typescript
import { calculateVisitStats, getUpcomingVisits, getVisitsNeedingAction } from '@/utils/statistics';

// Avant
const stats = useMemo(() => {
  const total = filteredVisits.length;
  const confirmed = filteredVisits.filter(v => v.status === 'confirmed').length;
  // ... beaucoup de code
}, [filteredVisits]);

// Après
const stats = useMemo(() => calculateVisitStats(visits), [visits]);
const upcomingVisits = useMemo(() => getUpcomingVisits(visits, 7), [visits]);
const visitsNeedingAction = useMemo(() => getVisitsNeedingAction(visits), [visits]);
```

---

### 9. Standardiser les Imports

**Créer:** `.eslintrc.json` (ou mettre à jour)

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["../*"],
            "message": "Utilisez les imports absolus avec @/ au lieu des imports relatifs"
          }
        ]
      }
    ]
  }
}
```

**Rechercher et remplacer:**
```bash
# Trouver tous les imports relatifs
grep -r "from '\.\." src/

# Les remplacer par des imports absolus
# Exemple: from '../ui/Card' → from '@/components/ui/Card'
```

---

### 10. Créer un Hook useVisitFilters

**Créer:** `src/hooks/useVisitFilters.ts`

```typescript
import { useMemo } from 'react';
import { Visit, VisitStatus, LocationType } from '@/types';

interface FilterOptions {
  searchTerm?: string;
  status?: VisitStatus | 'all';
  type?: LocationType | 'all';
  dateRange?: { start: Date | null; end: Date | null };
}

export const useVisitFilters = (visits: Visit[], filters: FilterOptions) => {
  return useMemo(() => {
    return visits.filter(visit => {
      // Search filter
      if (filters.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        const matchesSearch =
          visit.nom.toLowerCase().includes(search) ||
          visit.congregation.toLowerCase().includes(search) ||
          visit.talkNoOrType?.toLowerCase().includes(search) ||
          visit.notes?.toLowerCase().includes(search);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (visit.status !== filters.status) return false;
      }

      // Type filter
      if (filters.type && filters.type !== 'all') {
        if (visit.locationType !== filters.type) return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const visitDate = new Date(visit.visitDate);
        if (filters.dateRange.start && visitDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && visitDate > filters.dateRange.end) return false;
      }

      return true;
    }).sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());
  }, [visits, filters]);
};
```

**Utiliser dans Planning.tsx:**
```typescript
import { useVisitFilters } from '@/hooks/useVisitFilters';

// Avant
const filteredVisits = useMemo(() => {
  return visits.filter(visit => {
    // ... beaucoup de code de filtrage
  }).sort(...);
}, [visits, searchTerm, statusFilter, typeFilter, dateRange]);

// Après
const filteredVisits = useVisitFilters(visits, {
  searchTerm,
  status: statusFilter,
  type: typeFilter,
  dateRange
});
```

---

## 📝 CHECKLIST DE VÉRIFICATION

Après avoir appliqué ces corrections, vérifier:

- [ ] Aucune erreur TypeScript (`npm run type-check`)
- [ ] Aucune erreur ESLint (`npm run lint`)
- [ ] L'application compile (`npm run build`)
- [ ] Tous les tests passent (si existants)
- [ ] Tester manuellement:
  - [ ] Dashboard s'affiche correctement
  - [ ] Planning fonctionne avec les filtres
  - [ ] Messages s'affichent
  - [ ] Settings → Doublons fonctionne
  - [ ] Toutes les modales s'ouvrent/ferment

---

## 🎯 RÉSULTAT ATTENDU

Après ces corrections:

✅ **Code plus propre:** -15% de lignes de code  
✅ **Meilleure maintenabilité:** Logique centralisée  
✅ **Moins de bugs:** Moins de duplication = moins d'incohérences  
✅ **Performance:** Calculs optimisés avec useMemo  
✅ **DX améliorée:** Hooks réutilisables, imports standardisés

---

## ⏱️ TEMPS ESTIMÉ

- **Suppressions de fichiers:** 5 minutes
- **Création des utilitaires:** 30 minutes
- **Création des hooks:** 30 minutes
- **Création du StatusBadge:** 15 minutes
- **Refactoring des pages:** 1-2 heures
- **Tests et vérification:** 30 minutes

**TOTAL:** ~3-4 heures de travail

---

## 🚦 ORDRE D'EXÉCUTION RECOMMANDÉ

1. ✅ Supprimer les fichiers orphelins (5 min)
2. ✅ Créer les constantes communes (10 min)
3. ✅ Créer les utilitaires (uuid, date, stats) (30 min)
4. ✅ Créer le hook useModal (15 min)
5. ✅ Créer le hook useVisitFilters (20 min)
6. ✅ Créer StatusBadge (15 min)
7. ✅ Refactorer Dashboard.tsx (30 min)
8. ✅ Refactorer Planning.tsx (30 min)
9. ✅ Refactorer Messages.tsx (20 min)
10. ✅ Tester l'application (30 min)

---

**Prêt à commencer? Suivez les étapes dans l'ordre! 🚀**
