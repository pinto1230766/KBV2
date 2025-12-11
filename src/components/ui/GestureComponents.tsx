import React, { useState } from 'react';
import { useDrag, useGesture } from '@use-gesture/react';
import { cn } from '@/utils/cn';
import '@/styles/GestureComponents.css';

interface SwipeAction {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  action: () => void;
}

interface SwipeableRowProps {
  children: React.ReactNode;
  actions: SwipeAction[];
  className?: string;
  disabled?: boolean;
  threshold?: number;
}

export function SwipeableRow({
  children,
  actions,
  className,
  disabled = false,
  threshold = 100
}: SwipeableRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const bind = useDrag(
    ({ movement: [mx], direction: [xDir], cancel }) => {
      if (disabled) {
        cancel();
        return;
      }

      const isLeft = xDir < 0;
      const shouldOpen = isLeft && Math.abs(mx) > threshold;
      const shouldClose = (!isLeft && mx > 0) || Math.abs(mx) < 20;

      if (shouldOpen && !isOpen) {
        setIsOpen(true);
      } else if (shouldClose && isOpen) {
        setIsOpen(false);
      }
    },
    {
      axis: 'x',
      filterTaps: true,
      rubberband: true,
    }
  );

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      {...bind()}
    >
      {/* Background Actions */}
      <div className="absolute inset-y-0 right-0 flex">
        {actions.map((action, index) => (
          <button
            key={action.id}
            onClick={action.action}
            type="button"
            className={cn(
              "swipeable-action",
              action.color,
              `swipeable-action-width-${index + 1}`
            )}
          >
            <action.icon className="w-5 h-5 mr-2" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "relative bg-white dark:bg-gray-800 transition-transform duration-200 ease-out",
          isOpen ? "transform -translate-x-20" : ""
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Composant pour les gestes de pinch/zoom
interface PinchZoomProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  className?: string;
}

export function PinchZoom({
  children,
  minScale = 0.5,
  maxScale = 3,
  className
}: PinchZoomProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const bind = useGesture({
    onPinch: ({ offset: [scale] }) => {
      const clampedScale = Math.max(minScale, Math.min(maxScale, scale));
      setScale(clampedScale);
    },
    onDrag: ({ offset: [x, y] }) => {
      setPosition({ x, y });
    },
  }, {
    pinch: { scaleBounds: { min: minScale, max: maxScale } },
    drag: { filterTaps: true },
  });

  return (
    <div
      {...bind()}
      className={cn("pinch-zoom-container", className)}
    >
      <div
        className={cn("pinch-zoom-content", scale !== 1 ? "zoomed" : "")}
        style={{ transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)` }}
      >
        {children}
      </div>
    </div>
  );
}

// Composant pour les zones tactiles optimisées
interface TouchZoneProps {
  children: React.ReactNode;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  className?: string;
  disabled?: boolean;
  longPressDelay?: number;
}

export function TouchZone({
  children,
  onTap,
  onDoubleTap,
  onLongPress,
  className,
  disabled = false,
  longPressDelay = 500
}: TouchZoneProps) {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const bind = useGesture({
    onClick: ({ event }) => {
      event.preventDefault();
      if (disabled) return;

      if (onTap) {
        onTap();
      }
    },
    onDoubleClick: ({ event }) => {
      event.preventDefault();
      if (disabled) return;

      if (onDoubleTap) {
        onDoubleTap();
      }
    },
    onPointerDown: () => {
      if (disabled || !onLongPress) return;

      const timer = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
      setLongPressTimer(timer);
    },
    onPointerUp: () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    },
    onPointerCancel: () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    },
  });

  return (
    <div
      {...bind()}
      className={cn("touch-zone", disabled ? "disabled" : "", className)}
    >
      {children}
    </div>
  );
}

// Hook pour détecter les gestes de pull-to-refresh
interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  disabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  disabled = false
}: PullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [canPull, setCanPull] = useState(false);

  const bind = useDrag(
    ({ movement: [, my], direction: [, yDir], last }) => {
      if (disabled || isRefreshing) {
        setCanPull(false);
        setPullDistance(0);
        return;
      }

      // Détecter si on peut pull (en haut de la page)
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setCanPull(scrollTop <= 0);

      if (canPull && yDir > 0) {
        // Effet de rubber band
        const distance = Math.max(0, my * 0.5);
        setPullDistance(distance);

        if (last && distance > threshold) {
          // Trigger refresh
          setIsRefreshing(true);
          const refreshResult = onRefresh();
          if (refreshResult && typeof refreshResult.then === 'function') {
            refreshResult.finally(() => {
              setIsRefreshing(false);
              setPullDistance(0);
              setCanPull(false);
            });
          } else {
            setIsRefreshing(false);
            setPullDistance(0);
            setCanPull(false);
          }
        } else if (last) {
          // Reset si pas assez loin
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
    },
    {
      axis: 'y',
      rubberband: true,
    }
  );

  return {
    bind,
    isRefreshing,
    pullDistance,
    canPull: canPull && !disabled && !isRefreshing,
  };
}

// Composant PullToRefresh avec indicateur visuel
interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
  className
}: PullToRefreshProps) {
  const { bind, isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh,
    threshold,
    disabled
  });

  return (
    <div
      {...bind()}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Indicateur de pull-to-refresh */}
      <div
        className={cn(
          "pull-to-refresh-indicator",
          pullDistance > 0 ? "opacity-100" : "opacity-0",
          pullDistance > 0 ? "active" : ""
        )}
        style={{ height: Math.min(pullDistance, threshold + 20), transform: `translateY(${pullDistance > 0 ? -Math.min(pullDistance, threshold + 20) + 20 : 0}px)` }}
      >
        <div className="flex items-center space-x-2">
          <div className={cn(
            "pull-to-refresh-spinner",
            pullDistance > threshold ? "animate" : "",
            isRefreshing ? "animate" : ""
          )} />
          <span className="pull-to-refresh-text">
            {isRefreshing ? 'Actualisation...' : pullDistance > threshold ? 'Relâchez pour actualiser' : 'Tirez pour actualiser'}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div
        className={cn("pull-to-refresh-content", className)}
      >
        {children}
      </div>
    </div>
  );
}

export default {
  SwipeableRow,
  PinchZoom,
  TouchZone,
  PullToRefresh,
  usePullToRefresh
};
