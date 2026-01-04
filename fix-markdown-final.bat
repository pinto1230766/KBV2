@echo off
echo 🔧 Correction finale des problèmes Markdown...
echo.

echo Ajout des espaces manquants autour des titres...
powershell -Command "(Get-Content 'GUIDE-COMPLET.md') -replace '###\n([^\n])', '###\n\n$1' | Set-Content 'GUIDE-COMPLET.md'"
powershell -Command "(Get-Content 'GUIDE-COMPLET.md') -replace '- \*\*([^\*]+)\*\*:', '- **$1**:\n' | Set-Content 'GUIDE-COMPLET.md'"

echo Vérification finale...
npm run lint:fix

echo.
echo ✅ Corrections Markdown terminées !
pause
