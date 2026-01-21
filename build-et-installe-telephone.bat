@echo off
echo 📱 Installation KBV2 sur votre téléphone
echo.

echo Vérification de la connexion...
"C:\Users\FP123\AppData\Local\Android\Sdk\platform-tools\adb.exe" devices

echo.
echo Construction de l'APK...
cd android
call ./gradlew assembleDebug
cd ..

echo.
echo Installation sur le téléphone...
"C:\Users\FP123\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r android/app/build/outputs/apk/debug/app-debug.apk

echo.
echo Démarrage de l'application...
"C:\Users\FP123\AppData\Local\Android\Sdk\platform-tools\adb.exe" shell am start -n com.kbv.lyon/.MainActivity

echo.
echo ✅ KBV2 installé et démarré sur votre téléphone !
echo.
echo 📋 Informations:
echo   - Package: com.kbv.lyon
echo   - APK: android/app/build/outputs/apk/debug/app-debug.apk
echo   - Taille: ~14 MB
echo   - Version: Debug build
echo.
echo 🎯 Pour utiliser:
echo   1. Ouvrez l'application sur votre téléphone
echo   2. Allez dans Paramètres > Importation
echo   3. Sélectionnez vos données sauvegardées
echo   4. Profitez de KBV2 sur mobile !
echo.
pause
