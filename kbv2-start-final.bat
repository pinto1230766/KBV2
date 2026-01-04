@echo off
echo 🚀 KBV2 - Démarrage Final et Robuste
echo.

REM Nettoyer tous les anciens processus
echo 🧹 Nettoyage des anciens processus...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Démarrer le serveur proprement
echo 📡 Démarrage propre du serveur KBV2...
cd /d "C:\Users\FP123\KBV2"
start /min "KBV2 Server Clean" cmd /c "npm run dev"

REM Attendre que le serveur démarre
echo ⏳ Attente du démarrage du serveur (12 secondes)...
timeout /t 12 /nobreak >nul

REM Vérifier que le serveur répond
echo 🔍 Vérification du serveur...
curl -s --max-time 3 http://localhost:5174 >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Le serveur prend plus de temps à démarrer, attente supplémentaire...
    timeout /t 8 /nobreak >nul
)

REM Ouvrir la page web
echo 🌐 Ouverture de KBV2 dans le navigateur...
start "" "http://localhost:5174"

echo.
echo ✅ KBV2 démarré avec succès !
echo.
echo 📋 ACTIONS DISPONIBLES :
echo • L'application KBV2 est maintenant accessible
echo • Utilisez le menu pour naviguer dans l'application
echo • Paramètres → Sauvegarde pour WhatsApp
echo.
echo 🎯 Votre application est prête !
timeout /t 3 /nobreak >nul
