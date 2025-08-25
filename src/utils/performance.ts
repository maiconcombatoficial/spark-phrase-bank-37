/**
 * Utilitários para melhorar performance da aplicação
 */

/**
 * Debounce function para limitar frequência de execução
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Throttle function para limitar taxa de execução
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Preload de recursos críticos
 */
export const preloadResource = (
  href: string,
  as: 'script' | 'style' | 'image' | 'font' = 'image',
  crossorigin?: string
) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;
  
  document.head.appendChild(link);
  
  return () => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };
};

/**
 * Detecta se o usuário tem uma conexão lenta
 */
export const isSlowConnection = (): boolean => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
  }
  return false;
};

/**
 * Otimiza o carregamento baseado na conexão do usuário
 */
export const adaptToConnection = () => {
  const isSlow = isSlowConnection();
  return {
    shouldLazyLoad: isSlow,
    imageQuality: isSlow ? 'low' : 'high',
    preloadCount: isSlow ? 2 : 5
  };
};