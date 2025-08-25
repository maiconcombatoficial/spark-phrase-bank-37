import { useState, useEffect, useRef } from 'react';

interface UseLazyImageProps {
  src: string;
  placeholder?: string;
  rootMargin?: string;
  threshold?: number;
}

interface UseLazyImageReturn {
  imageSrc: string;
  isLoaded: boolean;
  hasError: boolean;
  imageRef: React.RefObject<HTMLImageElement>;
}

/**
 * Hook para lazy loading de imagens com IntersectionObserver
 * Melhora performance carregando imagens apenas quando necessário
 */
export const useLazyImage = ({
  src,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMzYgNzJIMTg0VjEwOEgxMzZWNzJaIiBmaWxsPSIjQ0ZENEY5Ii8+CjxwYXRoIGQ9Ik0xNjAgOTZMMTQ4IDg0SDE3MkwxNjAgOTZaIiBmaWxsPSIjOUNBM0FGIi8+CjwvcmVnPgo8L3N2Zz4K',
  rootMargin = '50px',
  threshold = 0.1
}: UseLazyImageProps): UseLazyImageReturn => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Intersection Observer para detectar quando a imagem está visível
  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    // Se IntersectionObserver não estiver disponível, carrega imediatamente
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(imageElement);

    return () => {
      observer.unobserve(imageElement);
    };
  }, [rootMargin, threshold]);

  // Carrega a imagem quando shouldLoad for true
  useEffect(() => {
    if (!shouldLoad || !src) return;

    setHasError(false);
    
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    imageLoader.onerror = () => {
      setHasError(true);
      setIsLoaded(false);
    };
    
    imageLoader.src = src;

    return () => {
      imageLoader.onload = null;
      imageLoader.onerror = null;
    };
  }, [shouldLoad, src]);

  return {
    imageSrc,
    isLoaded,
    hasError,
    imageRef
  };
};

/**
 * Hook para preload de imagens críticas
 */
export const useImagePreload = (sources: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (sources.length === 0) return;

    const loadImage = (src: string) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
      });
    };

    const loadAllImages = async () => {
      for (const src of sources) {
        try {
          await loadImage(src);
          setLoadedImages(prev => new Set(prev).add(src));
        } catch (failedSrc) {
          setFailedImages(prev => new Set(prev).add(failedSrc as string));
        }
      }
    };

    loadAllImages();
  }, [sources]);

  return {
    loadedImages,
    failedImages,
    isLoaded: (src: string) => loadedImages.has(src),
    hasFailed: (src: string) => failedImages.has(src)
  };
};