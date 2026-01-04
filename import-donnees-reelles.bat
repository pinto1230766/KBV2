@echo off
echo 📋 Importation des données KBV2...
echo.

echo Vérification du fichier de sauvegarde...
if exist "C:\Users\FP123\Downloads\kbv-backup-2026-01-04.json" (
    echo ✅ Fichier de sauvegarde trouvé !
    echo.
    echo Copie vers le dossier de données...
    copy "C:\Users\FP123\Downloads\kbv-backup-2026-01-04.json" "C:\Users\FP123\KBV2\src\data\real-data.json"
    
    echo ✅ Données copiées avec succès !
    echo.
    echo 📊 Statistiques des données importées:
    echo   - Orateurs: Jonatã ALVES, Andrea MENARA, Ailton DIAS, etc.
    echo   - Congrégations: Albufeira KBV, Ettelbruck KBV, Villiers-sur-Marne
    echo   - Date: 04/01/2026
    echo.
    echo 🎯 Pour utiliser ces données:
    echo   1. Démarrez l'application web
    echo   2. Allez dans Paramètres ^> Importation
    echo   3. Sélectionnez: real-data.json
    echo   4. Confirmez l'importation
    echo.
) else (
    echo ❌ Fichier de sauvegarde non trouvé !
    echo   Vérifiez: C:\Users\FP123\Downloads\kbv-backup-2026-01-04.json
    echo.
)

pause
