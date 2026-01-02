# 🚀 Guide de Déploiement Android - KBV Lyon

## 📋 Prérequis

### Logiciels requis :
- ✅ **Node.js** (version 18+)
- ✅ **npm** ou **yarn**
- ✅ **Android Studio** (version 2022.3.1 ou supérieure)
- ✅ **Java JDK** (version 17)
- ✅ **Android SDK** (API 33+)

### Matériel :
- ✅ **Tablette Android** avec USB debugging activé
- ✅ **Câble USB** pour connexion

---

## 🛠️ Étape 1 : Préparation du Build

### Option A : Script Automatique (Recommandé)
```bash
# Double-cliquer sur le fichier build-android.bat
# ou exécuter dans un terminal :
./build-android.bat
```

### Option B : Build Manuel
```bash
# 1. Installer les dépendances
npm install

# 2. Build de l'application web
npm run build

# 3. Synchroniser avec Android
npx cap sync android
```

---

## 📱 Étape 2 : Configuration Android Studio

### 2.1 Ouvrir le Projet
1. **Lancer Android Studio**
2. **Sélectionner** : `File` → `Open`
3. **Naviguer** vers le dossier `android/` de ce projet
4. **Cliquer** sur `OK`

### 2.2 Première Synchronisation
- Attendre que Gradle synchronise automatiquement
- Résoudre les éventuels conflits de dépendances
- Android Studio peut proposer des mises à jour - accepter si nécessaire

### 2.3 Configuration du Device
1. **Connecter** votre tablette Android en USB
2. **Activer** le "USB Debugging" :
   - `Paramètres` → `Options développeur` → `Débogage USB`
3. **Sélectionner** votre tablette dans la barre d'outils d'Android Studio

---

## 🚀 Étape 3 : Lancement sur Tablette

### 3.1 Configuration de Build
1. **Barre d'outils** : Sélectionner `app` dans le menu déroulant
2. **Configuration** : Sélectionner `Debug` (pour développement)

### 3.2 Déploiement
1. **Cliquer** sur le bouton `Run` (▶️ triangle vert)
2. **Attendre** que l'application se compile et s'installe
3. **Accepter** les autorisations sur votre tablette si demandé

### 3.3 Vérification
- L'application **KBVFP** devrait s'ouvrir automatiquement
- Vérifier que toutes les fonctionnalités marchent :
  - ✅ Navigation entre pages
  - ✅ Système d'alertes (cloche en haut à droite)
  - ✅ Zoom sur les images
  - ✅ Modèles de messages

---

## 🔧 Dépannage

### Problème : "Device not found"
```bash
# Vérifier la connexion USB
adb devices

# Redémarrer ADB
adb kill-server
adb start-server
```

### Problème : Build échoue
```bash
# Nettoyer le cache Gradle
cd android
./gradlew clean
./gradlew build
```

### Problème : Application ne s'ouvre pas
- Vérifier les logs Android Studio (onglet "Logcat")
- Redémarrer la tablette
- Réinstaller l'application

---

## 📦 Build de Production

Pour créer un APK de production :

1. **Android Studio** : `Build` → `Generate Signed APK`
2. **Suivre** l'assistant de signature
3. **APK final** : `android/app/build/outputs/apk/release/app-release.apk`

---

## 🎯 Fonctionnalités Testées sur Mobile

- ✅ **Navigation responsive** adaptée aux tablettes
- ✅ **Système d'alertes** en temps réel
- ✅ **Zoom sur les images** tactiles
- ✅ **Modèles de messages** sauvegardés localement
- ✅ **Interface optimisée** pour écrans tactiles
- ✅ **Notifications locales** Capacitor
- ✅ **Stockage offline** IndexedDB

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier les logs d'Android Studio
2. Tester sur un émulateur Android d'abord
3. Consulter la documentation Capacitor : https://capacitorjs.com/

**Bonne utilisation de KBV Lyon sur votre tablette !** 📱✨
