import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import useFavorites from "@/hooks/useFavorites";
import ShareButton from "@/components/ShareButton";
import { getCardAriaAttributes, getActionButtonAriaAttributes, useKeyboardNavigation } from "@/utils/accessibility";

interface Phrase {
  id: number;
  text: string;
  author: string;
  category: string;
  tags: string[];
  dateAdded: string;
}

interface PhraseCardProps {
  phrase: Phrase;
}

const PhraseCard = ({ phrase }: PhraseCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  const handleFavorite = () => {
    setIsAnimating(true);
    const wasAdded = toggleFavorite(phrase);
    
    // Reset animation after completion
    setTimeout(() => setIsAnimating(false), 600);
    
    // Show feedback
    toast({
      title: wasAdded ? "Frase favoritada! ❤️" : "Frase removida dos favoritos",
      description: wasAdded 
        ? "A frase foi adicionada aos seus favoritos." 
        : "A frase foi removida dos seus favoritos.",
    });
  };

  const isFav = isFavorite(phrase.id);

  // Atributos de acessibilidade
  const cardAriaAttributes = getCardAriaAttributes(
    phrase.text,
    `Frase de ${phrase.author}`,
    phrase.id
  );

  const favoriteButtonAriaAttributes = getActionButtonAriaAttributes(
    isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos',
    phrase.text.substring(0, 50) + '...'
  );

  // Navegação por teclado
  const { handleKeyDown } = useKeyboardNavigation(
    [phrase], 
    (index) => {
      if (index === 0) handleFavorite();
    }
  );

  return (
    <Card 
      className="phrase-card-container group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-bg border border-border/50 keyboard-focus-visible"
      {...cardAriaAttributes}
      onKeyDown={handleKeyDown}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Quote */}
          <blockquote 
            className="text-lg leading-relaxed font-medium text-foreground italic"
            role="blockquote"
            aria-label={`Frase: ${phrase.text}`}
          >
            "{phrase.text}"
          </blockquote>
          
          {/* Author */}
          <div className="flex items-center justify-between">
            <cite 
              className="text-sm font-semibold text-muted-foreground not-italic"
              role="note"
              aria-label={`Autor: ${phrase.author}`}
            >
              — {phrase.author}
            </cite>
            <Badge 
              variant="secondary" 
              className="text-xs"
              role="note"
              aria-label={`Categoria: ${phrase.category}`}
            >
              {phrase.category}
            </Badge>
          </div>

          {/* Tags */}
          <div 
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Tags relacionadas"
          >
            {phrase.tags.map((tag, index) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs"
                role="listitem"
                aria-label={`Tag: ${tag}`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div 
              className="flex items-center text-xs text-muted-foreground"
              role="note"
              aria-label={`Data de adição: ${new Date(phrase.dateAdded).toLocaleDateString("pt-BR")}`}
            >
              <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
              {new Date(phrase.dateAdded).toLocaleDateString("pt-BR")}
            </div>
            
            <div 
              className="flex items-center space-x-2" 
              data-hide-in-image
              role="group"
              aria-label="Ações da frase"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavorite}
                className={`
                  h-8 w-8 p-0 transition-all duration-300 hover:scale-105 keyboard-focus-visible
                  ${isAnimating ? 'animate-pulse scale-125' : ''}
                `}
                {...favoriteButtonAriaAttributes}
                aria-pressed={isFav}
              >
                <Heart
                  className={`
                    h-4 w-4 transition-all duration-300
                    ${isFav ? 'fill-red-500 text-red-500' : 'hover:text-red-500'}
                    ${isAnimating ? 'animate-bounce' : ''}
                  `}
                  aria-hidden="true"
                />
                <span className="sr-only">
                  {isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                </span>
              </Button>
              
              <ShareButton
                data={{
                  id: phrase.id,
                  text: phrase.text,
                  author: phrase.author,
                  category: phrase.category,
                }}
                source="card"
                size="icon"
                variant="ghost"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhraseCard;