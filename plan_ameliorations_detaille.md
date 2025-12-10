# Plan d'amélioration détaillé - KBV2

## Analyse de l'architecture actuelle

### Composants identifiés :
- **Dashboard.tsx** : Contient les boutons "Actions rapides" et "Générer un rapport"
- **QuickActionsModal.tsx** : Modal des actions rapides avec 8 actions existantes
- **MainLayout.tsx** : Layout principal avec navigation
- **Hooks de raccourcis clavier** : useKeyboardShortcuts.ts existe déjà

### Actions rapides actuelles dans QuickActionsModal :
1. Programmer une visite (Ctrl+N)
2. Vérifier les conflits (Ctrl+K)
3. Ajouter un orateur (Ctrl+Shift+S)
4. Ajouter un hôte (Ctrl+Shift+H)
5. Envoyer un message (Ctrl+M)
6. Générer un rapport (Ctrl+R)
7. Sauvegarder les données (Ctrl+B)
8. Importer des données (Ctrl+I)

## Liste de tâches détaillée

### Phase 1: Nouvelles actions uniques à ajouter
- [ ] 1.1 Ajouter "Synchroniser avec Google Sheets" à QuickActionsModal
- [ ] 1.2 Ajouter "Exporter toutes les données" à QuickActionsModal  
- [ ] 1.3 Ajouter "Rechercher un orateur ou une visite" à QuickActionsModal
- [ ] 1.4 Ajouter "Afficher les statistiques" à QuickActionsModal
- [ ] 1.5 Créer les handlers pour ces nouvelles actions

### Phase 2: Nouveaux raccourcis clavier
- [ ] 2.1 Ajouter Ctrl+S pour sauvegarde (utiliser action backup-data existante)
- [ ] 2.2 Ajouter Ctrl+F pour rechercher (nouvelle action search-global)
- [ ] 2.3 Ajouter Ctrl+P pour imprimer (nouvelle action print-report)
- [ ] 2.4 Ajouter / pour focus recherche (focus sur champ de recherche QuickActions)

### Phase 3: Indication visuelle des raccourcis
- [ ] 3.1 Créer composant KeyboardShortcutIcon
- [ ] 3.2 Modifier les boutons Dashboard pour inclure icônes ⌨️
- [ ] 3.3 Modifier les actions QuickActionsModal pour afficher icônes ⌨️
- [ ] 3.4 Ajouter l'icône aux boutons dans les pages individuelles

### Phase 4: Test et validation
- [ ] 4.1 Tester tous les nouveaux raccourcis clavier
- [ ] 4.2 Vérifier l'affichage des icônes sur différents écrans
- [ ] 4.3 Tester la responsivité mobile
- [ ] 4.4 Valider l'accessibilité

## Structure des fichiers à modifier

1. **src/components/ui/QuickActionsModal.tsx** - Ajouter nouvelles actions
2. **src/hooks/useKeyboardShortcuts.ts** - Ajouter nouveaux raccourcis
3. **src/components/ui/KeyboardShortcutIcon.tsx** - Créer nouveau composant
4. **src/pages/Dashboard.tsx** - Ajouter icônes aux boutons existants
5. **src/pages/** - Pages individuelles pour ajouter icônes raccourcis

## Priorité d'implémentation
1. Nouvelles actions (Phase 1)
2. Raccourcis clavier (Phase 2) 
3. Icônes visuelles (Phase 3)
4. Tests (Phase 4)
