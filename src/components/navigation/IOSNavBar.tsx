import React, { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IOSNavBarProps {
  title: string;
  largeTitle?: boolean;
  showBackButton?: boolean;
  rightButton?: ReactNode;
  onBack?: () => void;
}

export const IOSNavBar: React.FC<IOSNavBarProps> = ({
  title,
  largeTitle = true,
  showBackButton = false,
  rightButton,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="ios-safe-top">
      {/* Blur Background */}
      <div className="ios-blur border-b border-gray-200 dark:border-gray-800">
        {/* Small Nav Bar (always visible) */}
        <div className="flex items-center justify-between h-11 px-4">
          {/* Left Button */}
          <div className="w-20">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-ios-blue active:opacity-50 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-ios-body font-normal">Retour</span>
              </button>
            )}
          </div>

          {/* Center Title (only visible when scrolled) */}
          <div className="flex-1 text-center">
            {!largeTitle && (
              <h1 className="text-ios-body font-semibold text-gray-900 dark:text-white truncate">
                {title}
              </h1>
            )}
          </div>

          {/* Right Button */}
          <div className="w-20 flex justify-end">
            {rightButton}
          </div>
        </div>

        {/* Large Title (visible at top) - Reduced height */}
        {largeTitle && (
          <div className="px-4 pb-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};
