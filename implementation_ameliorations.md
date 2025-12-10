# Améliorations KBV2 - Liste de Tâches

## Vue d'ensemble
Implémentation des recommandations d'amélioration pour l'application KBV2.

## Tâches principales

### Phase 1: Composant d'icône clavier
- [x] 1.1 Créer le composant KeyboardShortcutIcon.tsx

### Phase 2: Nouvelles actions uniques
- [ ] 2.1 Ajouter "Synchroniser avec Google Sheets" à QuickActionsModal
- [ ] 2.2 Ajouter "Exporter toutes les données" à QuickActionsModal  
- [ ] 2.3 Ajouter "Rechercher un orateur ou une visite" à QuickActionsModal
- [ ] 2.4 Ajouter "Afficher les statistiques" à QuickActionsModal
- [ ] 2.5 Créer les handlers pour ces nouvelles actions

### Phase 3: Nouveaux raccourcis clavier
- [ ] 3.1 Ajouter Ctrl+S pour sauvegarde (utiliser action backup-data existante)
- [ ] 3.2 Ajouter Ctrl+F pour rechercher (nouvelle action search-global)
- [ ] 3.3 Ajouter Ctrl+P pour imprimer (nouvelle action print-report)
- [ ] 3.4 Ajouter / pour focus recherche (focus sur champ de recherche QuickActions)

### Phase 4: Icônes visuelles sur boutons
- [ ] 4.1 Modifier les boutons Dashboard pour inclure icônes ⌨️
- [ ] 4.2 Modifier les actions QuickActionsModal pour afficher icônes ⌨️
- [ ] 4.3 Ajouter l'icône aux boutons dans les pages individuelles

### Phase 5: Tests et validation
- [ ] 5.1 Tester tous les nouveaux raccourcis clavier
- [ ] 5.2 Vérifier l'affichage des icônes sur différents écrans
- [ ] 5.3 Tester la responsivité mobile
- [ ] 5.4 Valider l'accessibilité

## État actuel
- ✅ Composant KeyboardShortcutIcon créé
- 🔄 En cours d'implémentation des nouvelles actions
