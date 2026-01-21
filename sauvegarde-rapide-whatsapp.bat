@echo off
echo 🔄 Sauvegarde Rapide KBV2 vers WhatsApp
echo.
echo 📱 Création d'une sauvegarde automatique...
echo.

cd /d "C:\Users\FP123\KBV2"

REM Démarrer l'application si elle n'est pas déjà démarrée
echo Vérification du serveur...
if not exist "temp-server-check.txt" (
    echo Démarrage du serveur...
    start "" "C:\Users\FP123\KBV2\start-kbv2.bat"
    timeout /t 10 >nul
)

REM Ouvrir automatiquement la page de sauvegarde
echo Ouverture de l'interface de sauvegarde...
start http://localhost:5174

echo.
echo ✅ Serveur ouvert sur http://localhost:5174
echo.
echo 📋 PROCHAINES ÉTAPES :
echo 1. Dans l'onglet ouvert, allez dans Paramètres
echo 2. Cliquez sur "Sauvegarde" 
echo 3. Créez une sauvegarde
echo 4. Utilisez le bouton "WhatsApp" pour partager
echo.
echo 🎯 Votre sauvegarde sera automatiquement synchronisée !
echo.
pause
