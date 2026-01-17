import fs from 'fs';
import path from 'path';

// Function to sanitize filename
function sanitizeFilename(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars except spaces and -
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/-+/g, '-') // replace multiple - with single
    .trim(); // trim leading/trailing
}

// Read backup
const backupPath = 'kbv-backup-2026-01-13.json';
const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

// Read completeData
const completeDataPath = 'src/data/completeData.ts';
let completeDataContent = fs.readFileSync(completeDataPath, 'utf8');

// Parse completeData hosts
const completeDataHosts = backupData.hosts; // assuming backup has hosts

// Process each host in backup
completeDataHosts.forEach(host => {
  if (host.photoUrl && host.photoUrl.startsWith('data:image')) {
    // Extract base64
    const base64Data = host.photoUrl.split(';base64,')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Create filename
    const filename = `${sanitizeFilename(host.nom)}.jpg`;
    const filePath = path.join('public', 'assets', 'hosts', filename);

    // Save file
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved ${filename}`);

    // Update host.photoUrl to local path
    host.photoUrl = `/assets/hosts/${filename}`;
  }
});

// Now, update completeData.ts
// Find the completeHosts array and replace with updated hosts
const hostsStart = completeDataContent.indexOf('export const completeHosts: Host[] = [');
const hostsEnd = completeDataContent.indexOf('];', hostsStart) + 2;
const hostsContent = completeDataContent.substring(hostsStart, hostsEnd);

const updatedHosts = `export const completeHosts: Host[] = ${JSON.stringify(backupData.hosts, null, 2)};`;

completeDataContent = completeDataContent.replace(hostsContent, updatedHosts);

fs.writeFileSync(completeDataPath, completeDataContent);

console.log('Updated completeData.ts');