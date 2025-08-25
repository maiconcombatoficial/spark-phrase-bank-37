/**
 * Utilitários para validação e sanitização de inputs
 * Focado em segurança e prevenção de erros
 */

// Regex patterns para validação
const PATTERNS = {
  // Permite apenas caracteres alfanuméricos, espaços, acentos e pontuação básica
  SAFE_SEARCH: /^[a-zA-ZÀ-ÿ0-9\s\-.,;:!?'"()\[\]{}@#$%&*+=<>\/\\]*$/,
  // Remove caracteres potencialmente perigosos
  DANGEROUS_CHARS: /[<>"{}\[\]\\]/g,
  // Detecta tentativas de script injection
  SCRIPT_INJECTION: /<script[^>]*>.*?<\/script>/gi,
  // Detecta SQL injection básica
  SQL_INJECTION: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
} as const;

// Configurações de validação
const VALIDATION_CONFIG = {
  MAX_SEARCH_LENGTH: 200,
  MIN_SEARCH_LENGTH: 1,
  MAX_FILTER_LENGTH: 100,
  RATE_LIMIT_MS: 300, // Debounce para buscas
} as const;

/**
 * Sanitiza texto removendo caracteres potencialmente perigosos
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(PATTERNS.DANGEROUS_CHARS, '')
    .replace(PATTERNS.SCRIPT_INJECTION, '')
    .substring(0, VALIDATION_CONFIG.MAX_SEARCH_LENGTH);
};

/**
 * Valida se o input é seguro para busca
 */
export const validateSearchInput = (input: string): {
  isValid: boolean;
  error?: string;
  sanitized: string;
} => {
  if (typeof input !== 'string') {
    return {
      isValid: false,
      error: 'Input deve ser uma string',
      sanitized: ''
    };
  }

  const sanitized = sanitizeInput(input);

  // Verifica tamanho
  if (sanitized.length === 0 && input.length > 0) {
    return {
      isValid: false,
      error: 'Texto contém caracteres não permitidos',
      sanitized: ''
    };
  }

  if (sanitized.length > VALIDATION_CONFIG.MAX_SEARCH_LENGTH) {
    return {
      isValid: false,
      error: `Busca muito longa. Máximo ${VALIDATION_CONFIG.MAX_SEARCH_LENGTH} caracteres`,
      sanitized: sanitized.substring(0, VALIDATION_CONFIG.MAX_SEARCH_LENGTH)
    };
  }

  // Verifica padrões perigosos
  if (PATTERNS.SQL_INJECTION.test(sanitized)) {
    return {
      isValid: false,
      error: 'Texto contém caracteres não permitidos',
      sanitized: sanitized.replace(PATTERNS.SQL_INJECTION, '')
    };
  }

  // Verifica se contém apenas caracteres seguros
  if (!PATTERNS.SAFE_SEARCH.test(sanitized)) {
    return {
      isValid: false,
      error: 'Texto contém caracteres especiais não permitidos',
      sanitized: sanitized.replace(/[^a-zA-ZÀ-ÿ0-9\s\-.,;:!?'"()@#$%&*+=<>\/\\]/g, '')
    };
  }

  return {
    isValid: true,
    sanitized
  };
};

/**
 * Normaliza texto para busca (remove acentos, converte para minúsculo)
 */
export const normalizeForSearch = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .trim();
};

/**
 * Escapa caracteres especiais para regex
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Valida filtros de autor/livro
 */
export const validateFilterInput = (input: string): {
  isValid: boolean;
  error?: string;
  sanitized: string;
} => {
  if (typeof input !== 'string') {
    return {
      isValid: false,
      error: 'Filtro deve ser uma string',
      sanitized: ''
    };
  }

  const sanitized = sanitizeInput(input);

  if (sanitized.length > VALIDATION_CONFIG.MAX_FILTER_LENGTH) {
    return {
      isValid: false,
      error: `Filtro muito longo. Máximo ${VALIDATION_CONFIG.MAX_FILTER_LENGTH} caracteres`,
      sanitized: sanitized.substring(0, VALIDATION_CONFIG.MAX_FILTER_LENGTH)
    };
  }

  return {
    isValid: true,
    sanitized
  };
};

/**
 * Rate limiting simples para buscas
 */
export class SearchRateLimit {
  private lastSearch: number = 0;
  private searchCount: number = 0;
  private resetTime: number = Date.now();

  canSearch(): boolean {
    const now = Date.now();
    
    // Reset counter a cada minuto
    if (now - this.resetTime > 60000) {
      this.searchCount = 0;
      this.resetTime = now;
    }

    // Máximo 100 buscas por minuto
    if (this.searchCount >= 100) {
      return false;
    }

    // Debounce básico
    if (now - this.lastSearch < VALIDATION_CONFIG.RATE_LIMIT_MS) {
      return false;
    }

    this.lastSearch = now;
    this.searchCount++;
    return true;
  }
}

/**
 * Instância global do rate limiter
 */
export const searchRateLimit = new SearchRateLimit();

/**
 * Hook para debounce de busca com validação
 */
export const useValidatedSearch = (
  callback: (term: string) => void,
  delay: number = VALIDATION_CONFIG.RATE_LIMIT_MS
) => {
  let timeoutId: NodeJS.Timeout;

  return (input: string) => {
    clearTimeout(timeoutId);
    
    const validation = validateSearchInput(input);
    
    if (!validation.isValid && validation.sanitized.length === 0) {
      return; // Ignora inputs inválidos
    }

    timeoutId = setTimeout(() => {
      if (searchRateLimit.canSearch()) {
        callback(validation.sanitized);
      }
    }, delay);
  };
};