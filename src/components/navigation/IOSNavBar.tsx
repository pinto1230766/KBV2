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

        {/* Large Title (visible at top) */}
        {largeTitle && (
          <div className="px-4 pb-3">
            {/* Logo SVG */}
            <div className="flex items-center justify-center mb-2">
              <img 
                src="/logo.svg" 
                alt="KBV Lyon Logo" 
                className="h-36 w-auto"
                onError={(e) => {
                  // Fallback en cas d'erreur de chargement du logo
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="h-36 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-500 rounded-lg px-4"><span class="text-white font-bold text-2xl">KBV</span></div>';
                  }
                }}
              />
            </div>
            <h1 className="ios-large-title text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};
