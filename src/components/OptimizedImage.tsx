import LazyImage from './LazyImage';
import { generateContextualImageAlt } from '@/utils/accessibility';

interface OptimizedImageProps {
  src: string;
  alt?: string;
  type?: 'avatar' | 'illustration' | 'icon' | 'decorative' | 'content';
  context: string;
  details?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fallbackSrc?: string;
}

/**
 * Componente de imagem otimizada que combina LazyImage com alt text inteligente
 * Garante performance e acessibilidade
 */
const OptimizedImage = ({
  src,
  alt,
  type = 'content',
  context,
  details,
  className,
  width,
  height,
  priority = false,
  fallbackSrc,
  ...props
}: OptimizedImageProps) => {
  // Gera alt text automaticamente se não fornecido
  const accessibleAlt = alt || generateContextualImageAlt(type, context, details);

  return (
    <LazyImage
      src={src}
      alt={accessibleAlt}
      className={className}
      width={width}
      height={height}
      priority={priority}
      fallbackSrc={fallbackSrc}
      context={context}
      {...props}
    />
  );
};

export default OptimizedImage;