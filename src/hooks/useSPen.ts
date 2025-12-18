import { useState, useEffect } from 'react';
import { usePlatformContext } from '@/contexts/PlatformContext';

interface SPenState {
  isHovering: boolean;
  isActive: boolean;
  position: { x: number; y: number } | null;
  pressure: number;
}

export const useSPen = () => {
  const { hasSPen } = usePlatformContext();
  const [sPenState, setSPenState] = useState<SPenState>({
    isHovering: false,
    isActive: false,
    position: null,
    pressure: 0,
  });

  useEffect(() => {
    if (!hasSPen) return;

    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        setSPenState((prev) => ({
          ...prev,
          isHovering: true,
          position: { x: e.clientX, y: e.clientY },
        }));
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        setSPenState((prev) => ({
          ...prev,
          isHovering: true,
          position: { x: e.clientX, y: e.clientY },
          pressure: e.pressure,
        }));
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        setSPenState((prev) => ({
          ...prev,
          isActive: true,
          pressure: e.pressure,
        }));
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        setSPenState((prev) => ({
          ...prev,
          isActive: false,
          pressure: 0,
        }));
      }
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        setSPenState({
          isHovering: false,
          isActive: false,
          position: null,
          pressure: 0,
        });
      }
    };

    document.addEventListener('pointerenter', handlePointerEnter as any);
    document.addEventListener('pointermove', handlePointerMove as any);
    document.addEventListener('pointerdown', handlePointerDown as any);
    document.addEventListener('pointerup', handlePointerUp as any);
    document.addEventListener('pointerleave', handlePointerLeave as any);

    return () => {
      document.removeEventListener('pointerenter', handlePointerEnter as any);
      document.removeEventListener('pointermove', handlePointerMove as any);
      document.removeEventListener('pointerdown', handlePointerDown as any);
      document.removeEventListener('pointerup', handlePointerUp as any);
      document.removeEventListener('pointerleave', handlePointerLeave as any);
    };
  }, [hasSPen]);

  return {
    hasSPen,
    ...sPenState,
  };
};
