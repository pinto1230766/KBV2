import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Correction des problèmes Dashboard...\n');

const dashboardPath = path.join(__dirname, 'src/pages/Dashboard.tsx');

try {
  let content = fs.readFileSync(dashboardPath, 'utf8');
  
  // Correction 1: Bouton "Nouvelle visite" - fond bleu
  content = content.replace(
    /className="h-12 bg-white hover:bg-blue-50 text-indigo-900 border-none font-bold shadow-lg"/g,
    'className="h-12 bg-blue-600 hover:bg-blue-700 text-white border-none font-bold shadow-lg"'
  );
  
  // Correction 2: Carte "Bonjour" - padding réduit
  content = content.replace(
    /p-6 sm:p-10 text-white shadow-2xl shadow-blue-500\/20"/g,
    'p-4 sm:p-6 text-white shadow-2xl shadow-blue-500/20"'
  );
  
  fs.writeFileSync(dashboardPath, content);
  
  console.log('✅ Dashboard corrigé avec succès !');
  console.log('   - Bouton "Nouvelle visite" : fond bleu maintenant');
  console.log('   - Carte "Bonjour" : padding réduit');
  
} catch (error) {
  console.error('❌ Erreur lors de la correction:', error.message);
}
