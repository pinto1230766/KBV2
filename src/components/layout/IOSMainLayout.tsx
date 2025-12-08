import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { IOSTabBar } from '@/components/navigation/IOSTabBar';
import { IOSNavBar } from '@/components/navigation/IOSNavBar';
import { SPenCursor } from '@/components/spen/SPenCursor';
import { usePlatformContext } from '@/contexts/PlatformContext';

// Mapping des routes vers les titres
const PAGE_TITLES: Record<string, string> = {
  '/': 'Accueil',
  '/planning': 'Planning',
  '/messages': 'Messages',
  '/speakers': 'Orateurs',
  '/settings': 'Réglages',
};

export const IOSMainLayout: React.FC = () => {
  const location = useLocation();
  const { deviceType } = usePlatformContext();
  const title = PAGE_TITLES[location.pathname] || 'KBV Lyon';
  const isTablet = deviceType === 'tablet';
  const isDashboard = location.pathname === '/';

  return (
    <SPenCursor>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden samsung-optimized">
        {/* Navigation Bar iOS */}
        <IOSNavBar
          title={title}
          largeTitle={true}
        />

        {/* Main Content - Plein écran sur tablette, pas de scroll si Dashboard tablette */}
        <main className={`flex-1 ${isTablet && isDashboard ? 'overflow-hidden' : 'overflow-y-auto'} pb-[83px] ${isTablet ? 'w-full px-0' : 'px-4'}`}>
          <div className={`${isTablet ? 'h-full w-full' : 'max-w-7xl mx-auto py-4'}`}>
            <Outlet />
          </div>
        </main>

        {/* Tab Bar iOS */}
        <IOSTabBar />
      </div>
    </SPenCursor>
  );
};
