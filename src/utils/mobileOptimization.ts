// Mobile Performance Optimization Utilities

// Debounce utility for search and filter inputs
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for scroll and resize events
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Intersection Observer for lazy loading (progressive enhancement)
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  if (typeof IntersectionObserver === 'undefined') {
    // Fallback for browsers without IntersectionObserver
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Virtual scrolling helper for large lists
export interface VirtualItem {
  index: number;
  start: number;
  end: number;
}

export function calculateVirtualItems(
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  overscan: number = 5
): VirtualItem[] {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
    Infinity
  );

  return [
    {
      index: Math.max(startIndex - overscan, 0),
      start: Math.max(startIndex - overscan, 0) * itemHeight,
      end: startIndex * itemHeight,
    },
    ...Array.from({ length: endIndex - startIndex }, (_, i) => ({
      index: startIndex + i,
      start: (startIndex + i) * itemHeight,
      end: (startIndex + i + 1) * itemHeight,
    })),
    {
      index: endIndex,
      start: endIndex * itemHeight,
      end: endIndex * itemHeight + containerHeight,
    },
  ];
}

// Memory management utilities
export function isLowMemoryDevice(): boolean {
  // Check for low-end devices based on available memory and cores
  if ('deviceMemory' in navigator) {
    return (navigator as any).deviceMemory <= 2;
  }

  // Fallback based on hardwareConcurrency
  if ('hardwareConcurrency' in navigator) {
    return (navigator as any).hardwareConcurrency <= 2;
  }

  return false;
}

export function getOptimalListHeight(): number {
  return isLowMemoryDevice() ? 400 : 600;
}

// Performance monitoring
export function measurePerformance<T>(name: string, fn: () => T): T {
  if (typeof performance === 'undefined') {
    return fn();
  }

  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`${name} took ${end - start} milliseconds`);
  return result;
}

// React Native-like performance utilities
export const AnimationFrame = {
  cancel: (id: number) => {
    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(id);
    }
  },
  request: (callback: FrameRequestCallback): number => {
    if (typeof requestAnimationFrame === 'function') {
      return requestAnimationFrame(callback);
    }
    // Fallback for older browsers
    return setTimeout(() => callback(performance.now()), 16) as any;
  },
};

// Touch gesture detection for mobile
export function detectSwipeDirection(
  touchStart: Touch,
  touchEnd: Touch,
  threshold: number = 50
): 'left' | 'right' | 'up' | 'down' | null {
  const deltaX = touchEnd.clientX - touchStart.clientX;
  const deltaY = touchEnd.clientY - touchStart.clientY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (Math.abs(deltaX) > threshold) {
      return deltaX > 0 ? 'right' : 'left';
    }
  } else {
    if (Math.abs(deltaY) > threshold) {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  return null;
}

// Safe storage operations with fallback
export const SafeStorage = {
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('SafeStorage.get failed:', error);
      return null;
    }
  },
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('SafeStorage.set failed:', error);
      return false;
    }
  },
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('SafeStorage.remove failed:', error);
      return false;
    }
  },
};

// Network status detection
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// Progressive loading for images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Battery optimization hints
export function isLowPowerMode(): boolean {
  // Check if user prefers reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  // Check for battery-saving mode (when available)
  if ('getBattery' in navigator) {
    (navigator as any)
      .getBattery()
      .then((battery: any) => battery.level < 0.2 && !battery.charging)
      .catch(() => false);
  }

  return false;
}
