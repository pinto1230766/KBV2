import React, { useMemo } from 'react';
import { Clock, CalendarDays, MapPin, AlertCircle } from 'lucide-react';
import { useVisitEditor } from '../VisitEditorContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoryItem {
  date: string;
  talkNoOrType?: string | number | null;
  talkTheme?: string | null;
  congregation?: string;
  locationType?: string;
  source: 'speaker' | 'visit';
}

export const HistoryTab: React.FC = () => {
  const { visit } = useVisitEditor();
  const { speakers, visits } = useData();

  const history = useMemo<HistoryItem[]>(() => {
    const speaker = speakers.find((s) => s.id === visit.id);
    const speakerHistory: HistoryItem[] = (speaker?.talkHistory || []).map((h) => ({
      date: h.date,
      talkNoOrType: h.talkNo,
      talkTheme: undefined,
      congregation: undefined,
      source: 'speaker',
    }));

    const visitHistory: HistoryItem[] = visits
      .filter((v) => v.id === visit.id && v.visitId !== visit.visitId)
      .map((v) => ({
        date: v.visitDate,
        talkNoOrType: v.talkNoOrType,
        talkTheme: v.talkTheme,
        congregation: v.congregation,
        locationType: v.locationType,
        source: 'visit',
      }));

    return [...speakerHistory, ...visitHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [speakers, visits, visit]);

  if (!history.length) {
    return (
      <div className='flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4'>
        <AlertCircle className='w-4 h-4 text-amber-500' />
        <span>Aucun historique disponible pour cet orateur.</span>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {history.map((item, idx) => (
        <Card key={`${item.date}-${idx}`} className='border border-gray-100 dark:border-gray-800 shadow-sm'>
          <CardBody className='flex items-center justify-between gap-3 py-3'>
            <div className='flex items-center gap-3'>
              <Badge variant='info' className='text-[11px] font-bold uppercase tracking-wide'>
                {item.source === 'speaker' ? 'Historique Orateur' : 'Visite enregistrée'}
              </Badge>
              <div>
                <div className='text-sm font-semibold text-gray-900 dark:text-white'>
                  Discours {item.talkNoOrType ?? '—'}
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400 line-clamp-1'>
                  {item.talkTheme || 'Thème non renseigné'}
                </div>
              </div>
            </div>

            <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
              <div className='flex items-center gap-1'>
                <CalendarDays className='w-4 h-4' />
                <span>{format(new Date(item.date), 'dd MMM yyyy', { locale: fr })}</span>
              </div>
              {item.congregation && (
                <div className='flex items-center gap-1'>
                  <MapPin className='w-4 h-4' />
                  <span className='line-clamp-1'>{item.congregation}</span>
                </div>
              )}
              {item.locationType && (
                <div className='flex items-center gap-1'>
                  <Clock className='w-4 h-4' />
                  <span className='capitalize'>
                    {item.locationType === 'physical' ? 'Présentiel' : 'Visio'}
                  </span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
