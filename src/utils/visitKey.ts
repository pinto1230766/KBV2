import { Visit } from '@/types';

export const getVisitKey = (visit: Partial<Visit>, index?: number) => {
  const baseKey =
    visit.visitId ||
    visit.id ||
    (visit as any).externalId ||
    `${visit.nom || 'visit'}-${visit.visitDate || 'date'}`;
  return index !== undefined ? `${baseKey}-${index}` : baseKey;
};
