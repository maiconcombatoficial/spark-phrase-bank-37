import { useLazyImage } from '@/hooks/useLazyImage';
import { generateImageAlt } from '@/utils/accessibility';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallbackSrc?: string;
  context?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * Componente de imagem otimizada com lazy loading e fallbacks
 * Melhora performance e acessibilidade
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholder,
  fallbackSrc = '/placeholder.svg',
  context = 'conteúdo',
  loading = 'lazy',
  onLoad,
  onError,
  width,
  height,
  priority = false
}) => {
  const { imageSrc, isLoaded, hasError, imageRef } = useLazyImage({
    src,
    placeholder,
    rootMargin: priority ? '200px' : '50px',
    threshold: 0.1
  });

  // Gera alt text acessível se necessário
  const accessibleAlt = alt || generateImageAlt(context);

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        ref={imageRef}
        src={hasError && fallbackSrc ? fallbackSrc : imageSrc}
        alt={accessibleAlt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          "w-full h-full object-cover"
        )}
        style={{
          ...(width && height && {
            aspectRatio: `${width} / ${height}`
          })
        }}
        // Atributos de acessibilidade
        role="img"
        aria-label={accessibleAlt}
        tabIndex={-1}
      />
      
      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
          aria-label="Carregando imagem"
          role="status"
        >
          <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-muted/50 flex items-center justify-center text-muted-foreground"
          aria-label="Erro ao carregar imagem"
          role="alert"
        >
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 mx-auto mb-2 opacity-50"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
              <path d="M8 8a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <p className="text-xs">Imagem não disponível</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;