// Script pour synchroniser avec Google Sheets et mettre à jour le backup
// À exécuter dans le navigateur ou via Node.js

// Pour Node.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simuler les fonctions nécessaires
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getTalkTitle = (talkNo) => {
  const titles = {
    '1': 'Bu konxe Deus dretu?',
    '2': 'Bu ta skapa na témpu di fin?',
    '3': 'Bu sta ta anda ku organizason unidu di Jeová?',
    '4': 'Ki próvas ten ma Deus ta izisti?',
    '7': 'Imita mizerikordia di Jeová',
    '9': 'Obi i kunpri Palavra di Deus',
    '11': 'Sima Jizus, nu \'ka ta faze párti di mundu\'',
    '12': 'Deus kré pa bu ruspeta kes ki ren autoridadi',
    '15': 'Mostra bondadi pa tudu algen',
    '16': 'Kontinua ta bira bu amizadi ku Deus más fórti',
    '17': 'Da Deus glória ku tudu kel ki bu ten',
    '18': 'Faze Jeová bu fortaléza',
    '26': 'Abo é inportanti pa Deus?',
    '30': 'Modi ki familia pode pápia ku kunpanheru midjór',
    '31': 'Bu ten konsénsia ma bu ten nisisidadi spritual?',
    '32': 'Modi ki nu pode lida ku preokupasons di vida',
    '36': 'Vida é só kel-li?',
    '43': 'Kel ki Deus ta fla sénpri é midjór pa nos',
    '48': 'Modi ki nu pode toma disizons ki ta djuda-nu ten bons rezultadu na vida',
    '50': 'Modi ki nu pode toma disizons ki ta djuda-nu ten bons rezultadu na vida',
    '55': 'Modi ki bu pode faze un bon nómi ki ta agrada Deus?',
    '56': 'Na ki lider ki bu pode kunfia?',
    '64': 'Bu \'krê sô pasa sábi\' ô bu ta \'ama Deus\'?',
    '65': 'Modi ki nu pode luta pa pas na un mundu xeiu di ódiu',
    '70': 'Pamodi ki Deus merese nos kunfiansa?',
    '76': 'Prinsípius di Bíblia pode djuda-nu lida ku prublémas di oji?',
    '77': '\'Nhos mostra sénpri ma nhos sabe resebe algen dretu\'',
    '100': 'Modi ki nu pode faze bons amizadi',
    '102': 'Presta atenson na "profesia"',
    '103': 'Modi ki bu pode xinti alegria di verdadi?',
    '108': 'Bu pode kunfia ma nu ta ben ten un futuru sóbi!',
    '179': 'Nega iluzon di mundu, sforsa pa kes kuza di Reinu ki ta izisti di verdadi',
    '183': 'Tra odju di kuzas ki ka ten valor!',
    '185': 'Ken ki ta ben konpo téra?',
    '189': 'Anda ku Deus ta traze-nu bensons gosi i pa tudu témpu',
    '194': 'Modi ki sabedoria di Deus ta djuda-nu'
  };
  return titles[talkNo] || `Discours ${talkNo}`;
};

const parseDate = (dateString) => {
  // Gérer différents formats de date
  if (!dateString) return null;

  // Format DD/MM/YYYY
  const slashMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Format DD-MM-YYYY
  const dashMatch = dateString.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dashMatch) {
    const [, day, month, year] = dashMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Format YYYY-MM-DD
  const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  return null;
};

async function syncWithGoogleSheets() {
  console.log('🚀 Début de la synchronisation Google Sheets...');

  const googleSheetId = '1drIzPPi6AohCroSyUkF1UmMFxuEtMACBF4XATDjBOcg';
  const range = 'A:E';
  const sheetGidsToTry = ['490509024', '1817293373', '936069614', '1474640023'];

  let allRows = [];
  let cols = null;
  let successfulGids = [];

  for (const gid of sheetGidsToTry) {
    console.log(`📊 Tentative de récupération depuis l'onglet ${gid}...`);

    const url = `https://docs.google.com/spreadsheets/d/${googleSheetId}/gviz/tq?gid=${gid}&range=${encodeURIComponent(range)}&tqx=out:json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`❌ Impossible de récupérer l'onglet ${gid}`);
        continue;
      }

      const rawText = await response.text();
      const jsonMatch = rawText.match(/google\.visualization\.Query\.setResponse\((.*)\)/);
      if (!jsonMatch || !jsonMatch[1]) {
        console.warn(`❌ Réponse invalide depuis l'onglet ${gid}`);
        continue;
      }

      const parsedData = JSON.parse(jsonMatch[1]);
      if (parsedData.status === 'error') {
        console.warn(`❌ Erreur dans l'onglet ${gid}:`, parsedData.errors);
        continue;
      }

      if (parsedData.table && parsedData.table.rows) {
        allRows.push(...parsedData.table.rows);
        if (!cols) cols = parsedData.table.cols;
        successfulGids.push(gid);
        console.log(`✅ ${parsedData.table.rows.length} lignes récupérées depuis l'onglet ${gid}`);
      }
    } catch (error) {
      console.warn(`❌ Erreur lors de la récupération de l'onglet ${gid}:`, error);
    }
  }

  if (allRows.length === 0) {
    console.error('❌ Aucune donnée trouvée dans les onglets Google Sheets');
    return null;
  }

  console.log(`📈 Total récupéré: ${allRows.length} lignes depuis ${successfulGids.length} onglet(s)`);

  // Charger le backup existant
  let existingData;
  try {
    // En Node.js, utiliser fs pour lire le fichier
    if (typeof window === 'undefined') {
      const filePath = path.join(__dirname, 'public', 'kbv-backup-2025-12-08.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContent);
    } else {
      // Dans le navigateur, utiliser fetch
      const response = await fetch('./public/kbv-backup-2025-12-08.json');
      existingData = await response.json();
    }
    console.log('📁 Backup existant chargé');
  } catch (error) {
    console.error('❌ Erreur lors du chargement du backup existant:', error);
    return null;
  }

  // Traiter les données
  const rows = allRows;
  const headers = cols.map((h) => h.label.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, ''));
  const dateIndex = headers.findIndex((h) => h.includes('data'));
  const speakerIndex = headers.findIndex((h) => h.includes('orador'));
  const congIndex = headers.findIndex((h) => h.includes('kongregason'));
  const talkNoIndex = headers.findIndex((h) => h === 'n' || h === 'no');
  const themeIndex = headers.findIndex((h) => h.includes('tema'));

  console.log('📋 Colonnes détectées:', { dateIndex, speakerIndex, congIndex, talkNoIndex, themeIndex });

  if ([dateIndex, speakerIndex, congIndex].some(i => i === -1)) {
    console.error('❌ En-têtes requis manquants');
    return null;
  }

  let addedCount = 0, updatedCount = 0, skippedCount = 0;

  // Copier les données existantes
  const newSpeakers = [...existingData.speakers];
  const newVisits = [...existingData.visits];
  const speakerMap = new Map(newSpeakers.map(s => [s.nom.toLowerCase(), s]));

  for (const row of rows) {
    const cells = row.c;
    const dateValue = cells[dateIndex]?.v;
    let visitDateObj = null;

    if (typeof dateValue === 'string' && dateValue.startsWith('Date(')) {
      const dateParts = dateValue.substring(5, dateValue.length - 1).split(',');
      visitDateObj = new Date(Number(dateParts[0]), Number(dateParts[1]), Number(dateParts[2]));
    } else if (typeof dateValue === 'string') {
      visitDateObj = parseDate(dateValue);
    }

    const speakerName = cells[speakerIndex]?.v?.trim();
    const congregation = cells[congIndex]?.v?.trim() || '';

    if (!visitDateObj || !speakerName) {
      skippedCount++;
      continue;
    }

    const year = visitDateObj.getFullYear();
    const month = String(visitDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(visitDateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Créer ou trouver l'orateur
    let speaker = speakerMap.get(speakerName.toLowerCase());
    if (!speaker) {
      speaker = {
        id: generateUUID(),
        nom: speakerName,
        congregation: congregation || 'À définir',
        talkHistory: [],
        gender: 'male'
      };
      newSpeakers.push(speaker);
      speakerMap.set(speakerName.toLowerCase(), speaker);
      console.log(`👤 Nouvel orateur ajouté: ${speakerName}`);
    } else if (speaker.congregation !== congregation && congregation) {
      speaker.congregation = congregation;
    }

    // Chercher si la visite existe déjà
    const existingVisitIndex = newVisits.findIndex(v => v.visitDate === formattedDate && v.nom === speakerName);

    const talkNoValue = talkNoIndex > -1 ? (cells[talkNoIndex]?.v !== null ? String(cells[talkNoIndex]?.v) : null) : null;
    const themeValue = themeIndex > -1 ? (cells[themeIndex]?.v !== null ? String(cells[themeIndex]?.v) : null) : null;
    const finalTheme = themeValue || getTalkTitle(talkNoValue);

    if (existingVisitIndex > -1) {
      // Mise à jour de la visite existante
      const existingVisit = newVisits[existingVisitIndex];
      let hasChanges = false;

      if (existingVisit.congregation !== congregation && congregation) {
        existingVisit.congregation = congregation;
        hasChanges = true;
      }
      if (talkNoIndex > -1 && existingVisit.talkNoOrType !== talkNoValue) {
        existingVisit.talkNoOrType = talkNoValue;
        hasChanges = true;
      }
      if (themeIndex > -1 && existingVisit.talkTheme !== finalTheme) {
        existingVisit.talkTheme = finalTheme;
        hasChanges = true;
      }

      if (hasChanges) {
        updatedCount++;
        console.log(`🔄 Visite mise à jour: ${speakerName} (${formattedDate})`);
      }
    } else {
      // Nouvelle visite
      const newVisit = {
        id: speaker.id,
        nom: speaker.nom,
        congregation,
        telephone: speaker.telephone || '',
        visitId: generateUUID(),
        visitDate: formattedDate,
        visitTime: '14:30',
        host: congregation.toLowerCase().includes('zoom') || congregation.toLowerCase().includes('streaming') ? 'N/A' : 'À définir',
        accommodation: '',
        meals: '',
        status: 'pending',
        locationType: congregation.toLowerCase().includes('zoom') ? 'zoom' : congregation.toLowerCase().includes('streaming') ? 'streaming' : 'physical',
        talkNoOrType: talkNoValue,
        talkTheme: finalTheme,
        communicationStatus: {}
      };
      newVisits.push(newVisit);
      addedCount++;
      console.log(`➕ Nouvelle visite ajoutée: ${speakerName} (${formattedDate})`);
    }
  }

  // Créer le nouveau backup
  const updatedBackup = {
    ...existingData,
    speakers: newSpeakers,
    visits: newVisits,
    dataVersion: '1.0.1'
  };

  console.log(`\n📊 Résumé de la synchronisation:`);
  console.log(`- ${addedCount} visite(s) ajoutée(s)`);
  console.log(`- ${updatedCount} visite(s) mise(s) à jour`);
  console.log(`- ${skippedCount} ligne(s) ignorée(s)`);
  console.log(`- ${newSpeakers.length} orateur(s) total`);
  console.log(`- ${newVisits.length} visite(s) total`);

  // Retourner les données pour sauvegarde
  return updatedBackup;
}

// Fonction principale pour exécuter la synchronisation
async function main() {
  try {
    console.log('🔄 Début de la synchronisation complète...');

    const updatedData = await syncWithGoogleSheets();

    if (updatedData) {
      // Sauvegarder automatiquement dans Node.js
      if (typeof window === 'undefined') {
        const filePath = path.join(__dirname, 'public', 'kbv-backup-2025-12-08.json');
        const jsonContent = JSON.stringify(updatedData, null, 2);
        fs.writeFileSync(filePath, jsonContent, 'utf8');
        console.log('💾 Fichier sauvegardé automatiquement:', filePath);
      }

      // Afficher un résumé des données
      console.log('📊 Données finales:');
      console.log(`Orateurs: ${updatedData.speakers.length}`);
      console.log(`Visites: ${updatedData.visits.length}`);
      console.log(`Hôtes: ${updatedData.hosts.length}`);

      // Compter les visites par année
      const visitsByYear = {};
      updatedData.visits.forEach(visit => {
        const year = visit.visitDate.substring(0, 4);
        visitsByYear[year] = (visitsByYear[year] || 0) + 1;
      });

      console.log('Visites par année:', visitsByYear);
      console.log('✅ Synchronisation terminée avec succès !');

      // Retourner les données
      return updatedData;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
  }
}

// Exécuter si appelé directement
if (typeof window !== 'undefined') {
  // Dans le navigateur
  window.syncGoogleSheets = main;
  console.log('🔧 Fonction syncGoogleSheets disponible. Tapez: syncGoogleSheets() pour lancer la synchronisation.');
} else {
  // Dans Node.js
  main();
}
