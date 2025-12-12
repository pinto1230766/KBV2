// Script pour détecter et supprimer les doublons dans le backup
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Recherche de doublons dans le backup...');

// Charger le backup actuel
let backupData;
try {
  const backupPath = path.join(__dirname, 'public', 'kbv-backup-2025-12-08.json');
  const backupContent = fs.readFileSync(backupPath, 'utf8');
  backupData = JSON.parse(backupContent);
  console.log('✅ Backup chargé');
} catch (error) {
  console.error('❌ Erreur chargement backup:', error);
  process.exit(1);
}

// Fonction pour détecter les doublons dans les visites
function findDuplicateVisits(visits) {
  const visitMap = new Map();
  const duplicates = [];

  visits.forEach((visit, index) => {
    const key = `${visit.visitDate}-${visit.nom}`;
    if (visitMap.has(key)) {
      duplicates.push({
        original: visitMap.get(key),
        duplicate: { ...visit, index }
      });
    } else {
      visitMap.set(key, { ...visit, index });
    }
  });

  return duplicates;
}

// Vérifier les doublons dans les visites
console.log('🔍 Recherche de doublons dans les visites...');
const visitDuplicates = findDuplicateVisits(backupData.visits);
console.log(`📊 ${visitDuplicates.length} doublons trouvés dans les visites`);

if (visitDuplicates.length > 0) {
  console.log('📋 Détails des doublons:');
  visitDuplicates.forEach((dup, i) => {
    console.log(`${i + 1}. ${dup.original.nom} - ${dup.original.visitDate}`);
    console.log(`   Original: ${dup.original.visitId}`);
    console.log(`   Doublon:  ${dup.duplicate.visitId} (index ${dup.duplicate.index})`);
  });
}

// Fonction pour détecter les doublons dans les orateurs
function findDuplicateSpeakers(speakers) {
  const speakerMap = new Map();
  const duplicates = [];

  speakers.forEach((speaker, index) => {
    const key = speaker.nom.toLowerCase().trim();
    if (speakerMap.has(key)) {
      duplicates.push({
        original: speakerMap.get(key),
        duplicate: { ...speaker, index }
      });
    } else {
      speakerMap.set(key, { ...speaker, index });
    }
  });

  return duplicates;
}

// Vérifier les doublons dans les orateurs
console.log('🔍 Recherche de doublons dans les orateurs...');
const speakerDuplicates = findDuplicateSpeakers(backupData.speakers);
console.log(`📊 ${speakerDuplicates.length} doublons trouvés dans les orateurs`);

if (speakerDuplicates.length > 0) {
  console.log('📋 Détails des doublons orateurs:');
  speakerDuplicates.forEach((dup, i) => {
    console.log(`${i + 1}. ${dup.original.nom}`);
    console.log(`   Original: ${dup.original.id}`);
    console.log(`   Doublon:  ${dup.duplicate.id} (index ${dup.duplicate.index})`);
  });
}

// Supprimer les doublons si demandé
if (visitDuplicates.length > 0 || speakerDuplicates.length > 0) {
  console.log('\n🧹 Suppression des doublons...');

  // Supprimer les doublons de visites (garder le premier trouvé)
  const uniqueVisits = [];
  const visitKeys = new Set();

  backupData.visits.forEach(visit => {
    const key = `${visit.visitDate}-${visit.nom}`;
    if (!visitKeys.has(key)) {
      uniqueVisits.push(visit);
      visitKeys.add(key);
    } else {
      console.log(`🗑️ Supprimé doublon visite: ${visit.nom} - ${visit.visitDate}`);
    }
  });

  // Supprimer les doublons d'orateurs (garder le premier trouvé)
  const uniqueSpeakers = [];
  const speakerKeys = new Set();

  backupData.speakers.forEach(speaker => {
    const key = speaker.nom.toLowerCase().trim();
    if (!speakerKeys.has(key)) {
      uniqueSpeakers.push(speaker);
      speakerKeys.add(key);
    } else {
      console.log(`🗑️ Supprimé doublon orateur: ${speaker.nom}`);
    }
  });

  // Mettre à jour le backup
  backupData.visits = uniqueVisits;
  backupData.speakers = uniqueSpeakers;

  console.log('💾 Sauvegarde du backup nettoyé...');
  const backupPath = path.join(__dirname, 'public', 'kbv-backup-2025-12-08.json');
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8');

  console.log('✅ Backup nettoyé sauvegardé !');
  console.log(`📊 Nouveau total:`);
  console.log(`- Orateurs: ${uniqueSpeakers.length}`);
  console.log(`- Visites: ${uniqueVisits.length}`);
} else {
  console.log('✅ Aucun doublon trouvé !');
}
