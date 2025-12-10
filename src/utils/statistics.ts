import { Visit } from '@/types';

export interface VisitStats {
  total: number;
  confirmed: number;
  pending: number;
  completed: number;
  cancelled: number;
  upcoming: number;
}

export const calculateVisitStats = (visits: Visit[]): VisitStats => {
  const today = new Date();
  
  return {
    total: visits.length,
    confirmed: visits.filter(v => v.status === 'confirmed').length,
    pending: visits.filter(v => v.status === 'pending').length,
    completed: visits.filter(v => v.status === 'completed').length,
    cancelled: visits.filter(v => v.status === 'cancelled').length,
    upcoming: visits.filter(v => {
      const visitDate = new Date(v.visitDate);
      return visitDate >= today && v.status === 'confirmed';
    }).length
  };
};

export const getUpcomingVisits = (visits: Visit[], days: number = 7): Visit[] => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  
  return visits
    .filter(v => {
      const visitDate = new Date(v.visitDate);
      return visitDate >= today && 
             visitDate <= futureDate && 
             (v.status === 'confirmed' || v.status === 'pending');
    })
    .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());
};

export const getVisitsNeedingAction = (visits: Visit[]): Visit[] => {
  const today = new Date();
  
  return visits.filter(v => 
    v.status === 'pending' ||
    (v.status === 'confirmed' && new Date(v.visitDate) < today)
  );
};

export const getCurrentMonthVisits = (visits: Visit[]): number => {
  const now = new Date();
  return visits.filter(v => {
    const visitDate = new Date(v.visitDate);
    return visitDate.getMonth() === now.getMonth() && 
           visitDate.getFullYear() === now.getFullYear();
  }).length;
};
