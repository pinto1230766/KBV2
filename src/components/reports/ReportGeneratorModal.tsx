import React, { useState } from 'react';
import { FileText, Download, Calendar, Users, BarChart3, Filter, Settings } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { useData } from '@/contexts/DataContext';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: ReportConfig) => void;
}

export interface ReportConfig {
  type: ReportType;
  period: ReportPeriod;
  format: 'pdf' | 'excel' | 'csv';
  includeSections: string[];
  filters?: ReportFilters;
}

type ReportType = 'monthly' | 'annual' | 'speaker' | 'congregation' | 'statistics' | 'custom';
type ReportPeriod = 'current-month' | 'last-month' | 'current-year' | 'last-year' | 'custom';

interface ReportFilters {
  dateRange?: { start: string; end: string };
  congregations?: string[];
  speakers?: string[];
  status?: string[];
}

const REPORT_TYPES = [
  { value: 'monthly' as ReportType, label: 'Rapport mensuel', icon: Calendar, description: 'Résumé des visites du mois' },
  { value: 'annual' as ReportType, label: 'Rapport annuel', icon: BarChart3, description: 'Bilan de l\'année complète' },
  { value: 'speaker' as ReportType, label: 'Par orateur', icon: Users, description: 'Statistiques par orateur' },
  { value: 'congregation' as ReportType, label: 'Par congrégation', icon: Users, description: 'Répartition par congrégation' },
  { value: 'statistics' as ReportType, label: 'Statistiques avancées', icon: BarChart3, description: 'Analyses détaillées' },
];

const REPORT_SECTIONS = [
  { id: 'summary', label: 'Résumé exécutif', default: true },
  { id: 'visits', label: 'Liste des visites', default: true },
  { id: 'speakers', label: 'Statistiques orateurs', default: true },
  { id: 'talks', label: 'Discours présentés', default: true },
  { id: 'hosts', label: 'Statistiques accueil', default: false },
  { id: 'expenses', label: 'Dépenses', default: false },
  { id: 'feedback', label: 'Évaluations', default: false },
  { id: 'charts', label: 'Graphiques', default: true },
];

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const { visits, speakers } = useData();
  const [selectedType, setSelectedType] = useState<ReportType>('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('current-month');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [includedSections, setIncludedSections] = useState<string[]>(
    REPORT_SECTIONS.filter(s => s.default).map(s => s.id)
  );
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleSection = (sectionId: string) => {
    setIncludedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleGenerate = () => {
    const config: ReportConfig = {
      type: selectedType,
      period: selectedPeriod,
      format: selectedFormat,
      includeSections: includedSections,
      filters: selectedPeriod === 'custom' ? {
        dateRange: customDateRange
      } : undefined
    };

    onGenerate(config);
    onClose();
  };

  const getEstimatedPages = () => {
    let pages = 1; // Page de garde
    if (includedSections.includes('summary')) pages += 1;
    if (includedSections.includes('visits')) pages += Math.ceil(visits.length / 20);
    if (includedSections.includes('speakers')) pages += Math.ceil(speakers.length / 15);
    if (includedSections.includes('charts')) pages += 2;
    return pages;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Générateur de rapports"
      size="xl"
    >
      <div className="space-y-6">
        {/* Type de rapport */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Type de rapport
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {REPORT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedType === type.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <type.icon className={`w-5 h-5 flex-shrink-0 ${
                    selectedType === type.value ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {type.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {type.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Période */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Période
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'current-month', label: 'Mois en cours' },
              { value: 'last-month', label: 'Mois dernier' },
              { value: 'current-year', label: 'Année en cours' },
              { value: 'last-year', label: 'Année dernière' },
              { value: 'custom', label: 'Personnalisée' },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value as ReportPeriod)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  selectedPeriod === period.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {selectedPeriod === 'custom' && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Format d'export
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'pdf', label: 'PDF', icon: '📄', description: 'Document imprimable' },
              { value: 'excel', label: 'Excel', icon: '📊', description: 'Tableau de données' },
              { value: 'csv', label: 'CSV', icon: '📋', description: 'Données brutes' },
            ].map((format) => (
              <button
                key={format.value}
                onClick={() => setSelectedFormat(format.value as any)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedFormat === format.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{format.icon}</div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {format.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {format.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sections à inclure */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sections à inclure
            </label>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? 'Masquer' : 'Options avancées'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {REPORT_SECTIONS.map((section) => (
              <label
                key={section.id}
                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  checked={includedSections.includes(section.id)}
                  onChange={() => toggleSection(section.id)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {section.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Aperçu */}
        <Card className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Aperçu du rapport
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>• Type : {REPORT_TYPES.find(t => t.value === selectedType)?.label}</p>
                  <p>• Format : {selectedFormat.toUpperCase()}</p>
                  <p>• Sections : {includedSections.length}</p>
                  <p>• Pages estimées : ~{getEstimatedPages()}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">
                  {getEstimatedPages()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  pages
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={includedSections.length === 0 || (selectedPeriod === 'custom' && (!customDateRange.start || !customDateRange.end))}
          >
            <Download className="w-4 h-4 mr-2" />
            Générer le rapport
          </Button>
        </div>
      </div>
    </Modal>
  );
};
