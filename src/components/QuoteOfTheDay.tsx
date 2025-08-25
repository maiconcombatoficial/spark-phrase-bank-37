import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, RefreshCw } from "lucide-react";
import useFavorites from "@/hooks/useFavorites";
import ShareButton from "@/components/ShareButton";
import { useToast } from "@/hooks/use-toast";

interface Phrase {
  id: number;
  text: string;
  author: string;
  category: string;
  tags: string[];
  dateAdded: string;
}

interface QuoteOfTheDayProps {
  phrases: Phrase[];
}

const QuoteOfTheDay = ({ phrases }: QuoteOfTheDayProps) => {
  const [dailyPhrase, setDailyPhrase] = useState<Phrase | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  // Get phrase of the day (deterministic based on date)
  useEffect(() => {
    const today = new Date().toDateString();
    const savedPhrase = localStorage.getItem(`daily-phrase-${today}`);
    
    if (savedPhrase) {
      try {
        setDailyPhrase(JSON.parse(savedPhrase));
      } catch {
        selectNewPhrase();
      }
    } else {
      selectNewPhrase();
    }
  }, [phrases]);

  const selectNewPhrase = () => {
    if (phrases.length === 0) return;
    
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % phrases.length;
    const selected = phrases[index];
    
    setDailyPhrase(selected);
    localStorage.setItem(`daily-phrase-${today.toDateString()}`, JSON.stringify(selected));
  };

  const handleFavorite = () => {
    if (!dailyPhrase) return;
    
    setIsAnimating(true);
    const wasAdded = toggleFavorite(dailyPhrase);
    
    // Reset animation after completion
    setTimeout(() => setIsAnimating(false), 600);
    
    // Show feedback
    toast({
      title: wasAdded ? "Frase do dia favoritada! ⭐" : "Frase removida dos favoritos",
      description: wasAdded 
        ? "A frase do dia foi adicionada aos seus favoritos." 
        : "A frase foi removida dos seus favoritos.",
    });
  };

  const handleRefresh = () => {
    if (phrases.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * phrases.length);
    const newPhrase = phrases[randomIndex];
    setDailyPhrase(newPhrase);
    
    const today = new Date().toDateString();
    localStorage.setItem(`daily-phrase-${today}`, JSON.stringify(newPhrase));
    
    toast({
      title: "Nova frase carregada! ✨",
      description: "Desfrute de mais uma dose de inspiração.",
    });
  };

  if (!dailyPhrase) {
    return null;
  }

  const isFav = isFavorite(dailyPhrase.id);

  return (
    <section className="py-16 bg-card/20 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frase do Dia
          </h2>
          <p className="text-lg text-muted-foreground">
            Sua dose diária de inspiração
          </p>
        </div>

        <Card className="phrase-card-container group bg-gradient-bg border border-border/50 shadow-glow hover:shadow-elegant transition-all duration-500 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
          
          <CardContent className="p-8 md:p-12 relative">
            <div className="space-y-6">
              {/* Quote */}
              <blockquote className="text-xl md:text-2xl lg:text-3xl leading-relaxed font-medium text-foreground italic text-center">
                "{dailyPhrase.text}"
              </blockquote>
              
              {/* Author */}
              <div className="text-center">
                <cite className="text-lg md:text-xl font-semibold text-muted-foreground not-italic">
                  — {dailyPhrase.author}
                </cite>
              </div>

              {/* Tags and Category */}
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  {dailyPhrase.category}
                </Badge>
                {dailyPhrase.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4 pt-6" data-hide-in-image>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleFavorite}
                  className={`
                    transition-all duration-300 hover:scale-110
                    ${isAnimating ? 'animate-pulse scale-125' : ''}
                  `}
                >
                  <Heart
                    className={`
                      h-6 w-6 transition-all duration-300
                      ${isFav ? 'fill-red-500 text-red-500 animate-bounce' : 'hover:text-red-500'}
                      ${isAnimating ? 'animate-ping' : ''}
                    `}
                  />
                  <span className="ml-2 font-medium">
                    {isFav ? 'Favoritada' : 'Favoritar'}
                  </span>
                </Button>
                
                <ShareButton
                  data={{
                    id: dailyPhrase.id,
                    text: dailyPhrase.text,
                    author: dailyPhrase.author,
                    category: dailyPhrase.category,
                  }}
                  source="detail"
                  size="lg"
                  variant="ghost"
                  showImageOption={true}
                />
                
                <Button variant="ghost" size="lg" onClick={handleRefresh}>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Nova Frase
                </Button>
              </div>

              {/* Date */}
              <div className="flex items-center justify-center text-sm text-muted-foreground pt-4 border-t border-border/30">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date().toLocaleDateString("pt-BR", { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuoteOfTheDay;