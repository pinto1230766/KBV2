/**
 * Composant LazyImage avec optimisation des images
 * KBV Lyon - Phase 8.1 Gestion Images
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholder?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  aspectRatio?: string;
  priority?: boolean;
  zoomable?: boolean;
  zoomScale?: number;
}

interface ImageFormats {
  webp?: string;
  avif?: string;
  jpg: string;
  png?: string;
}

/**
 * Détection du support des formats modernes
 */
const getSupportedFormat = (formats: ImageFormats): string => {
  if (typeof window === 'undefined') return formats.jpg;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');

  if (!ctx) return formats.jpg;

  const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  const supportsAVIF = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;

  if (supportsAVIF && formats.avif) return formats.avif;
  if (supportsWebP && formats.webp) return formats.webp;

  return formats.jpg;
};

/**
 * Génération des URLs optimisées selon le device
 */
const generateOptimizedUrls = (originalUrl: string, quality: number = 75): ImageFormats => {
  const baseUrl = originalUrl.replace(/\.[^/.]+$/, '');

  return {
    webp: `${baseUrl}.webp?q=${quality}`,
    avif: `${baseUrl}.avif?q=${quality}`,
    jpg: `${baseUrl}.jpg?q=${quality}`,
    png: `${baseUrl}.png?q=${quality}`,
  };
};

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  fallback = '/placeholder.jpg',
  placeholder = '/placeholder-blur.jpg',
  quality = 75,
  loading = 'lazy',
  sizes,
  onLoad,
  onError,
  aspectRatio,
  priority = false,
  zoomable = false,
  zoomScale = 2,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!priority && loading === 'lazy');
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Génération des URLs optimisées
  const optimizedFormats = generateOptimizedUrls(src, quality);
  const supportedSrc = getSupportedFormat(optimizedFormats);

  // Intersection Observer pour lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Chargement de l'image
  useEffect(() => {
    if (!isInView || isLoaded || hasError) return;

    const img = new Image();

    img.onload = () => {
      setCurrentSrc(supportedSrc);
      setIsLoaded(true);
      onLoad?.();
    };

    img.onerror = () => {
      setHasError(true);
      setCurrentSrc(fallback);
      onError?.();
    };

    img.src = supportedSrc;
  }, [isInView, isLoaded, hasError, supportedSrc, fallback, onLoad, onError]);

  // Styles responsifs selon la taille d'écran
  const getResponsiveSrc = () => {
    if (typeof window === 'undefined') return currentSrc;

    const width = window.innerWidth;

    if (width < 640) return `${currentSrc}&w=400`;
    if (width < 768) return `${currentSrc}&w=600`;
    if (width < 1024) return `${currentSrc}&w=800`;
    return `${currentSrc}&w=1200`;
  };

  const finalSrc = isLoaded ? getResponsiveSrc() : placeholder;

  // Gestion du zoom
  const handleZoomToggle = () => {
    if (!zoomable || !isLoaded) return;
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isZoomed || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-gray-100',
        aspectRatio && `aspect-[${aspectRatio}]`,
        zoomable && 'cursor-zoom-in',
        isZoomed && 'cursor-grab',
        className
      )}
      onClick={handleZoomToggle}
      onMouseMove={handleMouseMove}
    >
      {/* Image principale */}
      <img
        ref={imgRef}
        src={finalSrc}
        alt={alt}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-all duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          isZoomed && `scale-[${zoomScale}]`
        )}
        style={
          isZoomed
            ? {
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: `scale(${zoomScale})`,
              }
            : undefined
        }
        loading={priority ? 'eager' : loading}
        sizes={sizes}
        decoding='async'
      />

      {/* Skeleton loader pendant le chargement */}
      {!isLoaded && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse'>
          <div className='w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin' />
        </div>
      )}

      {/* État d'erreur */}
      {hasError && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-200'>
          <div className='text-center text-gray-500'>
            <svg
              className='w-8 h-8 mx-auto mb-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            <p className='text-sm'>Image non disponible</p>
          </div>
        </div>
      )}

      {/* Indicateur de zoom */}
      {zoomable && isLoaded && !hasError && (
        <div className='absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1'>
          <svg
            className='w-3 h-3'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
          {isZoomed ? `Zoom ${zoomScale}x` : 'Cliquer pour zoomer'}
        </div>
      )}

      {/* Instructions de zoom */}
      {isZoomed && (
        <div className='absolute bottom-2 left-2 bg-black/50 text-white px-3 py-2 rounded text-xs'>
          Déplacez la souris pour explorer • Clic pour quitter
        </div>
      )}
    </div>
  );
};

/**
 * Hook pour l'optimisation automatique des images
 */
export const useImageOptimization = () => {
  const [imageCache, setImageCache] = useState<Map<string, string>>(new Map());

  const optimizeImageUrl = (
    url: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'avif' | 'jpg' | 'png';
    } = {}
  ): string => {
    const { width, height, quality = 75, format } = options;

    // Génération d'un hash pour la clé de cache
    const cacheKey = `${url}-${width}x${height}-q${quality}-${format}`;

    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey)!;
    }

    // Construction de l'URL optimisée
    const baseUrl = url.replace(/\.[^/.]+$/, '');
    const extension = format || 'jpg';

    let optimizedUrl = `${baseUrl}.${extension}`;
    const params = new URLSearchParams();

    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality) params.append('q', quality.toString());

    if (params.toString()) {
      optimizedUrl += `?${params.toString()}`;
    }

    // Mise en cache
    setImageCache((prev) => new Map(prev).set(cacheKey, optimizedUrl));

    return optimizedUrl;
  };

  const preloadImage = (url: string) => {
    const img = new Image();
    img.src = url;
  };

  return {
    optimizeImageUrl,
    preloadImage,
    imageCache,
  };
};

export default LazyImage;
