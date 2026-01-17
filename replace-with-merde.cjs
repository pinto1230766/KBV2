const fs = require('fs');

// Lire votre sauvegarde la plus récente
const merdeData = JSON.parse(fs.readFileSync('merde.json', 'utf8'));

// Lire les données actuelles du projet
const currentData = JSON.parse(fs.readFileSync('src/data/completeData.ts', 'utf8'));

console.log('🔄 REMPLACEMENT COMPLET AVEC VOTRE SAUVEGARDE LA PLUS RÉCENTE');
console.log('📊 Source: merde.json (VOTRE sauvegarde la plus récente)');
console.log('📊 Destination: src/data/completeData.ts');
console.log(`📊 Statistiques sauvegarde:`);
console.log(`   - Orateurs: ${merdeData.speakers?.length || 0}`);
console.log(`   - Hôtes: ${merdeData.hosts?.length || 0}`);
console.log(`   - Visites: ${merdeData.visits?.length || 0}`);

// Remplacer TOUTES les données avec votre sauvegarde la plus récente
const content = `// Données complètes intégrées directement dans le code
// Remplacement du fichier JSON externe pour éviter les problèmes de chargement
// MISE À JOUR: ${new Date().toISOString()}
// SOURCE: merde.json (VOTRE SAUVEGARDE LA PLUS RÉCENTE)
import { Speaker, Host, Visit, AppData } from '@/types';

export const completeSpeakers: Speaker[] = ${JSON.stringify(merdeData.speakers || [], null, 2)};

export const completeHosts: Host[] = ${JSON.stringify(merdeData.hosts || [], null, 2)};

export const completeVisits: Visit[] = ${JSON.stringify(merdeData.visits || [], null, 2)};

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

console.log('✅ TOUTES les données remplacées avec votre sauvegarde la plus récente !');
console.log('📊 Statistiques finales:');
console.log(`   - Orateurs: ${merdeData.speakers?.length || 0}`);
console.log(`   - Hôtes: ${merdeData.hosts?.length || 0}`);
console.log(`   - Visites: ${merdeData.visits?.length || 0}`);

// Vérifier David MOREIRA et Marcelino
const davidInMerde = merdeData.visits.find(v => v.nom === 'David MOREIRA');
const marcelinoInMerde = merdeData.visits.find(v => v.nom === 'Marcelino DOS SANTOS');

console.log('\n🔍 VÉRIFICATION SPÉCIFIQUE:');
if (davidInMerde) {
  console.log(`✅ David MOREIRA trouvé: ${davidInMerde.visitDate} - Discours n°${davidInMerde.talkNoOrType}`);
} else {
  console.log('❌ David MOREIRA non trouvé');
}

if (marcelinoInMerde) {
  console.log(`✅ Marcelino DOS SANTOS trouvé: ${marcelinoInMerde.visitDate} - Discours n°${marcelinoInMerde.talkNoOrType}`);
} else {
  console.log('❌ Marcelino DOS SANTOS non trouvé');
}

console.log('🎯 Toutes les données de votre sauvegarde la plus récente sont maintenant intégrées !');
