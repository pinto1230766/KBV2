import React, { useState, useMemo } from 'react';
import {
  Download,
  Calendar,
  Users,
  BarChart3,
  X,
  FileText,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/utils/cn';

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
  {
    value: 'monthly' as ReportType,
    label: 'Rapport Mensuel',
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    description: 'Résumé complet des visites du mois.',
  },
  {
    value: 'annual' as ReportType,
    label: 'Bilan Annuel',
    icon: BarChart3,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/40',
    description: "Vue panoramique de l'activité de l'année.",
  },
  {
    value: 'speaker' as ReportType,
    label: 'Fiche Orateur',
    icon: Users,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/40',
    description: 'Détails et historique par orateur.',
  },
  {
    value: 'congregation' as ReportType,
    label: 'Statistiques Cong.',
    icon: Users,
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/40',
    description: "Analyses par congrégation d'origine.",
  },
];

const REPORT_SECTIONS = [
  { id: 'summary', label: 'Résumé exécutif', default: true },
  { id: 'visits', label: 'Liste des visites', default: true },
  { id: 'speakers', label: 'Statistiques orateurs', default: true },
  { id: 'talks', label: 'Discours présentés', default: true },
  { id: 'charts', label: 'Graphiques & Visuels', default: true },
  { id: 'hosts', label: "Rapport d'accueil", default: false },
];

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const { visits, speakers } = useData();
  const [selectedType, setSelectedType] = useState<ReportType>('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('current-month');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [includedSections, setIncludedSections] = useState<string[]>(
    REPORT_SECTIONS.filter((s) => s.default).map((s) => s.id)
  );
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  const toggleSection = (sectionId: string) => {
    setIncludedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const filteredVisitsCount = useMemo(() => {
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (selectedPeriod) {
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
        if (customDateRange.start) start = new Date(customDateRange.start);
        if (customDateRange.end) end = new Date(customDateRange.end);
        break;
    }

    if (!start || !end) return 0;
    return visits.filter((v) => {
      const d = new Date(v.visitDate);
      return d >= start! && d <= end!;
    }).length;
  }, [selectedPeriod, customDateRange, visits]);

  const estimatedPages = useMemo(() => {
    let pages = selectedFormat === 'pdf' ? 1 : 0;
    if (includedSections.includes('summary')) pages += 1;
    if (includedSections.includes('visits'))
      pages += Math.max(1, Math.ceil(filteredVisitsCount / 20));
    if (includedSections.includes('speakers'))
      pages += Math.max(1, Math.ceil(speakers.length / 15));
    if (includedSections.includes('charts')) pages += 1;
    return pages;
  }, [selectedFormat, includedSections, filteredVisitsCount, speakers]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=''
      size='xl'
      hideCloseButton
      className='max-sm:rounded-none overflow-hidden border-none'
    >
      <div className='flex flex-col max-h-[90vh] bg-white dark:bg-gray-900 overflow-hidden rounded-3xl'>
        {/* Premium Header */}
        <div className='bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8 text-white relative overflow-hidden shrink-0'>
          <BarChart3 className='absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 rotate-12' />
          <div className='relative z-10'>
            <div className='flex justify-between items-start mb-2'>
              <div className='px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md'>
                GROUPE DE LYON
              </div>
              <button
                onClick={onClose}
                title='Fermer le rapport'
                className='p-2 hover:bg-white/10 rounded-full transition-colors -mr-2 -mt-2'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <h2 className='text-2xl font-black tracking-tighter mb-1 flex items-center gap-3'>
              <Sparkles className='w-6 h-6 text-blue-200' />
              Générateur de Rapports
            </h2>
            <p className='text-blue-100 opacity-80 text-xs max-w-sm font-medium'>
              Générez des documents professionnels et analysez les tendances.
            </p>
          </div>
        </div>

        {/* Actionable Content */}
        <div className='flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800'>
          {/* Report Type Selector */}
          <div className='animate-in fade-in slide-in-from-top-4 duration-500'>
            <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4'>
              1. Choisir le type de rapport
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {REPORT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={cn(
                    'flex items-start gap-4 p-4 rounded-2xl text-left border-2 transition-all duration-200 group',
                    selectedType === type.value
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg'
                      : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110',
                      type.bg,
                      type.color
                    )}
                  >
                    <type.icon className='w-6 h-6' />
                  </div>
                  <div>
                    <div className='font-bold text-sm text-gray-900 dark:text-white uppercase tracking-tight'>
                      {type.label}
                    </div>
                    <p className='text-[11px] text-gray-500 mt-1 leading-relaxed'>
                      {type.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Period Selector */}
          <div className='animate-in fade-in slide-in-from-top-4 duration-500 delay-75'>
            <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4'>
              2. Définir la période
            </h4>
            <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-none'>
              {[
                { value: 'current-month', label: 'Ce mois' },
                { value: 'last-month', label: 'Mois dernier' },
                { value: 'current-year', label: 'Cette année' },
                { value: 'custom', label: 'Personnalisée' },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setSelectedPeriod(p.value as ReportPeriod)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl font-bold text-xs transition-all',
                    selectedPeriod === p.value
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {selectedPeriod === 'custom' && (
              <div className='grid grid-cols-2 gap-3 mt-4 animate-in slide-in-from-top-2 duration-300'>
                <div className='space-y-1'>
                  <span className='text-[10px] font-bold text-gray-400 uppercase ml-1'>Début</span>
                  <input
                    type='date'
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange((p) => ({ ...p, start: e.target.value }))}
                    title='Date de début'
                    placeholder='JJ/MM/AAAA'
                    className='w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs py-2.5 focus:ring-2 focus:ring-indigo-500'
                  />
                </div>
                <div className='space-y-1'>
                  <span className='text-[10px] font-bold text-gray-400 uppercase ml-1'>Fin</span>
                  <input
                    type='date'
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange((p) => ({ ...p, end: e.target.value }))}
                    title='Date de fin'
                    placeholder='JJ/MM/AAAA'
                    className='w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs py-2.5 focus:ring-2 focus:ring-indigo-500'
                  />
                </div>
              </div>
            )}
          </div>

          {/* Format Selector */}
          <div className='animate-in fade-in slide-in-from-top-4 duration-500 delay-150'>
            <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4'>
              3. Format d'exportation
            </h4>
            <div className='grid grid-cols-3 gap-3'>
              {[
                { id: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-500' },
                { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: 'text-green-500' },
                { id: 'csv', label: 'CSV', icon: FileCode, color: 'text-gray-500' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id as any)}
                  className={cn(
                    'group p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2',
                    selectedFormat === f.id
                      ? 'border-primary-500 bg-primary-50/20 shadow-md'
                      : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                  )}
                >
                  <f.icon
                    className={cn(
                      'w-8 h-8 transition-transform group-hover:scale-110',
                      selectedFormat === f.id ? f.color : 'text-gray-300'
                    )}
                  />
                  <span className='font-black text-xs uppercase tracking-widest'>{f.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sections Selector */}
          <div className='animate-in fade-in slide-in-from-top-4 duration-500 delay-200'>
            <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4'>
              4. Sections du document
            </h4>
            <div className='grid grid-cols-2 gap-2'>
              {REPORT_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl text-left transition-all',
                    includedSections.includes(section.id)
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'opacity-40 hover:opacity-100'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-md flex items-center justify-center shrink-0 border-2',
                      includedSections.includes(section.id)
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'border-gray-300'
                    )}
                  >
                    {includedSections.includes(section.id) && <CheckCircle2 className='w-4 h-4' />}
                  </div>
                  <span className='text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-tighter'>
                    {section.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Card */}
          <div className='animate-in zoom-in-95 duration-500 delay-300 px-1 pt-4'>
            <div className='p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white shadow-2xl relative overflow-hidden'>
              <div className='absolute right-[-10px] bottom-[-20px] opacity-10'>
                <FileText className='w-40 h-40' />
              </div>
              <div className='flex justify-between items-end relative z-10'>
                <div>
                  <h5 className='text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4'>
                    Aperçu du volume
                  </h5>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-3 opacity-60 text-[11px]'>
                      <Calendar className='w-3.5 h-3.5' />
                      <span>{REPORT_TYPES.find((t) => t.value === selectedType)?.label}</span>
                    </div>
                    <div className='flex items-center gap-3 opacity-60 text-[11px]'>
                      <Clock className='w-3.5 h-3.5' />
                      <span>{filteredVisitsCount} visite(s) identifiée(s)</span>
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-5xl font-black tracking-tighter text-white'>
                    {estimatedPages}
                  </div>
                  <div className='text-[10px] font-bold uppercase tracking-widest text-primary-400'>
                    Pages estimées
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className='p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm'>
              <Download className='w-5 h-5 text-primary-500' />
            </div>
            <div>
              <p className='text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight'>
                Prêt pour l'exportation
              </p>
              <p className='text-[10px] text-gray-400'>
                © 2025-2026 Pinto Francisco
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3 w-full md:w-auto'>
            <Button
              variant='ghost'
              onClick={onClose}
              className='flex-1 md:flex-none uppercase text-[10px] tracking-widest font-bold'
            >
              Annuler
            </Button>
            <Button
              variant='primary'
              onClick={() =>
                onGenerate({
                  type: selectedType,
                  period: selectedPeriod,
                  format: selectedFormat,
                  includeSections: includedSections,
                  filters: selectedPeriod === 'custom' ? { dateRange: customDateRange } : undefined,
                })
              }
              disabled={
                includedSections.length === 0 ||
                (selectedPeriod === 'custom' && (!customDateRange.start || !customDateRange.end))
              }
              className='flex-1 md:flex-none py-6 px-10 rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none bg-blue-600 hover:bg-blue-700 font-bold uppercase text-xs tracking-widest transition-transform hover:scale-[1.02]'
            >
              Générer <ChevronRight className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
