import React, { ReactNode } from 'react';
import { IOSTabBar } from '@/components/navigation/IOSTabBar';
import { IOSNavBar } from '@/components/navigation/IOSNavBar';

interface IOSLayoutProps {
  children: ReactNode;
  title: string;
  largeTitle?: boolean;
  showBackButton?: boolean;
  rightButton?: ReactNode;
  onBack?: () => void;
}

export const IOSLayout: React.FC<IOSLayoutProps> = ({
  children,
  title,
  largeTitle = true,
  showBackButton = false,
  rightButton,
  onBack,
}) => {
  return (
    <div className="flex flex-col h-full bg-ios-system-background dark:bg-ios-system-background">
      {/* Navigation Bar */}
      <IOSNavBar
        title={title}
        largeTitle={largeTitle}
        showBackButton={showBackButton}
        rightButton={rightButton}
        onBack={onBack}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-[83px]">
        {children}
      </div>

      {/* Tab Bar */}
      <IOSTabBar />
    </div>
  );
};
