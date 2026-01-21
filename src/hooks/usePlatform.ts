import { useState, useEffect } from 'react';

export type Platform = 'ios' | 'android' | 'web';
export type DeviceType = 'phone' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

interface PlatformInfo {
  platform: Platform;
  deviceType: DeviceType;
  screenSize: {
    width: number;
    height: number;
  };
  orientation: Orientation;
  isSamsung: boolean;
  hasSPen: boolean;
  isTabletS10Ultra: boolean;
  isPhoneS25Ultra: boolean;
}

export const usePlatform = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(() => detectPlatform());

  useEffect(() => {
    const handleResize = () => {
      setPlatformInfo(detectPlatform());
    };

    const handleOrientationChange = () => {
      setPlatformInfo(detectPlatform());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return platformInfo;
};

function detectPlatform(): PlatformInfo {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Détection de la plateforme
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  const isAndroid = /android/i.test(userAgent);
  const isSamsung = /samsung/i.test(userAgent) || /SM-/i.test(userAgent);

  // Détection du S Pen (via PointerEvent)
  const hasSPen =
    'PointerEvent' in window &&
    (userAgent.includes('SM-X926') || // Tab S10 Ultra
      userAgent.includes('SM-S938')); // S25 Ultra

  // Détection des modèles spécifiques Samsung
  const isTabletS10Ultra =
    userAgent.includes('SM-X926') ||
    (isSamsung && width >= 1848 && height >= 2960) ||
    (isSamsung && width >= 2960 && height >= 1848);

  const isPhoneS25Ultra =
    userAgent.includes('SM-S938') ||
    (isSamsung && width >= 1440 && width <= 1440 && height >= 3120);

  // Détection du type d'appareil basé sur la taille d'écran
  // En paysage, on utilise la hauteur pour détecter car la largeur peut être réduite par le scaling
  const minDimension = Math.min(width, height);
  const maxDimension = Math.max(width, height);

  let deviceType: DeviceType = 'desktop';

  // Si la plus grande dimension est > 1000px, c'est une tablette
  if (maxDimension >= 1000) {
    deviceType = 'tablet';
  } else if (minDimension < 600) {
    deviceType = 'phone';
  } else {
    deviceType = 'tablet';
  }

  // Override pour les appareils Samsung spécifiques
  if (isTabletS10Ultra) {
    deviceType = 'tablet';
  } else if (isPhoneS25Ultra) {
    deviceType = 'phone';
  }

  // Détection de l'orientation
  const orientation: Orientation = width > height ? 'landscape' : 'portrait';

  // Déterminer la plateforme
  let platform: Platform = 'web';
  if (isIOS) {
    platform = 'ios';
  } else if (isAndroid) {
    platform = 'android';
  }

  return {
    platform,
    deviceType,
    screenSize: { width, height },
    orientation,
    isSamsung,
    hasSPen,
    isTabletS10Ultra,
    isPhoneS25Ultra,
  };
}
