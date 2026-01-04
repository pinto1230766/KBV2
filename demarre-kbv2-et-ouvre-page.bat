@echo off
echo 🚀 KBV2 - Démarrage Rapide et Ouverture Page
echo.

REM Arrêter les anciens processus Node.js pour éviter les conflits
echo 🛑 Arrêt des anciens serveurs...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Démarrer le serveur KBV2 en arrière-plan
echo 📡 Démarrage du serveur KBV2...
cd /d "C:\Users\FP123\KBV2"
start /min "KBV2 Server" cmd /c "start-kbv2.bat"

REM Attendre un peu que le serveur démarre
echo ⏳ Attente du démarrage (10 secondes)...
timeout /t 10 /nobreak >nul

REM Ouvrir automatiquement la page web
echo 🌐 Ouverture de KBV2 dans le navigateur...
start "" "http://localhost:5174"

REM Ouvrir aussi la page des paramètres directement
echo ⚙️ Ouverture de la page des paramètres...
timeout /t 2 /nobreak >nul
start "" "http://localhost:5174#/settings"

echo.
echo ✅ KBV2 est maintenant ouvert dans votre navigateur !
echo.
echo 📋 PROCHAINES ÉTAPES :
echo 1. La page de Paramètres est ouverte
echo 2. Cliquez sur "Sauvegarde" 
echo 3. Créez une nouvelle sauvegarde
echo 4. Utilisez le bouton "WhatsApp" pour partager
echo.
echo 🎯 Votre synchronisation est prête !
pause
