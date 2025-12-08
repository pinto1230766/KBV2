/**
 * Script pour exporter les données du Google Sheet vers un fichier JSON
 * À exécuter avec : node export-sheet-data.js
 */

const SHEET_ID = '1drIzPPi6AohCroSyUkF1UmMFxuEtMACBF4XATDjBOcg';
const API_KEY = 'AIzaSyC2llqldfKnDeZ9Y1SwRXC8QE0f8Ds6lNI';

// Noms des onglets dans votre Google Sheet
const SHEETS = {
  speakers: 'Orateurs',
  visits: 'Visites',
  hosts: 'Contacts'
};

async function fetchSheetData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${sheetName}:`, error);
    return [];
  }
}

function parseRows(rows, headers) {
  if (rows.length === 0) return [];
  
  const dataRows = rows.slice(1); // Skip header row
  return dataRows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

async function exportAllData() {
  console.log('🔄 Exportation des données du Google Sheet...\n');
  
  // Récupérer les données de chaque onglet
  const speakersData = await fetchSheetData(SHEETS.speakers);
  const visitsData = await fetchSheetData(SHEETS.visits);
  const hostsData = await fetchSheetData(SHEETS.hosts);
  
  console.log(`✅ Orateurs: ${speakersData.length - 1} lignes`);
  console.log(`✅ Visites: ${visitsData.length - 1} lignes`);
  console.log(`✅ Contacts: ${hostsData.length - 1} lignes\n`);
  
  // Parser les données
  const speakers = speakersData.length > 0 ? parseRows(speakersData, speakersData[0]) : [];
  const visits = visitsData.length > 0 ? parseRows(visitsData, visitsData[0]) : [];
  const hosts = hostsData.length > 0 ? parseRows(hostsData, hostsData[0]) : [];
  
  // Créer l'objet de données final
  const exportData = {
    speakers,
    visits,
    hosts,
    archivedVisits: [],
    customTemplates: {},
    customHostRequestTemplates: {},
    congregationProfile: {
      name: "KBV DV Lyon",
      hospitalityOverseer: "",
      hospitalityOverseerPhone: ""
    },
    publicTalks: [],
    savedViews: [],
    specialDates: [],
    speakerMessages: [],
    lastSync: new Date().toISOString(),
    dataVersion: "1.0"
  };
  
  // Sauvegarder dans un fichier JSON
  const fs = require('fs');
  const path = require('path');
  
  const outputPath = path.join(__dirname, 'src', 'data', 'initialData.json');
  
  // Créer le dossier si nécessaire
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
  
  console.log(`✅ Données exportées vers: ${outputPath}`);
  console.log(`📊 Total: ${speakers.length} orateurs, ${visits.length} visites, ${hosts.length} contacts\n`);
  console.log('🎉 Export terminé avec succès !');
}

// Exécuter l'export
exportAllData().catch(console.error);
