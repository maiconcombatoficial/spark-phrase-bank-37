import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Sparkles, Clock, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { permission, isSupported } = useNotifications();

  useEffect(() => {
    // Verificar se o usuário já foi apresentado ao recurso
    const hasSeenPrompt = localStorage.getItem('notification-prompt-seen');
    const hasDismissed = localStorage.getItem('notification-prompt-dismissed');
    
    if (!hasSeenPrompt && !hasDismissed && isSupported && permission === 'default') {
      // Mostrar após um pequeno delay para melhor UX
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem('notification-prompt-seen', 'true');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('notification-prompt-dismissed', 'true');
  };

  const handleNotNow = () => {
    setIsVisible(false);
    // Não marcar como dismissed para mostrar novamente na próxima visita
  };

  // Não mostrar se não for suportado, já tiver permissão ou foi dismissed
  if (!isSupported || permission !== 'default' || isDismissed || !isVisible) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Notificações Personalizadas
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Novo
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                Receba frases inspiradoras e lembretes de leitura quando você quiser
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>Horários personalizados</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="h-4 w-4 text-primary" />
            <span>Funciona offline</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Conteúdo diário</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild className="flex-1">
            <Link to="/notificacoes">
              <Bell className="h-4 w-4 mr-2" />
              Configurar Notificações
            </Link>
          </Button>
          <Button variant="outline" onClick={handleNotNow} className="flex-1 sm:flex-none">
            Talvez mais tarde
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPrompt;