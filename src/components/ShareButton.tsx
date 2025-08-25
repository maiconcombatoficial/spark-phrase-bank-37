import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Share2, 
  Copy, 
  MessageCircle, 
  Twitter, 
  Facebook, 
  Linkedin,
  Image as ImageIcon,
  Smartphone
} from "lucide-react";
import useAdvancedShare from "@/hooks/useAdvancedShare";

interface ShareData {
  id: number;
  text: string;
  author: string;
  category?: string;
}

interface ShareButtonProps {
  data: ShareData;
  source?: 'card' | 'detail' | 'favorite';
  appUrl?: string;
  showImageOption?: boolean;
  variant?: "ghost" | "outline" | "hero" | "accent";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
}

const ShareButton = ({ 
  data, 
  source = 'card',
  appUrl = "https://sparkphrasebank.com",
  showImageOption = true,
  variant = "ghost",
  size = "sm",
  className = ""
}: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { 
    shareAdvanced, 
    shareToSocialMedia, 
    copyToClipboard,
    shareNatively
  } = useAdvancedShare();

  const handleNativeShare = async () => {
    setIsSharing(true);
    const cardElement = cardRef.current?.closest('.phrase-card-container') as HTMLElement;
    
    await shareNatively(
      data, 
      { appUrl, source },
      showImageOption ? cardElement : undefined
    );
    
    setIsSharing(false);
    setIsOpen(false);
  };

  const handleAdvancedShare = async () => {
    setIsSharing(true);
    const cardElement = cardRef.current?.closest('.phrase-card-container') as HTMLElement;
    
    await shareAdvanced(
      data, 
      { includeImage: showImageOption, appUrl, source },
      cardElement
    );
    
    setIsSharing(false);
    setIsOpen(false);
  };

  const handleCopyToClipboard = async () => {
    setIsSharing(true);
    await copyToClipboard(data, { appUrl, source });
    setIsSharing(false);
    setIsOpen(false);
  };

  const handleSocialShare = async (platform: 'whatsapp' | 'twitter' | 'facebook' | 'linkedin') => {
    setIsSharing(true);
    await shareToSocialMedia(data, platform, { appUrl, source });
    setIsSharing(false);
    setIsOpen(false);
  };

  const buttonContent = size === "icon" ? (
    <Share2 className={`h-4 w-4 ${isSharing ? 'animate-pulse' : ''}`} />
  ) : (
    <>
      <Share2 className={`h-4 w-4 mr-2 ${isSharing ? 'animate-pulse' : ''}`} />
      Compartilhar
    </>
  );

  return (
    <div ref={cardRef}>
      <TooltipProvider>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={variant}
                  size={size}
                  disabled={isSharing}
                  className={`
                    transition-all duration-300 group
                    hover:scale-105 hover:shadow-md
                    ${size === "icon" ? "h-8 w-8 p-0" : ""}
                    ${className}
                  `}
                >
                  {buttonContent}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Compartilhar e divulgar o app</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent align="end" className="w-48">
            {/* Native Share (if supported) */}
            {navigator.share && (
              <>
                <DropdownMenuItem onClick={handleNativeShare} disabled={isSharing}>
                  <Smartphone className="h-4 w-4 mr-2" />
                  Compartilhar (Nativo)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Advanced Share with Image */}
            {showImageOption && (
              <DropdownMenuItem onClick={handleAdvancedShare} disabled={isSharing}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Compartilhar com Imagem
              </DropdownMenuItem>
            )}

            {/* Copy to Clipboard */}
            <DropdownMenuItem onClick={handleCopyToClipboard} disabled={isSharing}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar Texto
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Social Media Options */}
            <DropdownMenuItem onClick={() => handleSocialShare('whatsapp')} disabled={isSharing}>
              <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
              WhatsApp
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleSocialShare('twitter')} disabled={isSharing}>
              <Twitter className="h-4 w-4 mr-2 text-blue-500" />
              Twitter
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleSocialShare('facebook')} disabled={isSharing}>
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              Facebook
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleSocialShare('linkedin')} disabled={isSharing}>
              <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
              LinkedIn
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    </div>
  );
};

export default ShareButton;