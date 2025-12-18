import React from 'react';

interface KeyboardShortcutIconProps {
  shortcut?: string;
  className?: string;
  showLabel?: boolean;
}

export const KeyboardShortcutIcon: React.FC<KeyboardShortcutIconProps> = ({
  shortcut,
  className = 'w-3 h-3',
  showLabel = false,
}) => {
  if (!shortcut) return null;

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className='text-xs'>⌨️</span>
      {showLabel && <span className='text-xs text-gray-500 dark:text-gray-400'>{shortcut}</span>}
    </span>
  );
};
