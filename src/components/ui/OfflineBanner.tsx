import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg">
      <WifiOff className="w-4 h-4" />
      <span>Mode hors ligne - Données en cache</span>
    </div>
  );
};
