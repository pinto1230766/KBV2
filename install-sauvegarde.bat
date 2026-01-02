@echo off
echo ========================================
echo Installation Sauvegarde Samsung Tab S10
echo ========================================
echo.

echo [1/4] Installation du package Capacitor Filesystem...
call npm install @capacitor/filesystem
if %errorlevel% neq 0 (
    echo ERREUR: Installation du package echouee
    pause
    exit /b 1
)
echo OK - Package installe
echo.

echo [2/4] Synchronisation avec Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERREUR: Synchronisation echouee
    pause
    exit /b 1
)
echo OK - Synchronisation terminee
echo.

echo [3/4] Build de l'application...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Build echoue
    pause
    exit /b 1
)
echo OK - Build termine
echo.

echo [4/4] Copie vers Android...
call npx cap copy android
if %errorlevel% neq 0 (
    echo ERREUR: Copie echouee
    pause
    exit /b 1
)
echo OK - Copie terminee
echo.

echo ========================================
echo Installation terminee avec succes!
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Ouvrir Android Studio: npx cap open android
echo 2. Build ^> Clean Project
echo 3. Build ^> Rebuild Project
echo 4. Deployer sur Samsung Tab S10 Ultra
echo.
echo Les sauvegardes seront dans: Documents/KBV/
echo.

pause
