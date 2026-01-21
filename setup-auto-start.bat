@echo off
echo Configuration du démarrage automatique de KBV2...
echo.

echo Vérification du dossier de démarrage...
if not exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup" (
    echo Erreur: Dossier de démarrage non trouvé
    pause
    exit /b 1
)

echo Copie du script de démarrage automatique...
copy "C:\Users\FP123\KBV2\start-kbv2.ps1" "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\"

echo.
echo ✅ KBV2 démarrera automatiquement au prochain démarrage du PC!
echo.
echo Pour tester immédiatement, exécutez: start-kbv2.bat
echo.
echo Pour désactiver: Supprimez start-kbv2.ps1 du dossier de démarrage
echo.
pause
