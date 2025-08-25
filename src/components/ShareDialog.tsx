import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Copy, 
  MessageCircle, 
  Twitter, 
  Facebook, 
  Linkedin,
  Image as ImageIcon,
  Smartphone,
  CheckCircle
} from "lucide-react";
import useAdvancedShare from "@/hooks/useAdvancedShare";

interface ShareData {
  id: number;
  text: string;
  author: string;
  category?: string;
}

interface ShareDialogProps {
  data: ShareData;
  source?: 'card' | 'detail' | 'favorite';
  appUrl?: string;
  children: React.ReactNode;
}

const ShareDialog = ({ 
  data, 
  source = 'card',
  appUrl = "https://sparkphrasebank.com",
  children 
}: ShareDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  
  const { 
    shareAdvanced, 
    shareToSocialMedia, 
    copyToClipboard,
    generateShareText
  } = useAdvancedShare();

  const handleShare = async (method: string, action: () => Promise<void | boolean>) => {
    setIsSharing(true);
    setShareSuccess(null);
    
    try {
      await action();
      setShareSuccess(method);
      setTimeout(() => setShareSuccess(null), 2000);
    } catch (error) {
      console.error(`Error sharing via ${method}:`, error);
    } finally {
      setIsSharing(false);
    }
  };

  const shareText = generateShareText(data, appUrl);

  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600',
      action: () => shareToSocialMedia(data, 'whatsapp', { appUrl, source })
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'text-blue-500',
      action: () => shareToSocialMedia(data, 'twitter', { appUrl, source })
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      action: () => shareToSocialMedia(data, 'facebook', { appUrl, source })
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700',
      action: () => shareToSocialMedia(data, 'linkedin', { appUrl, source })
    },
    {
      id: 'copy',
      name: 'Copiar Texto',
      icon: Copy,
      color: 'text-gray-600',
      action: () => copyToClipboard(data, { appUrl, source })
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Compartilhar Frase</span>
          </DialogTitle>
          <DialogDescription>
            Escolha como você gostaria de compartilhar esta frase inspiradora
          </DialogDescription>
        </DialogHeader>

        {/* Quote Preview */}
        <div className="bg-card/50 rounded-lg p-4 my-4">
          <blockquote className="text-sm italic text-foreground mb-2">
            "{data.text}"
          </blockquote>
          <cite className="text-xs text-muted-foreground">
            — {data.author}
          </cite>
          {data.category && (
            <Badge variant="outline" className="ml-2 text-xs">
              {data.category}
            </Badge>
          )}
        </div>

        {/* Native Share (if supported) */}
        {navigator.share && (
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => handleShare('native', async () => {
                const cardElement = document.querySelector('.phrase-card-container') as HTMLElement;
                await shareAdvanced(data, { appUrl, source }, cardElement);
              })}
              disabled={isSharing}
              className="w-full justify-start"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Compartilhamento Nativo
              {shareSuccess === 'native' && (
                <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
              )}
            </Button>
          </div>
        )}

        {/* Share Options Grid */}
        <div className="grid grid-cols-2 gap-2">
          {shareOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Button
                key={option.id}
                variant="outline"
                onClick={() => handleShare(option.id, option.action)}
                disabled={isSharing}
                className="justify-start"
              >
                <IconComponent className={`h-4 w-4 mr-2 ${option.color}`} />
                {option.name}
                {shareSuccess === option.id && (
                  <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Share Text Preview */}
        <details className="mt-4">
          <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
            Ver texto completo que será compartilhado
          </summary>
          <div className="mt-2 p-3 bg-muted/50 rounded text-xs text-muted-foreground">
            {shareText}
          </div>
        </details>

        {/* Tips */}
        <div className="text-xs text-muted-foreground bg-accent/10 p-3 rounded-lg">
          💡 <strong>Dica:</strong> Ao compartilhar, você ajuda a espalhar motivação e 
          divulga nosso app para mais pessoas descobrirem frases inspiradoras!
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;