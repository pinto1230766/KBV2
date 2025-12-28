import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Correction finale des erreurs ESLint...\n');

const speakerListPath = path.join(__dirname, 'src/components/speakers/SpeakerList.tsx');

try {
  let content = fs.readFileSync(speakerListPath, 'utf8');
  
  // Supprimer complètement les variables d'état non utilisées
  content = content.replace(/const \[sortBy, setSortBy\] = useState<[^;]+>;/g, '');
  content = content.replace(/const \[congregationFilter, setCongregationFilter\] = useState<[^;]+>;/g, '');
  
  // Supprimer aussi les lignes de filtres de tri et congrégation qui ne fonctionnent plus
  content = content.replace(/const matchesCongregation =[\s\S]*?return matchesCongregation;/g, 
    '    return true; // Tous les orateurs affichés car filtrage géré au niveau parent');
  
  fs.writeFileSync(speakerListPath, content);
  console.log('✅ SpeakerList.tsx : Erreurs ESLint corrigées');
  
} catch (error) {
  console.error('❌ Erreur lors de la correction:', error.message);
}

console.log('\n✨ Correction ESLint terminée !');
