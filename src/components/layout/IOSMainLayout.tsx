import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { IOSTabBar } from '@/components/navigation/IOSTabBar';
import { SPenCursor } from '@/components/spen/SPenCursor';
import { usePlatformContext } from '@/contexts/PlatformContext';

export const IOSMainLayout: React.FC = () => {
  const location = useLocation();
  const { deviceType } = usePlatformContext();
  const isTablet = deviceType === 'tablet';
  const isDashboard = location.pathname === '/';

  return (
    <SPenCursor>
      <div className='flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden samsung-optimized'>
        {/* Main Content - Plein écran sur tablette, pas de scroll si Dashboard tablette */}
        <main
          className={`flex-1 ${isTablet && isDashboard ? 'overflow-hidden' : 'overflow-y-auto'} pb-[83px] pt-4 ${isTablet ? 'w-full px-0' : 'px-4'}`}
        >
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
