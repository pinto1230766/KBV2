@echo off
echo 🚀 KBV2 - Lancement avec le Bon Port
echo.

REM Arrêter tous les processus Node.js
echo 🛑 Arrêt de tous les serveurs Node.js...
taskkill /f /im node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

REM Aller dans le répertoire KBV2
cd /d "C:\Users\FP123\KBV2"

REM Démarrer avec le port correct (5173)
echo 📡 Démarrage KBV2 sur le port 5173...
echo.
echo ⏳ Attente du démarrage (25 secondes)...
echo.
start "" cmd /c "npx vite --port 5173"

REM Attendre 25 secondes pour que l'application démarre
timeout /t 25 /nobreak >nul

REM Ouvrir la page web avec le bon port
echo 🌐 Ouverture KBV2 sur le port 5173...
start "" "http://localhost:5173"

echo.
echo ✅ KBV2 devrait maintenant être ouvert sur le port 5173 !
echo.
echo 📋 URL CORRECTE : http://localhost:5173
echo.
echo 🔧 Si ça ne fonctionne pas, utilisez http://localhost:5173 dans votre navigateur.
echo.
timeout /t 5 /nobreak >nul
