import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Nettoyage final du SpeakerList.tsx...\n');

const speakerListPath = path.join(__dirname, 'src/components/speakers/SpeakerList.tsx');

try {
  let content = fs.readFileSync(speakerListPath, 'utf8');
  
  // Supprimer les variables d'état complètement
  content = content.replace(/\s*const \[sortBy, setSortBy\] = useState<[^;]+>;?\s*/g, '\n');
  content = content.replace(/\s*const \[congregationFilter, setCongregationFilter\] = useState<[^;]+>;?\s*/g, '\n');
  
  // Simplifier la fonction de filtrage
  content = content.replace(
    /const filteredAndSortedSpeakers = speakers[\s\S]*?return matchesCongregation;/,
    'const filteredAndSortedSpeakers = speakers;'
  );
  
  // Supprimer la fonction de normalisation
  content = content.replace(/ {2}const normalizeCongregationName = \([^;]+;[\s\S]*?;/, '');
  
  // Supprimer les lignes de filtrage complexes
  content = content.replace(
    / {6}const matchesCongregation =[\s\S]*?return matchesCongregation;/,
    '    return true;'
  );
  
  // Supprimer la fonction de tri
  content = content.replace(
    / {4}\.sort\(\([^;]+;[\s\S]*?\);/,
    '    .sort((a, b) => a.nom.toLowerCase().localeCompare(b.nom.toLowerCase()));'
  );
  
  fs.writeFileSync(speakerListPath, content);
  console.log('✅ SpeakerList.tsx : Nettoyage final terminé');
  
} catch (error) {
  console.error('❌ Erreur lors du nettoyage:', error.message);
}

console.log('\n✨ Nettoyage final terminé !');
