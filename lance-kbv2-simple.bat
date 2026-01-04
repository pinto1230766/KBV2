@echo off
echo 🚀 Lancement Simple KBV2
echo.

REM Arrêter tous les processus Node.js pour éviter les conflits
echo 🛑 Arrêt de tous les serveurs Node.js...
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

REM Aller dans le bon répertoire
echo 📁 Changement vers le répertoire KBV2...
cd /d "C:\Users\FP123\KBV2"

REM Démarrer l'application KBV2
echo 📡 Démarrage de l'application KBV2...
echo.
echo ⏳ Attente du démarrage (20 secondes)...
echo.
start "" cmd /c "npm run dev"

REM Attendre 20 secondes pour que l'application démarre
timeout /t 20 /nobreak >nul

REM Ouvrir la page web
echo 🌐 Ouverture de KBV2 dans le navigateur...
start "" "http://localhost:5174"

echo.
echo ✅ KBV2 devrait maintenant être ouvert !
echo.
echo 📋 Si la page est vide, attendez encore 10 secondes puis rechargez la page.
echo.
timeout /t 5 /nobreak >nul
