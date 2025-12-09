# Script de Corrections d'Accessibilité - Partie 2

## Fichiers à corriger

### 1. CancellationModal.tsx (ligne 305)
- **Problème:** Input checkbox sans aria-label
- **Solution:** Ajouter aria-label="Notifier l'orateur"

### 2. DuplicateDetectionModal.tsx (ligne 266)
- **Problème:** Input checkbox sans aria-label  
- **Solution:** Ajouter aria-label au checkbox de sélection

### 3. ReportGeneratorModal.tsx (lignes 174, 185)
- **Problème:** Inputs date sans aria-label
- **Solution:** Ajouter aria-label="Date de début" et "Date de fin"

### 4. ImportWizardModal.tsx (ligne 271)
- **Problème:** Select sans aria-label
- **Solution:** Ajouter aria-label="Mapper la colonne"

### 5. ArchiveManagerModal.tsx (lignes 187, 198, 208, 255)
- **Problème:** 3 selects et 1 checkbox sans aria-label
- **Solution:** Ajouter aria-label appropriés

## Corrections à appliquer

Tous ces éléments ont déjà des labels visibles, donc on ajoute juste aria-label pour renforcer l'accessibilité.
