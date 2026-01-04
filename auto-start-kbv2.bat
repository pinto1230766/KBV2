@echo off
echo Démarrage automatique de KBV2 au démarrage du PC...
timeout /t 30 /nobreak >nul
cd /d "C:\Users\FP123\KBV2"
start /min "KBV2 Web App" cmd /c "C:\Users\FP123\KBV2\start-kbv2.bat"
