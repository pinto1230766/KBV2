#!/usr/bin/env node

/**
 * Script de Synchronisation des Versions - KBV2
 * Synchronise automatiquement les versions entre package.json et android/app/build.gradle
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Début de la synchronisation des versions...\n');

// Chemins des fichiers
const packagePath = path.join(__dirname, 'package.json');
const buildGradlePath = path.join(__dirname, 'android', 'app', 'build.gradle');

try {
    // Lire package.json
    console.log('📖 Lecture du package.json...');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const webVersion = packageJson.version;
    console.log(`✅ Version web actuelle: ${webVersion}`);

    // Générer la version Android
    const [major, minor, patch] = webVersion.split('.');
    const androidVersion = `${major}.${minor}`;
    const versionCode = parseInt(`${major}${minor.padStart(2, '0')}${patch.padStart(2, '0')}`);

    console.log(`🎯 Version Android calculée: ${androidVersion} (versionCode: ${versionCode})`);

    // Lire et modifier build.gradle
    console.log('📝 Mise à jour du build.gradle...');
    let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

    // Mettre à jour versionCode
    const newVersionCode = `versionCode ${versionCode}`;
    buildGradle = buildGradle.replace(/versionCode \d+/, newVersionCode);

    // Mettre à jour versionName
    const newVersionName = `versionName "${androidVersion}"`;
    buildGradle = buildGradle.replace(/versionName "[^"]*"/, newVersionName);

    // Écrire le fichier modifié
    fs.writeFileSync(buildGradlePath, buildGradle);

    console.log('\n✅ Synchronisation terminée avec succès !');
    console.log('📊 Résumé des versions:');
    console.log(`   🌐 Web: ${webVersion}`);
    console.log(`   📱 Android: ${androidVersion} (versionCode: ${versionCode})`);
    console.log('\n🚀 Prochaines étapes recommandées:');
    console.log('   1. npm run build');
    console.log('   2. npx cap sync android');
    console.log('   3. cd android && ./gradlew assembleRelease');

} catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error.message);
    process.exit(1);
}
