# 🧪 TEST : Vérification du Fix des Données Perdues

## 📋 Checklist de Test

### ✅ Étape 1 : Préparer l'Environnement

```bash
# 1. Build de l'application
npm run build

# 2. Sync avec Android
npx cap sync android

# 3. Ouvrir Android Studio
npx cap open android
```

### ✅ Étape 2 : Générer l'APK

Dans Android Studio :
1. Build > Build Bundle(s) / APK(s) > Build APK(s)
2. Attendre la fin du build
3. Cliquer sur "locate" pour trouver l'APK

### ✅ Étape 3 : Test Initial (Avant Installation)

**Sur l'ancienne version de l'app :**

1. Ouvrir l'application actuelle
2. Aller dans **Paramètres > Accueillants**
3. Noter les informations :
   - [ ] Nombre total d'accueillants : ___________
   - [ ] Nom du 1er accueillant : ___________
   - [ ] Nom du 2ème accueillant : ___________
   - [ ] Nom du 3ème accueillant : ___________

4. Aller dans **Planning**
5. Noter :
   - [ ] Nombre de visites : ___________
   - [ ] Date de la prochaine visite : ___________

6. Aller dans **Orateurs**
7. Noter :
   - [ ] Nombre d'orateurs : ___________
   - [ ] Nom du 1er orateur : ___________

### ✅ Étape 4 : Installation de la Nouvelle APK

1. Transférer l'APK sur le téléphone/tablette
2. Installer l'APK (mise à jour de l'app existante)
3. Ouvrir la nouvelle version

### ✅ Étape 5 : Vérification Post-Installation

**Sur la nouvelle version :**

#### Test 1 : Accueillants
- [ ] Aller dans **Paramètres > Accueillants**
- [ ] Vérifier que le nombre d'accueillants est identique
- [ ] Vérifier que les noms correspondent
- [ ] Vérifier que les détails (téléphone, adresse) sont présents

**Résultat :** ✅ PASS / ❌ FAIL

#### Test 2 : Visites
- [ ] Aller dans **Planning**
- [ ] Vérifier que toutes les visites sont présentes
- [ ] Vérifier que les dates sont correctes
- [ ] Vérifier que les assignations d'hôtes sont conservées

**Résultat :** ✅ PASS / ❌ FAIL

#### Test 3 : Orateurs
- [ ] Aller dans **Orateurs**
- [ ] Vérifier que tous les orateurs sont présents
- [ ] Vérifier que les informations sont complètes

**Résultat :** ✅ PASS / ❌ FAIL

#### Test 4 : Paramètres
- [ ] Aller dans **Paramètres**
- [ ] Vérifier le profil de congrégation
- [ ] Vérifier les templates de messages personnalisés

**Résultat :** ✅ PASS / ❌ FAIL

### ✅ Étape 6 : Test de Migration

**Si vous avez l'ancienne version installée :**

1. Ouvrir Chrome DevTools (si possible via USB debugging)
2. Regarder la console au démarrage
3. Vérifier les messages de migration :

```
🔄 Migration vers Capacitor Preferences...
📦 Données trouvées dans IndexedDB, migration...
✅ Données migrées vers Capacitor Preferences
✅ Migration terminée
```

**Résultat :** ✅ PASS / ❌ FAIL

### ✅ Étape 7 : Test de Persistance

1. Ajouter un nouvel accueillant :
   - Nom : "Test Persistance"
   - Téléphone : "0600000000"

2. Fermer complètement l'application (swipe depuis les apps récentes)

3. Rouvrir l'application

4. Vérifier que "Test Persistance" est toujours présent

**Résultat :** ✅ PASS / ❌ FAIL

### ✅ Étape 8 : Test de Réinstallation Complète

**⚠️ Test avancé - Faire une sauvegarde avant !**

1. Exporter les données (Paramètres > Sauvegarde > Exporter)
2. Désinstaller complètement l'application
3. Réinstaller l'APK
4. Ouvrir l'application
5. Importer les données sauvegardées

**Résultat :** ✅ PASS / ❌ FAIL

## 📊 Résumé des Tests

| Test | Statut | Notes |
|------|--------|-------|
| Accueillants conservés | ⬜ | |
| Visites conservées | ⬜ | |
| Orateurs conservés | ⬜ | |
| Paramètres conservés | ⬜ | |
| Migration automatique | ⬜ | |
| Persistance après fermeture | ⬜ | |
| Réinstallation complète | ⬜ | |

## 🔍 Vérification Technique (Optionnel)

### Via ADB (Android Debug Bridge)

```bash
# 1. Connecter le téléphone en USB
# 2. Activer le débogage USB
# 3. Exécuter :

adb shell
run-as com.kbvfp.app
cd shared_prefs
cat CapacitorStorage.xml

# Vous devriez voir les données stockées
```

### Via Chrome DevTools

```bash
# 1. Connecter le téléphone en USB
# 2. Ouvrir Chrome sur PC
# 3. Aller sur chrome://inspect
# 4. Sélectionner l'app KBV
# 5. Ouvrir la console
# 6. Exécuter :

// Vérifier le stockage
Capacitor.Plugins.Preferences.keys().then(console.log)

// Lire les données
Capacitor.Plugins.Preferences.get({ key: 'kbv-app-data' }).then(console.log)
```

## ✅ Critères de Succès

Le fix est considéré comme réussi si :

1. ✅ **Tous les accueillants** sont présents après installation
2. ✅ **Toutes les visites** sont conservées
3. ✅ **Tous les orateurs** sont présents
4. ✅ **Les paramètres** sont intacts
5. ✅ **La migration** s'effectue automatiquement
6. ✅ **Les données persistent** après fermeture de l'app
7. ✅ **Aucune erreur** dans la console

## ❌ En Cas d'Échec

### Si les données sont perdues :

1. Vérifier que `@capacitor/preferences` est bien installé :
   ```bash
   npm list @capacitor/preferences
   ```

2. Vérifier que le build inclut le nouveau code :
   ```bash
   # Vérifier la présence du fichier storage.ts
   dir dist\assets | findstr storage
   ```

3. Vérifier les logs dans la console Android Studio

4. Contacter le développeur avec :
   - Version de l'APK
   - Logs de la console
   - Étapes pour reproduire

## 📝 Rapport de Test

**Date du test :** ___________
**Version APK :** ___________
**Appareil :** ___________
**Android Version :** ___________

**Résultat global :** ✅ PASS / ❌ FAIL

**Commentaires :**
```
[Vos observations ici]
```

**Testeur :** ___________
**Signature :** ___________

---

## 🎯 Prochaines Étapes

Si tous les tests passent :
- ✅ Déployer en production
- ✅ Informer les utilisateurs
- ✅ Mettre à jour la documentation

Si des tests échouent :
- ❌ Analyser les logs
- ❌ Corriger les problèmes
- ❌ Re-tester

---

**Bonne chance pour les tests ! 🚀**
