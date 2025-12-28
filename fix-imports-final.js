#!/usr/bin/env node

/**
 * Script pour corriger définitivement tous les imports inutilisés
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Correction définitive des imports inutilisés...\n');

// Corrections spécifiques
const corrections = [
  {
    file: 'src/components/reports/ReportGeneratorModal.tsx',
    find: /import \{[^}]*Settings,[^}]*\} from 'lucide-react'/,
    replace: (match) => match.replace(/Settings,\s*/, '')
  },
  {
    file: 'src/components/speakers/SpeakerFormModal.tsx', 
    find: /import \{[^}]*MapPin,[^}]*\} from 'lucide-react'/,
    replace: (match) => match.replace(/MapPin,\s*/, '')
  },
  {
    file: "src/components/ui/QuickActionsModal.tsx",
    find: /import \{ Badge \} from '@\/components\/ui\/Badge';/,
    replace: () => ''
  }
];

corrections.forEach(({ file, find, replace }) => {
  const fullPath = path.join(__dirname, file);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    content = content.replace(find, replace);
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Corrigé: ${file}`);
    } else {
      console.log(`ℹ️  Déjà correct: ${file}`);
    }

  } catch (error) {
    console.error(`❌ Erreur avec ${file}:`, error.message);
  }
});

console.log('\n✨ Toutes les corrections sont terminées !');
