import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { toPng } from "html-to-image";

interface ShareData {
  id: number;
  text: string;
  author: string;
  category?: string;
}

interface ShareOptions {
  includeImage?: boolean;
  appUrl?: string;
  source?: 'card' | 'detail' | 'favorite';
}

const useAdvancedShare = () => {
  const { toast } = useToast();

  const logShare = useCallback(async (phraseId: number, method: string, source?: string) => {
    try {
      // Log share event to backend for analytics
      await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phraseId,
          method,
          source,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.warn('Failed to log share event:', error);
    }
  }, []);

  const generateShareText = useCallback((data: ShareData, appUrl: string = "https://sparkphrasebank.com") => {
    return `Frase inspiradora do App de Frases Motivacionais e Resumos de Livros: "${data.text}" - ${data.author}. Baixe o app para mais motivação diária e crescimento pessoal! Acesse em ${appUrl}`;
  }, []);

  const captureCardAsImage = useCallback(async (cardElement: HTMLElement): Promise<Blob | null> => {
    try {
      // Hide action buttons temporarily for cleaner image
      const actionButtons = cardElement.querySelectorAll('[data-hide-in-image]');
      actionButtons.forEach(button => {
        (button as HTMLElement).style.display = 'none';
      });

      const dataUrl = await toPng(cardElement, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: 500,
        height: 300,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });

      // Restore action buttons
      actionButtons.forEach(button => {
        (button as HTMLElement).style.display = '';
      });

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      return await response.blob();
    } catch (error) {
      console.error('Failed to capture card as image:', error);
      return null;
    }
  }, []);

  const shareToWhatsApp = useCallback((text: string) => {
    const encodedText = encodeURIComponent(text);
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile: Use WhatsApp app
      window.open(`whatsapp://send?text=${encodedText}`, '_blank');
    } else {
      // Desktop: Use WhatsApp Web
      window.open(`https://web.whatsapp.com/send?text=${encodedText}`, '_blank');
    }
  }, []);

  const shareNatively = useCallback(async (
    data: ShareData, 
    options: ShareOptions = {},
    cardElement?: HTMLElement
  ) => {
    const { includeImage = false, appUrl, source = 'card' } = options;
    const shareText = generateShareText(data, appUrl);
    
    let shareData: any = {
      title: `Frase Inspiradora de ${data.author}`,
      text: shareText,
      url: appUrl || window.location.origin,
    };

    try {
      // Try to include image if requested and element provided
      if (includeImage && cardElement && navigator.canShare) {
        const imageBlob = await captureCardAsImage(cardElement);
        if (imageBlob) {
          const imageFile = new File([imageBlob], `frase-${data.id}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [imageFile] })) {
            shareData.files = [imageFile];
          }
        }
      }

      if (navigator.share) {
        await navigator.share(shareData);
        await logShare(data.id, 'native', source);
        
        toast({
          title: "Frase compartilhada com sucesso! 🎉",
          description: "Ajude a espalhar motivação!",
        });
        
        return true;
      } else {
        throw new Error('Native sharing not supported');
      }
    } catch (error) {
      console.warn('Native sharing failed, falling back to clipboard:', error);
      return false;
    }
  }, [generateShareText, captureCardAsImage, logShare, toast]);

  const copyToClipboard = useCallback(async (data: ShareData, options: ShareOptions = {}) => {
    const { source = 'card', appUrl } = options;
    const shareText = generateShareText(data, appUrl);

    try {
      await navigator.clipboard.writeText(shareText);
      await logShare(data.id, 'clipboard', source);

      toast({
        title: "Frase copiada! 📋",
        description: "A frase motivacional foi copiada para área de transferência.",
      });

      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a frase.",
        variant: "destructive",
      });

      return false;
    }
  }, [generateShareText, logShare, toast]);

  const shareAdvanced = useCallback(async (
    data: ShareData,
    options: ShareOptions = {},
    cardElement?: HTMLElement
  ) => {
    const { source = 'card' } = options;

    // Try native sharing first
    const nativeSuccess = await shareNatively(data, options, cardElement);
    
    if (!nativeSuccess) {
      // Fallback to clipboard
      await copyToClipboard(data, options);
    }
  }, [shareNatively, copyToClipboard]);

  const shareToSocialMedia = useCallback(async (
    data: ShareData,
    platform: 'whatsapp' | 'twitter' | 'facebook' | 'linkedin',
    options: ShareOptions = {}
  ) => {
    const { source = 'card', appUrl } = options;
    const shareText = generateShareText(data, appUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(appUrl || window.location.origin);

    const urls = {
      whatsapp: () => shareToWhatsApp(shareText),
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
    };

    try {
      if (platform === 'whatsapp') {
        urls.whatsapp();
      } else {
        window.open(urls[platform], '_blank', 'width=600,height=400');
      }

      await logShare(data.id, platform, source);

      toast({
        title: `Compartilhado no ${platform.charAt(0).toUpperCase() + platform.slice(1)}! 🚀`,
        description: "Ajude a espalhar motivação!",
      });
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      
      toast({
        title: "Erro ao compartilhar",
        description: `Não foi possível compartilhar no ${platform}.`,
        variant: "destructive",
      });
    }
  }, [generateShareText, shareToWhatsApp, logShare, toast]);

  return {
    shareAdvanced,
    shareToSocialMedia,
    shareNatively,
    copyToClipboard,
    captureCardAsImage,
    generateShareText,
  };
};

export default useAdvancedShare;