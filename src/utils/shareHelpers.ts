// Utility functions for sharing functionality

export const isMobileDevice = (): boolean => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isWebShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

export const isClipboardSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'clipboard' in navigator && 'writeText' in navigator.clipboard;
};

export const getWhatsAppShareUrl = (text: string): string => {
  const encodedText = encodeURIComponent(text);
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    return `whatsapp://send?text=${encodedText}`;
  } else {
    return `https://web.whatsapp.com/send?text=${encodedText}`;
  }
};

export const getSocialShareUrls = (text: string, url: string) => {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
    whatsapp: getWhatsAppShareUrl(text),
  };
};

export const generateShareableText = (
  phraseText: string, 
  author: string, 
  appUrl: string = "https://sparkphrasebank.com"
): string => {
  return `Frase inspiradora do App de Frases Motivacionais e Resumos de Livros: "${phraseText}" - ${author}. Baixe o app para mais motivação diária e crescimento pessoal! Acesse em ${appUrl}`;
};

export const openShareWindow = (url: string): void => {
  const features = 'width=600,height=400,scrollbars=yes,resizable=yes';
  window.open(url, '_blank', features);
};

// Test if device supports file sharing
export const canShareFiles = (): boolean => {
  return isWebShareSupported() && typeof navigator.canShare === 'function';
};

// Analytics helper for share events
export const trackShareEvent = async (
  phraseId: number, 
  method: string, 
  source: string = 'unknown'
): Promise<void> => {
  try {
    // Log to analytics service or backend
    const eventData = {
      event: 'phrase_shared',
      phraseId,
      method,
      source,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Send to backend analytics endpoint
    fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    }).catch(error => {
      console.warn('Failed to track share event:', error);
    });

    // You could also send to Google Analytics, Mixpanel, etc.
    // gtag('event', 'share', { ...eventData });
    
  } catch (error) {
    console.warn('Error tracking share event:', error);
  }
};