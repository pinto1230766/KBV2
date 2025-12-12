// Script pour fusionner les données du fichier gestion_visiteurs avec le backup actuel
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les deux fichiers
const backupPath = path.join(__dirname, 'public', 'kbv-backup-2025-12-08.json');
const fullDataPath = path.join(__dirname, '..', 'gestion_visiteurs_tj_backup_2025-12-12 (1).json');

console.log('🔄 Chargement des fichiers...');

// Charger le backup actuel
let currentBackup;
try {
  const backupContent = fs.readFileSync(backupPath, 'utf8');
  currentBackup = JSON.parse(backupContent);
  console.log('✅ Backup actuel chargé');
} catch (error) {
  console.error('❌ Erreur chargement backup:', error);
  process.exit(1);
}

// Charger les données complètes
let fullData;
try {
  const fullContent = fs.readFileSync(fullDataPath, 'utf8');
  fullData = JSON.parse(fullContent);
  console.log('✅ Données complètes chargées');
} catch (error) {
  console.error('❌ Erreur chargement données complètes:', error);
  process.exit(1);
}

// Fusionner les données
console.log('🔄 Fusion des données...');

// 1. Fusionner les orateurs (garder ceux du backup actuel, ajouter ceux manquants)
const mergedSpeakers = [...currentBackup.speakers];
const speakerMap = new Map(mergedSpeakers.map(s => [s.id, s]));

fullData.speakers.forEach(speaker => {
  if (!speakerMap.has(speaker.id)) {
    mergedSpeakers.push(speaker);
    console.log(`👤 Orateur ajouté: ${speaker.nom}`);
  } else {
    // Mettre à jour si nécessaire (téléphone, etc.)
    const existing = speakerMap.get(speaker.id);
    if (!existing.telephone && speaker.telephone) {
      existing.telephone = speaker.telephone;
      console.log(`📱 Téléphone ajouté pour: ${speaker.nom}`);
    }
  }
});

// 2. Fusionner les visites (ajouter celles manquantes)
const mergedVisits = [...currentBackup.visits];
const visitMap = new Map(mergedVisits.map(v => [v.visitId, v]));

let addedVisits = 0;
fullData.visits.forEach(visit => {
  if (!visitMap.has(visit.visitId)) {
    mergedVisits.push(visit);
    addedVisits++;
    console.log(`➕ Visite ajoutée: ${visit.nom} (${visit.visitDate})`);
  }
});

// 3. Fusionner les visites archivées
const mergedArchived = [...currentBackup.archivedVisits];
const archivedMap = new Map(mergedArchived.map(v => [v.visitId, v]));

let addedArchived = 0;
fullData.archivedVisits.forEach(visit => {
  if (!archivedMap.has(visit.visitId)) {
    mergedArchived.push(visit);
    addedArchived++;
    console.log(`📦 Visite archivée ajoutée: ${visit.nom} (${visit.visitDate})`);
  }
});

// 4. Fusionner les hôtes
const mergedHosts = [...currentBackup.hosts];
const hostMap = new Map(mergedHosts.map(h => [h.nom, h]));

fullData.hosts.forEach(host => {
  if (!hostMap.has(host.nom)) {
    mergedHosts.push(host);
    console.log(`🏠 Hôte ajouté: ${host.nom}`);
  }
});

// 5. Fusionner les dates spéciales
const mergedSpecialDates = [...currentBackup.specialDates];
const specialMap = new Map(mergedSpecialDates.map(d => [d.id, d]));

fullData.specialDates.forEach(date => {
  if (!specialMap.has(date.id)) {
    mergedSpecialDates.push(date);
    console.log(`📅 Date spéciale ajoutée: ${date.name} (${date.date})`);
  }
});

// Créer le backup fusionné
const mergedBackup = {
  ...currentBackup,
  speakers: mergedSpeakers,
  visits: mergedVisits,
  archivedVisits: mergedArchived,
  hosts: mergedHosts,
  specialDates: mergedSpecialDates,
  dataVersion: '1.1.0'
};

// Sauvegarder
console.log('💾 Sauvegarde du backup fusionné...');
fs.writeFileSync(backupPath, JSON.stringify(mergedBackup, null, 2), 'utf8');

console.log('✅ Fusion terminée !');
console.log(`📊 Résumé:`);
console.log(`- Orateurs: ${mergedSpeakers.length}`);
console.log(`- Visites: ${mergedVisits.length}`);
console.log(`- Visites archivées: ${mergedArchived.length}`);
console.log(`- Hôtes: ${mergedHosts.length}`);
console.log(`- Dates spéciales: ${mergedSpecialDates.length}`);

// Compter par année
const visitsByYear = {};
mergedVisits.forEach(visit => {
  const year = visit.visitDate.substring(0, 4);
  visitsByYear[year] = (visitsByYear[year] || 0) + 1;
});

console.log('📅 Visites par année:', visitsByYear);
console.log('🎉 Backup fusionné sauvegardé avec succès !');
