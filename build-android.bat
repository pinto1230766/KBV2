@echo off
REM Script de Build Android Automatique - KBV2 (Windows)
REM Synchronise les versions et construit l'application Android

echo 🚀 Début du processus de build Android automatisé...

REM Étape 1: Synchroniser les versions
echo 📋 Étape 1: Synchronisation des versions...
node sync-versions.js

REM Étape 2: Installer les dépendances
echo 📦 Étape 2: Installation des dépendances...
npm install

REM Étape 3: Build de l'application web
echo 🌐 Étape 3: Build de l'application web...
npm run build

REM Étape 4: Synchroniser avec Android
echo 📱 Étape 4: Synchronisation Android...
npx cap sync android

REM Étape 5: Build Android
echo 🤖 Étape 5: Build Android...
cd android
gradlew.bat assembleRelease

echo.
echo ✅ Build terminé avec succès !
echo 📍 APK disponible dans: android\app\build\outputs\apk\release\
echo.
echo 📱 Pour installer sur votre tablette:
echo adb install -r android\app\build\outputs\apk\release\app-release.apk

pause
