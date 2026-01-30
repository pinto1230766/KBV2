import { Visit as _Visit, Speaker as _Speaker, Host as _Host, AppData } from '@/types';

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';
export type ExportType = 'visits' | 'speakers' | 'hosts' | 'all' | 'archives' | 'report' | 'communications';

export interface ExportOptions {
  format: ExportFormat;
  type: ExportType;
  filters?: {
    dateRange?: { start: Date; end: Date };
    status?: string[];
    congregations?: string[];
  };
  includeHeaders?: boolean;
  filename?: string;
}

export interface ExportResult {
  success: boolean;
  data?: Blob | string;
  filename: string;
  error?: string;
}

class ExportService {
  private static instance: ExportService;
  private data: AppData | null = null;

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  setData(data: AppData) {
    this.data = data;
  }

  async export(options: ExportOptions): Promise<ExportResult> {
    if (!this.data) {
      return {
        success: false,
        filename: '',
        error: 'Données non disponibles',
      };
    }

    try {
      let data: any[] = [];
      let headers: string[] = [];

      switch (options.type) {
        case 'visits':
          ({ data, headers } = this.prepareVisitsData(options));
          break;
        case 'speakers':
          ({ data, headers } = this.prepareSpeakersData(options));
          break;
        case 'hosts':
          ({ data, headers } = this.prepareHostsData(options));
          break;
        case 'archives':
          ({ data, headers } = this.prepareArchivesData(options));
          break;
        case 'all':
          ({ data, headers } = this.prepareAllData(options));
          break;
        case 'report':
          ({ data, headers } = this.prepareReportData(options));
          break;
        case 'communications':
          ({ data, headers } = this.prepareCommunicationsData(options));
          break;
        default:
          return {
            success: false,
            filename: '',
            error: "Type d'export non supporté",
          };
      }

      const result = await this.generateFile(data, headers, options);
      return result;
    } catch (error) {
      return {
        success: false,
        filename: '',
        error: error instanceof Error ? error.message : "Erreur lors de l'export",
      };
    }
  }

  private prepareVisitsData(options: ExportOptions): { data: any[]; headers: string[] } {
    let visits = [...this.data!.visits];

    // Apply filters
    if (options.filters?.dateRange) {
      visits = visits.filter((visit) => {
        const visitDate = new Date(visit.visitDate);
        return (
          visitDate >= options.filters!.dateRange!.start &&
          visitDate <= options.filters!.dateRange!.end
        );
      });
    }

    if (options.filters?.status && options.filters.status.length > 0) {
      visits = visits.filter((visit) => options.filters!.status!.includes(visit.status));
    }

    if (options.filters?.congregations && options.filters.congregations.length > 0) {
      visits = visits.filter((visit) =>
        options.filters!.congregations!.includes(visit.congregation)
      );
    }

    const headers = [
      'ID Visite',
      'Orateur',
      'Congrégation',
      'Date',
      'Heure',
      'Hôte',
      'Hébergement',
      'Repas',
      'Statut',
      'Type de lieu',
      'Numéro du discours',
      'Thème du discours',
      'Notes',
      'Téléphone',
      'Email',
    ];

    const data = visits.map((visit) => [
      visit.visitId,
      visit.nom,
      visit.congregation,
      visit.visitDate,
      visit.visitTime,
      visit.host,
      visit.accommodation,
      visit.meals,
      visit.status,
      visit.locationType,
      visit.talkNoOrType || '',
      visit.talkTheme || '',
      visit.notes || '',
      visit.telephone || '',
      '', // Email not in Visit type
    ]);

    return { data, headers };
  }

  private prepareSpeakersData(_options: ExportOptions): { data: any[]; headers: string[] } {
    const speakers = this.data!.speakers;

    const headers = [
      'ID',
      'Nom',
      'Congrégation',
      'Téléphone',
      'Email',
      'Genre',
      'Notes',
      'Tags',
      'Véhiculé',
      'Nombre de visites',
      'Dernière visite',
    ];

    const data = speakers.map((speaker) => [
      speaker.id,
      speaker.nom,
      speaker.congregation,
      speaker.telephone || '',
      speaker.email || '',
      speaker.gender,
      speaker.notes || '',
      speaker.tags ? speaker.tags.join('; ') : '',
      speaker.isVehiculed ? 'Oui' : 'Non',
      speaker.talkHistory.length,
      speaker.talkHistory.length > 0
        ? speaker.talkHistory.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0].date
        : '',
    ]);

    return { data, headers };
  }

  private prepareHostsData(_options: ExportOptions): { data: any[]; headers: string[] } {
    const hosts = this.data!.hosts;

    const headers = [
      'Nom',
      'Téléphone',
      'Email',
      'Adresse',
      'Genre',
      'Notes',
      'Tags',
      'Capacité',
      'Parking',
      'Ascenseur',
      'Animaux',
      'Fumeur',
    ];

    const data = hosts.map((host) => [
      host.nom,
      host.telephone || '',
      host.email || '',
      host.address || '',
      host.gender,
      host.notes || '',
      host.tags ? host.tags.join('; ') : '',
      host.capacity || '',
      host.hasParking ? 'Oui' : 'Non',
      host.hasElevator ? 'Oui' : 'Non',
      host.hasPets ? 'Oui' : 'Non',
      host.isSmoker ? 'Oui' : 'Non',
    ]);

    return { data, headers };
  }

  private prepareArchivesData(_options: ExportOptions): { data: any[]; headers: string[] } {
    const archives = this.data!.archivedVisits;

    const headers = [
      'Date',
      'Heure',
      'Orateur',
      'Congrégation',
      'Discours',
      'Thème',
      'Hôte',
      'Statut',
    ];

    const data = archives.map((visit) => [
      visit.visitDate,
      visit.visitTime,
      visit.nom,
      visit.congregation,
      visit.talkNoOrType || '',
      visit.talkTheme || '',
      visit.host,
      visit.status,
    ]);

    return { data, headers };
  }

  private prepareAllData(_options: ExportOptions): { data: any[]; headers: string[] } {
    // Combine all data types
    const headers = ['Type', 'Données JSON'];
    const data = [
      ['speakers', JSON.stringify(this.data!.speakers)],
      ['visits', JSON.stringify(this.data!.visits)],
      ['hosts', JSON.stringify(this.data!.hosts)],
      ['archived_visits', JSON.stringify(this.data!.archivedVisits)],
    ];

    return { data, headers };
  }

  private prepareReportData(_options: ExportOptions): { data: any[]; headers: string[] } {
    // Generate summary report
    const visits = this.data!.visits;
    const speakers = this.data!.speakers;
    const hosts = this.data!.hosts;

    const headers = ['Métrique', 'Valeur'];
    const data = [
      ["Nombre total d'orateurs", speakers.length.toString()],
      ["Nombre total d'hôtes", hosts.length.toString()],
      ['Nombre total de visites', visits.length.toString()],
      ['Visites confirmées', visits.filter((v) => v.status === 'confirmed').length.toString()],
      ['Visites en attente', visits.filter((v) => v.status === 'pending').length.toString()],
      ['Visites terminées', visits.filter((v) => v.status === 'completed').length.toString()],
    ];

    return { data, headers };
  }

  private prepareCommunicationsData(_options: ExportOptions): { data: any[]; headers: string[] } {
    const visits = this.data!.visits;
    const speakers = this.data!.speakers;

    const headers = [
      'ID Visite',
      'Orateur',
      'Congrégation',
      'Date Visite',
      'Type Message',
      'Destinataire',
      'Date Envoi',
      'Canal',
      'Statut',
    ];

    const data: any[] = [];

    visits.forEach((visit) => {
      const speaker = speakers.find(s => s.id === visit.id);
      if (!visit.communicationStatus) return;

      Object.entries(visit.communicationStatus).forEach(([messageType, roles]) => {
        if (typeof roles === 'object' && roles !== null) {
          Object.entries(roles as Record<string, string>).forEach(([role, dateStr]) => {
            data.push([
              visit.visitId,
              speaker?.nom || visit.nom,
              speaker?.congregation || visit.congregation,
              visit.visitDate,
              messageType,
              role,
              dateStr,
              this.getChannelForMessageType(messageType),
              'Envoyé',
            ]);
          });
        }
      });
    });

    return { data, headers };
  }

  private getChannelForMessageType(messageType: string): string {
    const channelMap: Record<string, string> = {
      confirmation: 'WhatsApp',
      preparation: 'WhatsApp',
      'reminder-7': 'WhatsApp',
      'reminder-2': 'WhatsApp',
      thanks: 'WhatsApp',
      host_thanks: 'WhatsApp',
      host_request: 'Groupe WhatsApp',
      visit_recap: 'WhatsApp',
    };
    return channelMap[messageType] || 'Inconnu';
  }

  private async generateFile(
    data: any[],
    headers: string[],
    options: ExportOptions
  ): Promise<ExportResult> {
    const includeHeaders = options.includeHeaders !== false;
    const filename = options.filename || this.generateFilename(options);

    switch (options.format) {
      case 'csv':
        return this.generateCSV(data, headers, includeHeaders, filename);
      case 'excel':
        return this.generateExcel(data, headers, includeHeaders, filename);
      case 'json':
        return this.generateJSON(data, headers, includeHeaders, filename);
      case 'pdf':
        return this.generatePDF(data, headers, includeHeaders, filename);
      default:
        throw new Error(`Format ${options.format} non supporté`);
    }
  }

  private generateCSV(
    data: any[],
    headers: string[],
    includeHeaders: boolean,
    filename: string
  ): ExportResult {
    let csvContent = '';

    if (includeHeaders) {
      csvContent += headers.map((h) => `"${h}"`).join(',') + '\n';
    }

    data.forEach((row) => {
      csvContent +=
        row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });

    return {
      success: true,
      data: csvContent,
      filename: filename.endsWith('.csv') ? filename : `${filename}.csv`,
    };
  }

  private generateExcel(
    data: any[],
    headers: string[],
    includeHeaders: boolean,
    filename: string
  ): ExportResult {
    // For now, generate CSV as Excel-compatible format
    // In a real implementation, you'd use a library like xlsx
    const csvResult = this.generateCSV(data, headers, includeHeaders, filename);
    return {
      ...csvResult,
      filename: filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`,
    };
  }

  private generateJSON(
    data: any[],
    headers: string[],
    includeHeaders: boolean,
    filename: string
  ): ExportResult {
    const jsonData = includeHeaders ? { headers, data } : data;
    const jsonContent = JSON.stringify(jsonData, null, 2);

    return {
      success: true,
      data: jsonContent,
      filename: filename.endsWith('.json') ? filename : `${filename}.json`,
    };
  }

  private generatePDF(
    data: any[],
    headers: string[],
    includeHeaders: boolean,
    filename: string
  ): ExportResult {
    // For now, generate CSV as placeholder
    // In a real implementation, you'd use a PDF library
    const csvResult = this.generateCSV(data, headers, includeHeaders, filename);
    return {
      ...csvResult,
      filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    };
  }

  private generateFilename(options: ExportOptions): string {
    const timestamp = new Date().toISOString().slice(0, 10);
    const baseName = `kbv_${options.type}_${timestamp}`;
    return baseName;
  }

  // Utility method to download file
  download(result: ExportResult): void {
    if (!result.success || !result.data) return;

    const blob =
      result.data instanceof Blob
        ? result.data
        : new Blob([result.data], { type: 'text/plain;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const exportService = ExportService.getInstance();
