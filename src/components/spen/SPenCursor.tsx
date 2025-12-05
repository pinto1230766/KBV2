import React from 'react';
import { useSPen } from '@/hooks/useSPen';

interface SPenCursorProps {
  children: React.ReactNode;
}

export const SPenCursor: React.FC<SPenCursorProps> = ({ children }) => {
  const { hasSPen, isHovering, position } = useSPen();

  if (!hasSPen || !isHovering || !position) {
    return <>{children}</>;
  }

  // Utiliser les variables CSS pour éviter les styles inline
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--spen-cursor-x', `${position.x}px`);
    root.style.setProperty('--spen-cursor-y', `${position.y}px`);
  }, [position.x, position.y]);

  return (
    <>
      {children}
      {/* Curseur personnalisé S Pen */}
      <div className="spen-cursor spen-cursor-positioned pointer-events-none z-[9999] transition-opacity duration-100">
        <div className="relative">
          {/* Point central */}
          <div className="w-2 h-2 bg-ios-blue rounded-full" />
          {/* Cercle extérieur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-ios-blue rounded-full opacity-50" />
        </div>
      </div>
    </>
  );
};
