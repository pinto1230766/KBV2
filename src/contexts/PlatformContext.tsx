import React, { createContext, useContext, ReactNode } from 'react';
import { usePlatform } from '@/hooks/usePlatform';

type Platform = 'ios' | 'android' | 'web';
type DeviceType = 'phone' | 'tablet' | 'desktop';
type Orientation = 'portrait' | 'landscape';

interface PlatformContextType {
  platform: Platform;
  deviceType: DeviceType;
  screenSize: {
    width: number;
    height: number;
  };
  orientation: Orientation;
  isSamsung: boolean;
  hasSPen: boolean;
  isTabletS10Ultra: boolean;
  isPhoneS25Ultra: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

interface PlatformProviderProps {
  children: ReactNode;
}

export const PlatformProvider: React.FC<PlatformProviderProps> = ({ children }) => {
  const platformInfo = usePlatform();

  return (
    <PlatformContext.Provider value={platformInfo}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatformContext = () => {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatformContext must be used within a PlatformProvider');
  }
  return context;
};
