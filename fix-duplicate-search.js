#!/usr/bin/env node

/**
 * Script pour supprimer les barres de recherche dupliquées dans SpeakerList et HostList
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Correction des barres de recherche dupliquées...\n');

// Correction pour SpeakerList.tsx
const speakerListPath = path.join(__dirname, 'src/components/speakers/SpeakerList.tsx');
if (fs.existsSync(speakerListPath)) {
  try {
    let content = fs.readFileSync(speakerListPath, 'utf8');
    
    // Supprimer la section de recherche complète
    content = content.replace(
      /<div className='flex gap-4'>\s*<div className='flex-1'>\s*<Input[^>]*>\s*<\/Input>\s*<\/div>\s*<\/div>\s*/g,
      ''
    );
    
    // Supprimer la section de filtrage et tri
    content = content.replace(
      /<div className='flex flex-wrap gap-4 items-center'>\s*\{[\s\S]*?<\/div>/g,
      ''
    );
    
    fs.writeFileSync(speakerListPath, content);
    console.log('✅ SpeakerList.tsx : Barre de recherche supprimée');
    
  } catch (error) {
    console.error('❌ Erreur avec SpeakerList.tsx:', error.message);
  }
}

// Correction pour HostList.tsx  
const hostListPath = path.join(__dirname, 'src/components/hosts/HostList.tsx');
if (fs.existsSync(hostListPath)) {
  try {
    let content = fs.readFileSync(hostListPath, 'utf8');
    
    // Supprimer la section de recherche
    content = content.replace(
      /<div className='flex gap-4'>\s*<div className='flex-1'>\s*<Input[^>]*>\s*<\/Input>\s*<\/div>\s*<\/div>\s*/g,
      ''
    );
    
    fs.writeFileSync(hostListPath, content);
    console.log('✅ HostList.tsx : Barre de recherche supprimée');
    
  } catch (error) {
    console.error('❌ Erreur avec HostList.tsx:', error.message);
  }
}

console.log('\n✨ Correction terminée !');
