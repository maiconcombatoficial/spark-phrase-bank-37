/**
 * Utilitários para testar acessibilidade em desenvolvimento
 */

import { validateAccessibility } from './accessibility';

/**
 * Executa testes de acessibilidade na página atual
 */
export const runAccessibilityTests = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.group('🔍 Teste de Acessibilidade');
  
  const issues = validateAccessibility(document.body);
  
  if (issues.length === 0) {
    console.log('✅ Nenhum problema de acessibilidade detectado!');
  } else {
    console.warn('⚠️ Problemas encontrados:', issues);
  }
  
  // Testa navegação por teclado
  const focusableElements = document.querySelectorAll(
    'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
  ).length;
  
  console.log(`🎯 Elementos focáveis encontrados: ${focusableElements}`);
  
  // Verifica imagens sem alt
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])').length;
  if (imagesWithoutAlt > 0) {
    console.warn(`🖼️ ${imagesWithoutAlt} imagens sem texto alternativo`);
  }
  
  // Verifica headings hierarquia
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  if (headings.length > 0) {
    const h1Count = document.querySelectorAll('h1').length;
    if (h1Count !== 1) {
      console.warn(`📑 Página deve ter exatamente 1 H1 (encontrado: ${h1Count})`);
    }
  }
  
  console.groupEnd();
};

/**
 * Adiciona indicadores visuais para testes
 */
export const addAccessibilityIndicators = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  // Destaca elementos sem alt text adequado
  const style = document.createElement('style');
  style.textContent = `
    img:not([alt]) {
      outline: 3px solid red !important;
    }
    img[alt=""] {
      outline: 3px solid orange !important;
    }
    button:not([aria-label]):empty {
      outline: 3px solid yellow !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('🎨 Indicadores de acessibilidade ativados');
};