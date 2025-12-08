# Guide de Build et Déploiement - Samsung Tab S10 Ultra

## 🚀 Étapes de Déploiement

### Prérequis

- ✅ Node.js installé
- ✅ Android Studio installé
- ✅ Samsung Tab S10 Ultra avec mode développeur activé
- ✅ Câble USB pour connexion

---

## 📱 Étape 1 : Activer le Mode Développeur

Sur votre Samsung Tab S10 Ultra :

1. **Paramètres** → **À propos de la tablette**
2. Appuyez 7 fois sur **Numéro de build**
3. **Paramètres** → **Options de développement**
4. Activez **Débogage USB**
5. Activez **Installer via USB**

---

## 🔧 Étape 2 : Build de l'Application

```bash
# 1. Installer les dépendances
npm install

# 2. Build de production
npm run build

# 3. Synchroniser avec Capacitor
npx cap sync android

# 4. Ouvrir dans Android Studio
npx cap open android
```

---

## 🏗️ Étape 3 : Configuration Android Studio

### Option A : Build depuis Android Studio (Recommandé)

1. Android Studio s'ouvre automatiquement
2. Attendez la synchronisation Gradle (2-5 min)
3. Connectez votre tablette via USB
4. Cliquez sur **Run** ▶️ (ou Shift+F10)
5. Sélectionnez votre Samsung Tab S10 Ultra
6. L'app s'installe et se lance automatiquement

### Option B : Build en ligne de commande

```bash
# Dans le dossier android/
cd android

# Build APK debug
./gradlew assembleDebug

# Installer sur l'appareil connecté
./gradlew installDebug

# Ou tout en une commande
./gradlew installDebug
```

---

## 🔍 Étape 4 : Tests de Validation

### Test 1 : Icône de l'Application ✓
- [ ] Icône visible dans le launcher
- [ ] Icône nette et bien proportionnée
- [ ] Couleurs correctes (dégradé bleu)

### Test 2 : Mode Portrait ✓
- [ ] Tab bar iOS visible en bas
- [ ] Navigation fonctionne
- [ ] Dashboard en layout vertical
- [ ] Bouton menu accessible

### Test 3 : Mode Paysage ✓
- [ ] Sidebar apparaît automatiquement (320px)
- [ ] Navigation entre sections avec flèches
- [ ] Dashboard en 2 colonnes (8/12 + 4/12)
- [ ] Tab bar caché

### Test 4 : Rotation d'Écran ✓
- [ ] Portrait → Paysage : transition fluide
- [ ] Paysage → Portrait : transition fluide
- [ ] Pas de perte de données
- [ ] Layout s'adapte correctement

### Test 5 : Navigation ✓
- [ ] Accueil (Dashboard)
- [ ] Planning
- [ ] Messages
- [ ] Orateurs
- [ ] Discours
- [ ] Paramètres

### Test 6 : Performance ✓
- [ ] Chargement initial < 3s
- [ ] Navigation fluide (60fps)
- [ ] Scroll sans lag
- [ ] Animations fluides

---

## 🐛 Troubleshooting

### Problème : Appareil non détecté

```bash
# Vérifier la connexion
adb devices

# Si vide, vérifier :
# 1. Câble USB fonctionnel
# 2. Mode développeur activé
# 3. Débogage USB autorisé (popup sur tablette)
```

### Problème : Erreur de build Gradle

```bash
# Nettoyer le cache
cd android
./gradlew clean

# Rebuild
./gradlew assembleDebug
```

### Problème : App ne se lance pas

```bash
# Voir les logs
adb logcat | grep -i "kbv"

# Désinstaller et réinstaller
adb uninstall com.kbvlyon.app
./gradlew installDebug
```

### Problème : Sidebar ne s'affiche pas

**Vérification :**
1. Ouvrir DevTools (si possible)
2. Vérifier `window.innerWidth` en paysage
3. Doit être ≥ 1848px pour Samsung Tab S10 Ultra

**Solution temporaire :**
Modifier `src/components/layout/TabletLayout.tsx` :
```typescript
// Ligne ~40, réduire le seuil si nécessaire
const isSamsungTablet = isTablet && window.innerWidth >= 1024;
```

---

## 📊 Checklist de Validation Complète

### Interface Utilisateur
- [ ] Icône de l'app correcte
- [ ] Splash screen (si configuré)
- [ ] Thème clair/sombre fonctionne
- [ ] Toutes les pages accessibles
- [ ] Formulaires fonctionnels
- [ ] Boutons réactifs

### Fonctionnalités
- [ ] Ajout d'orateur
- [ ] Création de visite
- [ ] Envoi de message
- [ ] Synchronisation données
- [ ] Mode hors ligne
- [ ] Pull-to-refresh

### Optimisations Samsung
- [ ] Détection tablette correcte
- [ ] Layout adaptatif
- [ ] Sidebar en paysage
- [ ] Tab bar en portrait
- [ ] S Pen détecté (si utilisé)
- [ ] Gestures Android

### Performance
- [ ] Temps de chargement acceptable
- [ ] Pas de freeze/lag
- [ ] Mémoire < 300MB
- [ ] Batterie normale
- [ ] Pas de crash

---

## 🎯 Commandes Rapides

```bash
# Build complet
npm run build && npx cap sync android && npx cap open android

# Build et install direct
npm run build && npx cap sync android && cd android && ./gradlew installDebug

# Voir les logs en temps réel
adb logcat | grep -E "(KBV|Capacitor|Chromium)"

# Prendre une capture d'écran
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png

# Enregistrer une vidéo
adb shell screenrecord /sdcard/demo.mp4
# Ctrl+C pour arrêter
adb pull /sdcard/demo.mp4
```

---

## 📸 Captures d'Écran Recommandées

Pour documentation :
1. **Portrait** : Dashboard avec tab bar
2. **Paysage** : Dashboard avec sidebar
3. **Sidebar** : Navigation complète
4. **Planning** : Vue calendrier
5. **Messages** : Interface de messagerie
6. **Icône** : Launcher Android

---

## 🔄 Mise à Jour de l'Application

```bash
# 1. Modifier le code
# 2. Rebuild
npm run build
npx cap sync android

# 3. Réinstaller
cd android
./gradlew installDebug
```

---

## 📦 Build de Production (APK Release)

```bash
# 1. Build production
npm run build
npx cap sync android

# 2. Générer APK signé
cd android
./gradlew assembleRelease

# APK généré dans :
# android/app/build/outputs/apk/release/app-release.apk
```

**Note :** Pour un APK signé, configurez d'abord le keystore dans `android/app/build.gradle`

---

## ✅ Validation Finale

Une fois tous les tests passés :

1. ✅ Cocher tous les items dans `GUIDE_OPTIMISATION_SAMSUNG.md`
2. ✅ Documenter les problèmes rencontrés
3. ✅ Prendre des captures d'écran
4. ✅ Créer un rapport de test
5. ✅ Partager avec l'équipe

---

**Prêt à déployer ! 🚀**
