@echo off
REM Script de Build Android Automatique - KBV2 (Windows)
REM Construit l'application Android

echo 🚀 Début du processus de build Android automatisé...

REM Étape 1: Installer les dépendances
echo 📦 Étape 1: Installation des dépendances...
npm install

REM Étape 2: Build de l'application web
echo 🌐 Étape 2: Build de l'application web...
npm run build

REM Étape 3: Synchroniser avec Android
echo 📱 Étape 3: Synchronisation Android...
npx cap sync android

REM Étape 4: Build Android
echo 🤖 Étape 4: Build Android...
cd android
gradlew.bat assembleRelease

echo.
echo ✅ Build terminé avec succès !
echo 📍 APK disponible dans: android\app\build\outputs\apk\release\
echo.
echo 📱 Pour installer sur votre tablette:
echo adb install -r android\app\build\outputs\apk\release\app-release.apk

pause
