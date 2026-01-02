# 💾 Documentation Complète - Système de Sauvegarde Samsung Tab S10 Ultra

Ce document regroupe l'ensemble des guides et informations concernant la nouvelle fonctionnalité de sauvegarde pour l'application KBV Lyon.

---

## 📑 Sommaire
1. [Vue d'Ensemble](#-vue-p-ensemble)
2. [Démarrage Rapide](#-démarrage-rapide)
3. [Guide de Sauvegarde Complet](#-guide-de-sauvegarde-complet)
4. [Guide de Déploiement Android Studio](#-guide-de-déploiement-android-studio)
5. [Documentation Technique](#-documentation-technique)
6. [Index des Fichiers](#-index-des-fichiers)

---

## 🎯 Vue d'Ensemble
*Référence : LISEZ_MOI_DABORD.md*

J'ai complètement réorganisé le système de sauvegarde pour que les fichiers soient enregistrés dans un dossier dédié **Documents/KBV/** au lieu du dossier Downloads.

### ✅ Ce qui a été fait
- **Code Source** : Création de `FileSystemService.ts` et ses tests.
- **Documentation** : Consolidation de tous les guides dans ce fichier unique.
- **Scripts** : `install-sauvegarde.bat` pour l'installation automatique.

### 🎯 Avant / Après
- **AVANT** : Sauvegarde dans Downloads, difficile à retrouver, pas de gestion d'historique.
- **APRÈS** : Sauvegarde dans **Documents/KBV/**, facile à retrouver, partage intégré, historique complet.

---

## ⚡ Démarrage Rapide
*Référence : DEMARRAGE_RAPIDE.md*

### Installation Express (5 minutes)
1. **Lancer le script** : `install-sauvegarde.bat`
2. **Ouvrir Android Studio** : `npx cap open android`
3. **Dans Android Studio** :
   - Build > Clean Project
   - Build > Rebuild Project
   - Connecter la tablette et cliquer sur **Run** (▶️)

### Utilisation Quotidienne
- **Créer** : Paramètres → Export & Import → Sauvegardes → Créer.
- **Localiser** : Le dossier **Documents/KBV/** sur la tablette.
- **Partager** : Onglet Historique → Icône 📤.

---

## 📱 Guide de Sauvegarde Complet
*Référence : GUIDE_SAUVEGARDE_SAMSUNG.md*

### Emplacement des Sauvegardes
`/storage/emulated/0/Documents/KBV/`
Accessible via l'application **Mes Fichiers** (Samsung).

### Utilisation de l'Interface
- **Onglet Créer** : Configuration des options (visites, paramètres, templates, chiffrement).
- **Onglet Historique** : Liste des fichiers, partage et suppression.
- **Onglet Restaurer** : Parcourir et sélectionner un fichier dans `Documents/KBV`.

### 🔧 Dépannage
- **Dossier absent** : Créez une première sauvegarde pour le générer.
- **Permission refusée** : Accédez aux Paramètres Android → Applications → KBV Lyon → Autorisations → Stockage → Autoriser.

---

## 💻 Guide de Déploiement Android Studio
*Référence : DEPLOIEMENT_ANDROID_STUDIO.md*

### Configuration de la Tablette
1. **Mode Développeur** : Tapez 7 fois sur "Numéro de build" dans À propos.
2. **Débogage USB** : Activez "Débogage USB" et "Installer via USB" dans les Options de développement.

### Étapes dans Android Studio
- **Synchroniser Gradle** : File > Sync Project with Gradle Files.
- **Clean & Rebuild** : Build > Clean Project, puis Build > Rebuild Project.
- **Déploiement** : Sélectionnez l'appareil "Samsung SM-X926B" et cliquez sur ▶️.

### Logs et Débogage
- Utilisez `adb logcat | grep KBV` pour voir les logs spécifiques.
- Utilisez `chrome://inspect` pour déboguer le JavaScript.

---

## 🛠️ Documentation Technique
*Référence : README_SAUVEGARDE.md*

### FileSystemService
Le service gère la détection de plateforme (Web vs Native) et utilise l'API **Capacitor Filesystem**.
- `saveToDocuments()` : Sauvegarde avec création de dossier.
- `listKBVFiles()` : Récupère la liste des fichiers `.json`.
- `shareFile()` : Utilise l'API Capacitor Share.

### Permissions Android
Le fichier `AndroidManifest.xml` a été mis à jour avec :
- `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE` (maxSdkVersion 32)
- `READ_MEDIA_IMAGES/VIDEO/AUDIO` (pour Android 13+)

---

## 📑 Index des Fichiers
*Référence : INDEX_FICHIERS.md*

### Fichiers Principaux
- `src/utils/FileSystemService.ts` : Service de gestion des fichiers.
- `src/tests/FileSystemService.test.ts` : Tests unitaires (100% couverture).
- `install-sauvegarde.bat` : Script d'installation automatique.

### Modifications dans le Projet
- `src/components/settings/BackupManagerModal.tsx` : UI mise à jour.
- `src/pages/Settings.tsx` : Intégration du nouveau service de sauvegarde.
- `android/app/src/main/AndroidManifest.xml` : Mise à jour des permissions.
- `package.json` : Ajout de `@capacitor/filesystem`.

---

**Version** : 1.20.1  
**Date** : Janvier 2025  
**Développé pour l'Église Baptiste de Lyon**
