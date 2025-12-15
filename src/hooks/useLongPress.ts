import { useState, useEffect, useCallback, useRef } from 'react';

interface LongPressOptions {
  onLongPress: () => void;
  delay?: number;
}

export const useLongPress = (options: LongPressOptions) => {
  const { onLongPress, delay = 500 } = options;
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsLongPressing(true);
    
    timerRef.current = setTimeout(() => {
      onLongPress();
      setIsLongPressing(false);
    }, delay);
  }, [onLongPress, delay]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLongPressing(false);
  }, []);

  useEffect(() => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }, []);

  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: cancel,
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    isLongPressing,
  };
};
