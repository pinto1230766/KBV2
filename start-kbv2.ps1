# Script PowerShell pour démarrage automatiquement KBV2
# Placez ce fichier dans C:\Users\YOUR_USERNAME\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup

# Attendre 30 secondes après le démarrage du PC
Start-Sleep -Seconds 30

# Démarrer l'application KBV2 en mode minimisé
$workingDir = "C:\Users\FP123\KBV2"
$batchFile = "C:\Users\FP123\KBV2\start-kbv2.bat"

Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "`"$batchFile`"" -WorkingDirectory $workingDir -WindowStyle Minimized
