@echo off
REM Script de Build Android Automatique - KBV2 (Windows)
REM Construit l'application Android pour déploiement sur tablette

echo 🚀 Début du processus de build Android pour tablette...
echo.

REM Étape 1: Vérifier les prérequis
echo 📋 Étape 1: Vérification des prérequis...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé ou n'est pas dans le PATH
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installé ou n'est pas dans le PATH
    pause
    exit /b 1
)

echo ✅ Node.js et npm détectés
echo.

REM Étape 2: Installer les dépendances
echo 📦 Étape 2: Installation des dépendances...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Échec de l'installation des dépendances
    pause
    exit /b 1
)
echo ✅ Dépendances installées
echo.

REM Étape 3: Build de l'application web
echo 🌐 Étape 3: Build de l'application web...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Échec du build web
    pause
    exit /b 1
)
echo ✅ Application web buildée
echo.

REM Étape 4: Synchroniser avec Android
echo 📱 Étape 4: Synchronisation Capacitor Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Échec de la synchronisation Android
    pause
    exit /b 1
)
echo ✅ Synchronisation Android terminée
echo.

REM Étape 5: Préparation pour Android Studio
echo 🤖 Étape 5: Préparation du projet Android Studio...
if not exist "android\app\build\outputs\apk" mkdir "android\app\build\outputs\apk"

echo.
echo ✅ Build terminé avec succès !
echo.
echo 📍 PROCHAINES ÉTAPES :
echo.
echo 1️⃣ Ouvrir Android Studio
echo 2️⃣ Sélectionner "Open" et naviguer vers le dossier "android" de ce projet
echo 3️⃣ Attendre que Gradle synchronise le projet
echo 4️⃣ Dans la barre d'outils, sélectionner "app" comme configuration
echo 5️⃣ Sélectionner votre tablette comme device cible
echo 6️⃣ Cliquer sur le bouton "Run" (triangle vert)
echo.
echo 📱 Informations supplémentaires :
echo • APK de développement : android\app\build\outputs\apk\debug\
echo • Pour build de production : utiliser "Build" → "Generate Signed APK"
echo • Pour installer manuellement : adb install -r android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 🎯 L'application sera installée automatiquement sur votre tablette !
echo.

pause
