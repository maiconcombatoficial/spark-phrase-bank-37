/**
 * Utilitários para melhorar acessibilidade
 * Focado em navegação por teclado, ARIA labels e semântica
 */

/**
 * Gerencia foco para navegação por teclado
 */
export class FocusManager {
  private focusableSelectors = [
    'button',
    'input',
    'select',
    'textarea',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(',');

  /**
   * Encontra todos os elementos focáveis dentro de um container
   */
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableSelectors))
      .filter(el => !el.hasAttribute('disabled') && (el as HTMLElement).offsetParent !== null) as HTMLElement[];
  }

  /**
   * Move o foco para o próximo elemento
   */
  focusNext(currentElement: HTMLElement, container?: HTMLElement): boolean {
    const root = container || document.body;
    const focusableElements = this.getFocusableElements(root);
    const currentIndex = focusableElements.indexOf(currentElement);
    
    if (currentIndex === -1) return false;
    
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
    return true;
  }

  /**
   * Move o foco para o elemento anterior
   */
  focusPrevious(currentElement: HTMLElement, container?: HTMLElement): boolean {
    const root = container || document.body;
    const focusableElements = this.getFocusableElements(root);
    const currentIndex = focusableElements.indexOf(currentElement);
    
    if (currentIndex === -1) return false;
    
    const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    focusableElements[previousIndex]?.focus();
    return true;
  }

  /**
   * Foca o primeiro elemento focável
   */
  focusFirst(container: HTMLElement): boolean {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      return true;
    }
    return false;
  }

  /**
   * Foca o último elemento focável
   */
  focusLast(container: HTMLElement): boolean {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
      return true;
    }
    return false;
  }
}

export const focusManager = new FocusManager();

/**
 * Hook para navegação por teclado em listas
 */
export const useKeyboardNavigation = (
  items: any[],
  onSelect: (index: number) => void,
  container?: React.RefObject<HTMLElement>
) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event;
    const activeElement = document.activeElement as HTMLElement;
    const containerEl = container?.current || document.body;

    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        focusManager.focusNext(activeElement, containerEl);
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        focusManager.focusPrevious(activeElement, containerEl);
        break;
      
      case 'Home':
        event.preventDefault();
        focusManager.focusFirst(containerEl);
        break;
      
      case 'End':
        event.preventDefault();
        focusManager.focusLast(containerEl);
        break;
      
      case 'Enter':
      case ' ':
        event.preventDefault();
        const focusableElements = focusManager.getFocusableElements(containerEl);
        const currentIndex = focusableElements.indexOf(activeElement);
        if (currentIndex !== -1) {
          onSelect(currentIndex);
        }
        break;
      
      case 'Escape':
        event.preventDefault();
        activeElement.blur();
        break;
    }
  };

  return { handleKeyDown };
};

/**
 * Gera IDs únicos para elementos
 */
export const generateId = (prefix = 'element'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Cria atributos ARIA para campos de busca
 */
export const getSearchAriaAttributes = (
  resultsCount: number,
  isLoading = false,
  hasError = false
) => ({
  'aria-label': 'Campo de busca',
  'aria-describedby': 'search-instructions',
  'aria-expanded': resultsCount > 0,
  'aria-busy': isLoading,
  'aria-invalid': hasError,
  'role': 'searchbox',
  'aria-autocomplete': 'list' as const
});

/**
 * Cria atributos ARIA para resultados de busca
 */
export const getSearchResultsAriaAttributes = (
  resultsCount: number,
  searchTerm: string
) => ({
  'aria-label': `${resultsCount} resultados encontrados para "${searchTerm}"`,
  'aria-live': 'polite' as const,
  'aria-atomic': 'false' as const,
  'role': 'region'
});

/**
 * Cria atributos ARIA para cards de conteúdo
 */
export const getCardAriaAttributes = (
  title: string,
  description?: string,
  index?: number
) => ({
  'aria-label': `${title}${description ? '. ' + description : ''}`,
  'role': 'article',
  'tabIndex': 0,
  ...(index !== undefined && { 'aria-posinset': index + 1 })
});

/**
 * Cria atributos ARIA para botões de ação
 */
export const getActionButtonAriaAttributes = (
  action: string,
  target?: string
) => ({
  'aria-label': `${action}${target ? ' ' + target : ''}`,
  'role': 'button',
  'aria-pressed': undefined as boolean | undefined
});

/**
 * Cria atributos ARIA para filtros
 */
export const getFilterAriaAttributes = (
  filterName: string,
  selectedCount: number,
  totalCount: number
) => ({
  'aria-label': `Filtro ${filterName}: ${selectedCount} de ${totalCount} selecionados`,
  'role': 'group',
  'aria-describedby': `${filterName}-description`
});

/**
 * Utilitário para anunciar mudanças aos leitores de tela
 */
export class ScreenReaderAnnouncer {
  private announceElement: HTMLElement | null = null;

  constructor() {
    this.createAnnounceElement();
  }

  private createAnnounceElement() {
    if (typeof document === 'undefined') return;

    this.announceElement = document.createElement('div');
    this.announceElement.setAttribute('aria-live', 'polite');
    this.announceElement.setAttribute('aria-atomic', 'true');
    this.announceElement.className = 'sr-only';
    this.announceElement.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    document.body.appendChild(this.announceElement);
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.announceElement) return;

    this.announceElement.setAttribute('aria-live', priority);
    this.announceElement.textContent = message;

    // Limpa após 1 segundo para não interferir com próximos anúncios
    setTimeout(() => {
      if (this.announceElement) {
        this.announceElement.textContent = '';
      }
    }, 1000);
  }
}

export const screenReaderAnnouncer = new ScreenReaderAnnouncer();

/**
 * Verifica se o usuário está navegando por teclado
 */
export const detectKeyboardNavigation = () => {
  let isUsingKeyboard = false;

  document.addEventListener('mousedown', () => {
    isUsingKeyboard = false;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isUsingKeyboard = true;
    }
  });

  return () => isUsingKeyboard;
};

/**
 * Adiciona indicadores visuais para navegação por teclado
 */
export const addKeyboardFocusIndicators = () => {
  const style = document.createElement('style');
  style.textContent = `
    .keyboard-focus-visible:focus {
      outline: 2px solid hsl(var(--primary)) !important;
      outline-offset: 2px !important;
    }
    
    .keyboard-focus-visible:focus:not(:focus-visible) {
      outline: none !important;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Cria descrições acessíveis para imagens
 */
export const generateImageAlt = (context: string, content?: string): string => {
  if (!content) return `Imagem relacionada a ${context}`;
  
  // Remove quebras de linha e limita tamanho
  const cleanContent = content.replace(/\n+/g, ' ').trim();
  const maxLength = 125; // Limite recomendado para alt text
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength - 3) + '...';
};

/**
 * Gera alt text otimizado para diferentes contextos
 */
export const generateContextualImageAlt = (
  type: 'avatar' | 'illustration' | 'icon' | 'decorative' | 'content',
  context: string,
  details?: string
): string => {
  const contextMap = {
    avatar: `Foto de perfil ${details ? `de ${details}` : context}`,
    illustration: `Ilustração ${details || context}`,
    icon: `Ícone ${details || context}`,
    decorative: '', // Decorative images should have empty alt
    content: details || `Imagem de conteúdo relacionada a ${context}`
  };
  
  return contextMap[type];
};

/**
 * Detecta e corrige problemas comuns de acessibilidade
 */
export const validateAccessibility = (element: HTMLElement): string[] => {
  const issues: string[] = [];
  
  // Verifica imagens sem alt text
  const images = element.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      issues.push(`Imagem ${index + 1} não possui texto alternativo (alt)`);
    }
  });
  
  // Verifica botões sem labels
  const buttons = element.querySelectorAll('button');
  buttons.forEach((btn, index) => {
    if (!btn.textContent?.trim() && !btn.hasAttribute('aria-label')) {
      issues.push(`Botão ${index + 1} não possui texto ou aria-label`);
    }
  });
  
  // Verifica contraste (básico)
  const style = getComputedStyle(element);
  if (style.color && style.backgroundColor) {
    // Implementação básica - em produção usaria uma biblioteca de contraste
    issues.push('Verificar contraste de cores manualmente');
  }
  
  return issues;
};