import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, MessageSquare, Users, Settings } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const tabs: TabItem[] = [
  {
    id: 'dashboard',
    label: 'Accueil',
    icon: <LayoutDashboard className='w-6 h-6' />,
    path: '/',
  },
  {
    id: 'planning',
    label: 'Planning',
    icon: <Calendar className='w-6 h-6' />,
    path: '/planning',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: <MessageSquare className='w-6 h-6' />,
    path: '/messages',
  },
  {
    id: 'speakers',
    label: 'Orateurs',
    icon: <Users className='w-6 h-6' />,
    path: '/speakers',
  },
  {
    id: 'settings',
    label: 'Réglages',
    icon: <Settings className='w-6 h-6' />,
    path: '/settings',
  },
];

export const IOSTabBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 ios-safe-bottom'>
      {/* Blur Background */}
      <div className='ios-blur border-t border-gray-200 dark:border-gray-800'>
        <div className='flex items-center justify-around h-[49px]'>
          {tabs.map((tab) => {
            const active = isActive(tab.path);

            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`
                  flex flex-col items-center justify-center
                  flex-1 h-full
                  transition-all duration-200
                  active:scale-95
                  ${active ? 'text-ios-blue' : 'text-gray-500 dark:text-gray-400'}
                `}
              >
                {/* Icon */}
                <div
                  className={`
                  transition-transform duration-200
                  ${active ? 'scale-110' : 'scale-100'}
                `}
                >
                  {tab.icon}
                </div>

                {/* Label */}
                <span
                  className={`
                  text-[10px] mt-0.5
                  font-medium
                  ${active ? 'font-semibold' : 'font-normal'}
                `}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Safe Area Bottom Padding */}
      <div className='h-[env(safe-area-inset-bottom,0px)] bg-white dark:bg-black' />
    </div>
  );
};
