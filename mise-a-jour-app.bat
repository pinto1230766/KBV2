@echo off
echo 🏗️  Construction de l'application web...
call npm run build

echo.
echo 🔄 Synchronisation des fichiers avec le projet Android...
call npx cap sync android

echo.
echo 📱 Installation de l'application sur votre appareil...
call build-et-installe-telephone.bat
