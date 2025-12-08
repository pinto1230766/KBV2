@echo off
REM Script de Build et Test Automatique - KBV Lyon
REM Pour Samsung Tab S10 Ultra

echo ========================================
echo KBV Lyon - Build et Test Automatique
echo Samsung Tab S10 Ultra
echo ========================================
echo.

REM Vérifier Node.js
echo [1/6] Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe
    echo Telechargez-le sur https://nodejs.org
    pause
    exit /b 1
)
echo OK - Node.js detecte
echo.

REM Vérifier npm
echo [2/6] Verification de npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: npm n'est pas installe
    pause
    exit /b 1
)
echo OK - npm detecte
echo.

REM Installer les dépendances
echo [3/6] Installation des dependances...
echo Cela peut prendre quelques minutes...
call npm install
if errorlevel 1 (
    echo ERREUR: Installation des dependances echouee
    pause
    exit /b 1
)
echo OK - Dependances installees
echo.

REM Build du projet
echo [4/6] Build du projet...
call npm run build
if errorlevel 1 (
    echo ERREUR: Build echoue
    pause
    exit /b 1
)
echo OK - Build reussi
echo.

REM Synchronisation Capacitor
echo [5/6] Synchronisation avec Android...
call npx cap sync android
if errorlevel 1 (
    echo ERREUR: Synchronisation echouee
    pause
    exit /b 1
)
echo OK - Synchronisation reussie
echo.

REM Ouvrir Android Studio
echo [6/6] Ouverture d'Android Studio...
call npx cap open android
if errorlevel 1 (
    echo ERREUR: Impossible d'ouvrir Android Studio
    echo Verifiez qu'Android Studio est installe
    pause
    exit /b 1
)
echo OK - Android Studio ouvert
echo.

echo ========================================
echo Build termine avec succes !
echo ========================================
echo.
echo Prochaines etapes dans Android Studio :
echo 1. Connecter votre Samsung Tab S10 Ultra en USB
echo 2. Activer le mode developpeur sur la tablette
echo 3. Activer le debogage USB
echo 4. Cliquer sur le bouton Run (triangle vert)
echo 5. Selectionner votre tablette
echo.
echo Consultez GUIDE_TEST_COMPLET.md pour la checklist
echo.
pause
