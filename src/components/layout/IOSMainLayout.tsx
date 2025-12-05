import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { IOSTabBar } from '@/components/navigation/IOSTabBar';
import { IOSNavBar } from '@/components/navigation/IOSNavBar';
import { SPenCursor } from '@/components/spen/SPenCursor';

// Mapping des routes vers les titres
const PAGE_TITLES: Record<string, string> = {
  '/': 'Accueil',
  '/planning': 'Planning',
  '/messages': 'Messages',
  '/speakers': 'Orateurs',
  '/talks': 'Discours',
  '/settings': 'Réglages',
};

export const IOSMainLayout: React.FC = () => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'KBV Lyon';

  return (
    <SPenCursor>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden samsung-optimized">
        {/* Navigation Bar iOS */}
        <IOSNavBar
          title={title}
          largeTitle={true}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-[83px] px-4">
          <div className="max-w-7xl mx-auto py-4">
            <Outlet />
          </div>
        </main>

        {/* Tab Bar iOS */}
        <IOSTabBar />
      </div>
    </SPenCursor>
  );
};
