#!/usr/bin/env node

/**
 * Script pour corriger automatiquement les imports inutilisés TypeScript/ESLint
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToFix = [
  'src/pages/Messages.tsx'
];

console.log('🔧 Correction des imports inutilisés...\n');

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;

    // Corrections spécifiques pour Messages.tsx
    if (filePath === 'src/pages/Messages.tsx') {
      // Supprimer les imports inutilisés
      content = content.replace(/import { Input } from '@\/components\/ui\/Input';/, '');
      content = content.replace(/import { Card, CardBody, CardHeader } from '@\/components\/ui\/Card';/, 'import { Card, CardBody } from \'@/components/ui/Card\';');
      content = content.replace(/\s+AlertCircle,/,'');
      content = content.replace(/\s+Calendar,/,'');
      content = content.replace(/\s+Filter,/,'');
    }

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Corrigé: ${filePath}`);
    } else {
      console.log(`ℹ️  Aucune correction nécessaire: ${filePath}`);
    }

  } catch (error) {
    console.error(`❌ Erreur lors de la correction de ${filePath}:`, error.message);
  }
});

console.log('\n✨ Correction terminée !');
