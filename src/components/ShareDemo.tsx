import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ShareButton from "@/components/ShareButton";
import ShareDialog from "@/components/ShareDialog";
import { Share2, Smartphone, MessageCircle, Copy } from "lucide-react";

const ShareDemo = () => {
  const demoPhraseData = {
    id: 999,
    text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    author: "Tony Robbins",
    category: "motivação"
  };

  return (
    <section className="py-16 bg-card/10 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            🚀 Nova Funcionalidade: Compartilhamento Avançado
          </h2>
          <p className="text-lg text-muted-foreground">
            Agora você pode compartilhar frases de forma inteligente e ajudar a espalhar motivação!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Demo Card */}
          <Card className="phrase-card-container group hover:shadow-elegant transition-all duration-300 bg-gradient-bg border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Share2 className="h-5 w-5 mr-2 text-primary" />
                Frase de Demonstração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <blockquote className="text-lg leading-relaxed font-medium text-foreground italic">
                "{demoPhraseData.text}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <cite className="text-sm font-semibold text-muted-foreground not-italic">
                  — {demoPhraseData.author}
                </cite>
                <Badge variant="secondary" className="text-xs">
                  {demoPhraseData.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/30" data-hide-in-image>
                <div className="text-xs text-muted-foreground">
                  Experimente o novo compartilhamento →
                </div>
                
                <div className="flex items-center space-x-2">
                  <ShareButton
                    data={demoPhraseData}
                    source="card"
                    size="icon"
                    variant="hero"
                    showImageOption={true}
                  />
                  
                  <ShareDialog data={demoPhraseData} source="card">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Dialog
                    </Button>
                  </ShareDialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              ✨ Recursos do Compartilhamento
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-card/50 rounded-lg">
                <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Compartilhamento Nativo</h4>
                  <p className="text-xs text-muted-foreground">
                    Use a API nativa do dispositivo para compartilhar em qualquer app
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-card/50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">WhatsApp Inteligente</h4>
                  <p className="text-xs text-muted-foreground">
                    Detecta mobile/desktop e abre WhatsApp App ou Web automaticamente
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-card/50 rounded-lg">
                <Copy className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Fallback Inteligente</h4>
                  <p className="text-xs text-muted-foreground">
                    Se não puder compartilhar nativamente, copia automaticamente
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-card/50 rounded-lg">
                <Share2 className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Texto Promocional</h4>
                  <p className="text-xs text-muted-foreground">
                    Inclui automaticamente link do app para divulgação
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
              <h4 className="font-medium text-sm text-accent mb-2">
                📱 Testado em Mobile & Desktop
              </h4>
              <p className="text-xs text-muted-foreground">
                Funciona perfeitamente em Android, iOS e navegadores desktop, 
                com otimizações específicas para cada plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareDemo;