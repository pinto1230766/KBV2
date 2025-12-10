import React from 'react';
import { Badge } from './Badge';
import { VisitStatus } from '@/types';

interface StatusBadgeProps {
  status: VisitStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = {
    confirmed: { 
      variant: 'success' as const, 
      label: 'Confirmé'
    },
    pending: { 
      variant: 'warning' as const, 
      label: 'En attente'
    },
    completed: { 
      variant: 'default' as const, 
      label: 'Terminé'
    },
    cancelled: { 
      variant: 'danger' as const, 
      label: 'Annulé'
    }
  };
  
  const { variant, label } = config[status];
  
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};
