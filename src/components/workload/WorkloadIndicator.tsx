import React from 'react';
import { WorkloadBalance } from '@/types';
import { getWorkloadColor, getWorkloadLabel } from '@/utils/workload';
import { BatteryCharging, BatteryFull, BatteryLow, BatteryMedium } from 'lucide-react';
// import { Tooltip } from '@/components/ui/Tooltip';

interface WorkloadIndicatorProps {
  workload: WorkloadBalance;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const WorkloadIndicator: React.FC<WorkloadIndicatorProps> = ({
  workload,
  showLabel = false,
  size = 'md',
}) => {
  const colorClass = getWorkloadColor(workload.workloadScore);
  const label = getWorkloadLabel(workload.workloadScore);

  const getIcon = () => {
    if (workload.workloadScore >= 5) return <BatteryLow className='w-4 h-4 rotate-90' />;
    if (workload.workloadScore >= 4) return <BatteryMedium className='w-4 h-4 rotate-90' />;
    if (workload.workloadScore >= 3) return <BatteryFull className='w-4 h-4 rotate-90' />;
    return <BatteryCharging className='w-4 h-4' />;
  };

  const cssSize = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full ${colorClass} ${cssSize}`}
      title={`Charge: ${workload.currentLoad}% - ${label}`}
    >
      {getIcon()}
      {(showLabel || size === 'md') && <span className='font-medium'>{label}</span>}
      {size === 'md' && <span className='opacity-80 text-xs ml-1'>({workload.currentLoad}%)</span>}
    </div>
  );
};
