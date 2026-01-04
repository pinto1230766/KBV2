@echo off
echo 🚀 KBV2 - Démarrage et Sauvegarde Automatique
echo.

REM Démarrer le serveur KBV2
echo 📡 Démarrage du serveur KBV2...
cd /d "C:\Users\FP123\KBV2"
start "" "C:\Users\FP123\KBV2\start-kbv2.bat"

REM Attendre que le serveur démarre
echo ⏳ Attente du démarrage du serveur (15 secondes)...
timeout /t 15 /nobreak >nul

REM Ouvrir automatiquement la page web
echo 🌐 Ouverture de l'application KBV2...
start "" "http://localhost:5174"

REM Ouvrir aussi la page des paramètres pour la sauvegarde
echo 📱 Ouverture de la page de sauvegarde...
timeout /t 3 /nobreak >nul
start "" "http://localhost:5174#/settings"

echo.
echo ✅ Application KBV2 ouverte !
echo.
echo 📋 ACTIONS DISPONIBLES :
echo • L'application est maintenant ouverte dans votre navigateur
echo • Allez dans Paramètres pour créer une sauvegarde WhatsApp
echo • Utilisez le bouton "WhatsApp" pour partager vos données
echo.
echo 🎯 Votre synchronisation est prête !
echo.
pause
