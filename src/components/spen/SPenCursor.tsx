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

  return (
    <>
      {children}
      {/* Curseur personnalisé S Pen */}
      <div
        className="fixed pointer-events-none z-[9999] transition-opacity duration-100"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
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
