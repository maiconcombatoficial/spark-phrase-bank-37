import Layout from "@/components/Layout";
import NotificationSettings from "@/components/NotificationSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Smartphone, Globe, Shield } from "lucide-react";

const Notificacoes = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notificações Personalizadas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Configure suas notificações para receber frases inspiradoras, resumos de livros e lembretes de leitura no momento ideal para você.
          </p>
        </div>

        {/* Benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardHeader className="pb-3">
              <Smartphone className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Multiplataforma</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription>
                Receba notificações no desktop, mobile e tablets
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Sempre Conectado</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription>
                Funciona mesmo quando o navegador está fechado
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription>
                Suas configurações ficam salvas localmente
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Componente Principal */}
        <NotificationSettings />

        {/* Informações Técnicas */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
            <CardDescription>
              Informações técnicas sobre o sistema de notificações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">🔧 Tecnologia</h4>
                <p className="text-sm text-muted-foreground">
                  Utilizamos Service Workers e Web Push API para garantir que as notificações funcionem de forma confiável, mesmo quando você não está com o site aberto.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">📱 Compatibilidade</h4>
                <p className="text-sm text-muted-foreground">
                  Suportado nos principais navegadores modernos: Chrome, Firefox, Safari, Edge. Certifique-se de estar usando uma versão atualizada.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🛡️ Privacidade</h4>
                <p className="text-sm text-muted-foreground">
                  Todas as suas configurações são armazenadas localmente no seu dispositivo. Não compartilhamos informações pessoais com terceiros.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">🎯 Demonstração</h4>
                <p className="text-sm text-muted-foreground">
                  Este é um sistema de demonstração. Em uma implementação real, as notificações seriam agendadas no servidor e enviadas automaticamente conforme suas configurações.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Notificacoes;