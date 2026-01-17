const fs = require('fs');

// Lire votre sauvegarde web
const backupData = JSON.parse(fs.readFileSync('kbv-backup-2026-01-17.json', 'utf8'));

// Lire les données actuelles
const currentData = JSON.parse(fs.readFileSync('src/data/completeData.ts', 'utf8'));

console.log('🔄 REMPLACEMENT COMPLET DES DONNÉES');
console.log('📊 Source: kbv-backup-2026-01-17.json');
console.log(`📊 Orateurs dans sauvegarde: ${backupData.speakers?.length || 0}`);
console.log(`📊 Hôtes dans sauvegarde: ${backupData.hosts?.length || 0}`);
console.log(`📊 Visites dans sauvegarde: ${backupData.visits?.length || 0}`);

// Remplacer TOUTES les données avec votre sauvegarde
const content = `// Données complètes intégrées directement dans le code
// Remplacement du fichier JSON externe pour éviter les problèmes de chargement
// MISE À JOUR: ${new Date().toISOString()}
// SOURCE: kbv-backup-2026-01-17.json (VOTRE SAUVEGARDE)
import { Speaker, Host, Visit, AppData } from '@/types';

export const completeSpeakers: Speaker[] = ${JSON.stringify(backupData.speakers || [], null, 2)};

export const completeHosts: Host[] = ${JSON.stringify(backupData.hosts || [], null, 2)};

export const completeVisits: Visit[] = ${JSON.stringify(backupData.visits || [], null, 2)};

export const completeData: AppData = {
  speakers: completeSpeakers,
  hosts: completeHosts,
  visits: completeVisits,
  dataVersion: '1.3.0',
  lastSyncedAt: new Date().toISOString()
};
`;

// Écrire le nouveau fichier completeData.ts
fs.writeFileSync('src/data/completeData.ts', content, 'utf8');

console.log('✅ Données remplacées avec votre sauvegarde web');
console.log(`📊 Statistiques finales:`);
console.log(`   - Orateurs: ${backupData.speakers?.length || 0}`);
console.log(`   - Hôtes: ${backupData.hosts?.length || 0}`);
console.log(`   - Visites: ${backupData.visits?.length || 0}`);
console.log('📊 David MOREIRA: ${backupData.visits.find(v => v.nom === 'David MOREIRA')?.visitDate || 'Non défini'}');
console.log(`📊 Marcelino DOS SANTOS: ${backupData.visits.find(v => v.nom === 'Marcelino DOS SANTOS')?.visitDate || 'Non défini'}`);
console.log('=====================================');

// Vérifier que David MOREIRA a bien les bonnes données
const davidBackup = backupData.visits.find(v => v.nom === 'David MOREIRA');
const marcelinoBackup = backupData.visits.find(v => v.nom === 'Marcelino DOS SANTOS');

if (davidBackup) {
  console.log('✅ David MOREIRA trouvé avec les données de la sauvegarde');
  console.log(`   - Date: ${davidBackup.visitDate}`);
  console.log(`   - Discours: n°${davidBackup.talkNoOrType}`);
  console.log(`   - Thème: ${davidBackup.talkTheme}`);
} else {
  console.log('❌ David MOREIRA non trouvé');
}

if (marcelinoBackup) {
  console.log('✅ Marcelino DOS SANTOS trouvé avec les données de la sauvegarde');
  console.log(`   - Date: ${marcelinoBackup.visitDate}`);
  console.log(`   - Discours: n°${marcelinoBackup.talkNoOrType}`);
  console.log(`   - Thème: ${marcelinoBackup.talkTheme}`);
} else {
  console.log('❌ Marcelino DOS SANTOS non trouvé');
}

console.log('🎯 Toutes les données de votre sauvegarde sont maintenant intégrées !');
