@echo off
echo Démarrage de KBV2 Application Web...
cd /d "C:\Users\FP123\KBV2"
echo.
echo Vérification de Node.js...
node --version
if %errorlevel% neq 0 (
    echo Node.js n'est pas installé. Veuillez installer Node.js d'abord.
    pause
    exit /b 1
)
echo.
echo Installation des dépendances si nécessaire...
call npm install
echo.
echo Démarrage du serveur de développement...
echo L'application sera accessible à: http://localhost:5173
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.
call npm run dev
pause
