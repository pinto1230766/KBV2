# Build et installation KBV2 pour Samsung
param([switch]$Install)

$ErrorActionPreference = "Stop"
Write-Host "🚀 Build KBV2 Android" -ForegroundColor Cyan

# npm install
Write-Host "📦 npm install..." -ForegroundColor Yellow
npm install

# Build web
Write-Host "🔨 Build web..." -ForegroundColor Yellow
npm run build

# Sync Capacitor
Write-Host "🔄 Sync Capacitor..." -ForegroundColor Yellow
npx cap sync android

# Build APK
Write-Host "📱 Build APK..." -ForegroundColor Yellow
cd android
.\gradlew.bat assembleDebug
cd ..

$ApkPath = "android\app\build\outputs\apk\debug\app-debug.apk"

if ($Install -and (Test-Path $ApkPath)) {
    Write-Host "📲 Installation..." -ForegroundColor Yellow
    adb install -r "$ApkPath"
    adb shell am start -n "com.kbv2.app/.MainActivity"
    Write-Host "✅ Installe et lance!" -ForegroundColor Green
} else {
    Write-Host "✅ APK: $ApkPath" -ForegroundColor Green
}
