import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, BellOff, TestTube, Play, Settings, Clock, Calendar, Zap } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationSettings = () => {
  const {
    settings,
    permission,
    isSupported,
    serviceWorkerReady,
    requestPermission,
    updateSettings,
    sendTestNotification,
    simulateDailyNotifications
  } = useNotifications();

  const weekDays = [
    { value: 0, label: 'Dom' },
    { value: 1, label: 'Seg' },
    { value: 2, label: 'Ter' },
    { value: 3, label: 'Qua' },
    { value: 4, label: 'Qui' },
    { value: 5, label: 'Sex' },
    { value: 6, label: 'Sáb' }
  ];

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { color: 'bg-success text-success-foreground', text: 'Concedida' };
      case 'denied':
        return { color: 'bg-destructive text-destructive-foreground', text: 'Negada' };
      default:
        return { color: 'bg-muted text-muted-foreground', text: 'Pendente' };
    }
  };

  const handleDayToggle = (day: number) => {
    const newDays = settings.days.includes(day)
      ? settings.days.filter(d => d !== day)
      : [...settings.days, day].sort();
    
    updateSettings({ days: newDays });
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notificações Não Suportadas
          </CardTitle>
          <CardDescription>
            Seu navegador não suporta notificações web. Considere atualizar para uma versão mais recente.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status das Permissões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Status das Notificações
          </CardTitle>
          <CardDescription>
            Configure suas preferências de notificação personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Permissão do Navegador</Label>
              <div className="flex items-center gap-2">
                <Badge className={getPermissionStatus().color}>
                  {getPermissionStatus().text}
                </Badge>
                {!serviceWorkerReady && (
                  <Badge variant="outline">Service Worker Carregando...</Badge>
                )}
              </div>
            </div>
            {permission !== 'granted' && (
              <Button onClick={requestPermission} variant="outline">
                Solicitar Permissão
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={sendTestNotification} 
              variant="outline" 
              size="sm"
              disabled={permission !== 'granted' || !serviceWorkerReady}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Teste
            </Button>
            <Button 
              onClick={simulateDailyNotifications} 
              variant="outline" 
              size="sm"
              disabled={!settings.enabled || permission !== 'granted'}
            >
              <Play className="h-4 w-4 mr-2" />
              Simular Envio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notificações Ativadas</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações conforme suas preferências
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(enabled) => updateSettings({ enabled })}
              disabled={permission !== 'granted'}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Tipos de Notificação</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm">💭 Frases Inspiradoras</Label>
                  <p className="text-xs text-muted-foreground">
                    Receba frases motivacionais diariamente
                  </p>
                </div>
                <Switch
                  checked={settings.types.phrases}
                  onCheckedChange={(phrases) => 
                    updateSettings({ types: { ...settings.types, phrases } })
                  }
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm">📚 Resumos de Livros</Label>
                  <p className="text-xs text-muted-foreground">
                    Notificações sobre novos resumos disponíveis
                  </p>
                </div>
                <Switch
                  checked={settings.types.summaries}
                  onCheckedChange={(summaries) => 
                    updateSettings({ types: { ...settings.types, summaries } })
                  }
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm">⏰ Lembretes de Leitura</Label>
                  <p className="text-xs text-muted-foreground">
                    Lembretes personalizados para incentivar a leitura
                  </p>
                </div>
                <Switch
                  checked={settings.types.reminders}
                  onCheckedChange={(reminders) => 
                    updateSettings({ types: { ...settings.types, reminders } })
                  }
                  disabled={!settings.enabled}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agendamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horário e Frequência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequência</Label>
              <Select
                value={settings.frequency}
                onValueChange={(frequency: 'daily' | 'weekly' | 'custom') => 
                  updateSettings({ frequency })
                }
                disabled={!settings.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Horário Preferido</Label>
              <Input
                type="time"
                value={settings.time}
                onChange={(e) => updateSettings({ time: e.target.value })}
                disabled={!settings.enabled}
              />
            </div>
          </div>

          {settings.frequency === 'custom' && (
            <div className="space-y-2">
              <Label>Intervalo (horas)</Label>
              <Input
                type="number"
                min="1"
                max="168"
                value={settings.customInterval}
                onChange={(e) => updateSettings({ customInterval: parseInt(e.target.value) || 24 })}
                disabled={!settings.enabled}
              />
            </div>
          )}

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dias da Semana
            </Label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <Button
                  key={day.value}
                  variant={settings.days.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDayToggle(day.value)}
                  disabled={!settings.enabled}
                  className="w-12"
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Simulação */}
      {settings.enabled && permission === 'granted' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Modo de Demonstração
            </CardTitle>
            <CardDescription>
              Este é um sistema de demonstração. Em produção, as notificações seriam enviadas automaticamente conforme sua configuração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Configuração Atual:</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Frequência: {settings.frequency === 'daily' ? 'Diária' : settings.frequency === 'weekly' ? 'Semanal' : 'Personalizada'}</li>
                <li>• Horário: {settings.time}</li>
                <li>• Dias: {weekDays.filter(d => settings.days.includes(d.value)).map(d => d.label).join(', ')}</li>
                <li>• Tipos ativos: {Object.entries(settings.types).filter(([_, enabled]) => enabled).map(([type]) => 
                  type === 'phrases' ? 'Frases' : type === 'summaries' ? 'Resumos' : 'Lembretes'
                ).join(', ')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationSettings;