# Plan de Nettoyage KBV Lyon - Liste de Tâches

## Objectif
Supprimer 21 fichiers redondants pour nettoyer le projet sans impact fonctionnel.

## Liste des Tâches

### Phase 1: Préparation
- [x] 1.1 Créer une branche de sauvegarde
- [ ] 1.2 Analyser les fichiers à supprimer
- [ ] 1.3 Vérifier les impacts

### Phase 2: Suppression Documentation Redondante (12 fichiers)
- [ ] 2.1 Supprimer CHANGELOG_AMELIORATIONS.md
- [ ] 2.2 Supprimer VERIFICATION_COMPLETE_PLAN.md
- [ ] 2.3 Supprimer GUIDE_SYNCHRONISATION_FINAL.md
- [ ] 2.4 Supprimer LISTE_ORATEURS_HOTES.md
- [ ] 2.5 Supprimer RAPPORT_IMPLEMENTATION_PLAN.md
- [ ] 2.6 Supprimer optimized-dashboard-imports.txt

### Phase 3: Suppression Scripts Inutiles (4 fichiers)
- [ ] 3.1 Supprimer final-clean.js
- [ ] 3.2 Supprimer force-reload.js
- [ ] 3.3 Supprimer rewrite-speaker-list.js
- [ ] 3.4 Supprimer sync-versions.js

### Phase 4: Suppression Documentation Synchronisation (3 fichiers)
- [ ] 4.1 Supprimer plan_synchronisation_versions.md
- [ ] 4.2 Supprimer solution_synchronisation.md
- [ ] 4.3 Supprimer SYNC_GOOGLE_SHEETS.md

### Phase 5: Suppression Fichiers Temporaires (2 fichiers)
- [ ] 5.1 Supprimer todo_auth_jwt_complete.md
- [ ] 5.2 Supprimer dossier .gemini/

### Phase 6: Suppression Builds/Caches (3 éléments)
- [ ] 6.1 Supprimer dossier storybook-static/
- [ ] 6.2 Supprimer dossier dist/

### Phase 7: Vérification
- [ ] 7.1 Tester build: npm run build
- [ ] 7.2 Tester Storybook: npm run build-storybook
- [ ] 7.3 Commit des changements

## Statut: EN COURS
