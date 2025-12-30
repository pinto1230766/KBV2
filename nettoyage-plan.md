# 🧹 Plan de Nettoyage Sécurisé - KBV Lyon

## 🎯 Objectif
Supprimer les fichiers redondants sans impact sur le code et le design.

## ✅ Branche de Sauvegarde
- `backup-cleanup-20251230` : ✅ Créée précédemment

## 📋 Liste des Fichiers à Supprimer

### Phase 1: Documentation Redondante (SÛR)
- [ ] `CHANGELOG_AMELIORATIONS.md` (doublon avec SESSION_SUMMARY.md)
- [ ] `VERIFICATION_COMPLETE_PLAN.md` (intégré dans plan principal)
- [ ] `GUIDE_SYNCHRONISATION_FINAL.md` (obsolète)
- [ ] `LISTE_ORATEURS_HOTES.md` (données plutôt que doc)
- [ ] `RAPPORT_IMPLEMENTATION_PLAN.md` (doublon)
- [ ] `optimized-dashboard-imports.txt` (travail temporaire)

### Phase 2: Scripts Ponctuels (SÛR)
- [ ] `final-clean.js` (script ponctuel)
- [ ] `force-reload.js` (débogage)
- [ ] `rewrite-speaker-list.js` (usage unique)
- [ ] `sync-versions.js` (synchronisation)

### Phase 3: Fichiers Temporaires (SÛR)
- [ ] `.gemini/` (cache IA)
- [ ] `todo_auth_jwt_complete.md` (todo terminé)

### Phase 4: Builds Régénérables (SÛR)
- [ ] `dist/` (regénéré par npm run build)
- [ ] `storybook-static/` (regénéré par npm run build-storybook)

## 🧪 Tests de Validation
Après chaque phase :
- [ ] `npm run build` (validation build)
- [ ] `npm run build-storybook` (validation Storybook)
- [ ] Vérification visuelle de l'interface

## 🚨 Critères d'Arrêt
- Si build échoue → Rollback immédiat
- Si design cassé → Rollback immédiat
- Si erreurs TypeScript → Rollback immédiat
