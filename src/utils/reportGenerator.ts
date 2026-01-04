import { Visit, Speaker, Host, CongregationProfile } from '@/types';
import { ReportConfig } from '@/components/reports/ReportGeneratorModal';
import { formatFullDate } from './formatters';
import { getTalkTitle } from '@/data/talkTitles';

export async function generateReport(
  config: ReportConfig,
  visits: Visit[],
  speakers: Speaker[],
  hosts: Host[],
  congregationProfile: CongregationProfile
): Promise<void> {
  // Filtrer les visites selon la période
  const filteredVisits = filterVisitsByPeriod(visits, config);

  // Générer selon le format
  switch (config.format) {
    case 'pdf':
      await generatePDF(config, filteredVisits, speakers, hosts, congregationProfile);
      break;
    case 'excel':
      await generateExcel(config, filteredVisits, speakers, hosts, congregationProfile);
      break;
    case 'csv':
      await generateCSV(config, filteredVisits, speakers, hosts, congregationProfile);
      break;
  }
}

function filterVisitsByPeriod(visits: Visit[], config: ReportConfig): Visit[] {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (config.period) {
    case 'current-month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'last-month':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case 'current-year':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
      break;
    case 'last-year':
      start = new Date(now.getFullYear() - 1, 0, 1);
      end = new Date(now.getFullYear() - 1, 11, 31);
      break;
    case 'custom':
      if (config.filters?.dateRange) {
        start = new Date(config.filters.dateRange.start);
        end = new Date(config.filters.dateRange.end);
      } else {
        return visits;
      }
      break;
    default:
      return visits;
  }

  return visits.filter((v) => {
    const d = new Date(v.visitDate);
    return d >= start && d <= end;
  });
}

async function generatePDF(
  config: ReportConfig,
  visits: Visit[],
  speakers: Speaker[],
  hosts: Host[],
  congregationProfile: CongregationProfile
): Promise<void> {
  // Générer le contenu HTML
  const html = generateHTMLReport(config, visits, speakers, hosts, congregationProfile);

  // Créer un blob et télécharger
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rapport-${config.type}-${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function generateExcel(
  config: ReportConfig,
  visits: Visit[],
  speakers: Speaker[],
  hosts: Host[],
  congregationProfile: CongregationProfile
): Promise<void> {
  const csv = generateCSVContent(config, visits, speakers, hosts, congregationProfile);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rapport-${config.type}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function generateCSV(
  config: ReportConfig,
  visits: Visit[],
  speakers: Speaker[],
  hosts: Host[],
  congregationProfile: CongregationProfile
): Promise<void> {
  await generateExcel(config, visits, speakers, hosts, congregationProfile);
}

function generateHTMLReport(
  config: ReportConfig,
  visits: Visit[],
  speakers: Speaker[],
  hosts: Host[],
  congregationProfile: CongregationProfile
): string {
  const sections: string[] = [];

  // En-tête
  sections.push(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rapport ${config.type}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #2563eb; }
        h2 { color: #1e40af; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #2563eb; color: white; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .summary { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <h1>Rapport ${config.type} - ${congregationProfile.name}</h1>
      <p>Généré le ${formatFullDate(new Date().toISOString().slice(0, 10))}</p>
  `);

  // Résumé
  if (config.includeSections.includes('summary')) {
    sections.push(`
      <div class="summary">
        <h2>Résumé Exécutif</h2>
        <p><strong>Nombre total de visites :</strong> ${visits.length}</p>
        <p><strong>Visites confirmées :</strong> ${visits.filter(v => v.status === 'confirmed').length}</p>
        <p><strong>Visites complétées :</strong> ${visits.filter(v => v.status === 'completed').length}</p>
        <p><strong>Nombre d'orateurs :</strong> ${speakers.length}</p>
        <p><strong>Nombre d'hôtes :</strong> ${hosts.length}</p>
      </div>
    `);
  }

  // Liste des visites
  if (config.includeSections.includes('visits')) {
    sections.push(`
      <h2>Liste des Visites</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Orateur</th>
            <th>Congrégation</th>
            <th>Discours</th>
            <th>Hôte</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${visits.map(v => `
            <tr>
              <td>${formatFullDate(v.visitDate)}</td>
              <td>${v.visitTime}</td>
              <td>${v.nom}</td>
              <td>${v.congregation}</td>
              <td>${getTalkTitle(v.talkNoOrType || '')}</td>
              <td>${v.host}</td>
              <td>${v.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `);
  }

  // Statistiques orateurs
  if (config.includeSections.includes('speakers')) {
    sections.push(`
      <h2>Statistiques Orateurs</h2>
      <table>
        <thead>
          <tr>
            <th>Orateur</th>
            <th>Congrégation</th>
            <th>Nombre de visites</th>
            <th>Dernière visite</th>
          </tr>
        </thead>
        <tbody>
          ${speakers.map(s => {
            const speakerVisits = visits.filter(v => v.id === s.id);
            const lastVisit = speakerVisits.length > 0 
              ? speakerVisits.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())[0]
              : null;
            return `
              <tr>
                <td>${s.nom}</td>
                <td>${s.congregation}</td>
                <td>${speakerVisits.length}</td>
                <td>${lastVisit ? formatFullDate(lastVisit.visitDate) : 'Aucune'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `);
  }

  // Fermeture
  sections.push(`
    </body>
    </html>
  `);

  return sections.join('\n');
}

function generateCSVContent(
  _config: ReportConfig,
  visits: Visit[],
  _speakers: Speaker[],
  _hosts: Host[],
  _congregationProfile: CongregationProfile
): string {
  const rows: string[] = [];

  // En-tête
  rows.push('Date,Heure,Orateur,Congrégation,Discours,Hôte,Statut');

  // Données
  visits.forEach(v => {
    rows.push([
      formatFullDate(v.visitDate),
      v.visitTime,
      v.nom,
      v.congregation,
      getTalkTitle(v.talkNoOrType || ''),
      v.host,
      v.status
    ].map(cell => `"${cell}"`).join(','));
  });

  return rows.join('\n');
}
