import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface NotificationSettings {
  enabled: boolean;
  types: {
    phrases: boolean;
    summaries: boolean;
    reminders: boolean;
  };
  frequency: 'daily' | 'weekly' | 'custom';
  time: string; // formato HH:MM
  days: number[]; // 0-6 (domingo a sábado)
  customInterval: number; // em horas para frequência custom
}

const defaultSettings: NotificationSettings = {
  enabled: false,
  types: {
    phrases: true,
    summaries: true,
    reminders: false
  },
  frequency: 'daily',
  time: '09:00',
  days: [1, 2, 3, 4, 5], // segunda a sexta
  customInterval: 24
};

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);

  useEffect(() => {
    // Verificar suporte a notificações
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }

    // Registrar service worker
    registerServiceWorker();
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado:', registration);
        setServiceWorkerReady(true);
        
        // Escutar atualizações
        registration.addEventListener('updatefound', () => {
          console.log('Nova versão do Service Worker disponível');
        });
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      toast({
        title: "Não suportado",
        description: "Seu navegador não suporta notificações.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Permissão concedida!",
          description: "Você receberá notificações conforme suas configurações."
        });
        return true;
      } else if (result === 'denied') {
        toast({
          title: "Permissão negada",
          description: "Você pode alterar isso nas configurações do navegador.",
          variant: "destructive"
        });
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('notification-settings', JSON.stringify(updatedSettings));
    
    toast({
      title: "Configurações atualizadas",
      description: "Suas preferências de notificação foram salvas."
    });
  };

  const sendTestNotification = async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    if (!serviceWorkerReady) {
      toast({
        title: "Service Worker não está pronto",
        description: "Aguarde um momento e tente novamente.",
        variant: "destructive"
      });
      return;
    }

    // Enviar mensagem para o service worker
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        payload: {
          title: '🧪 Notificação de Teste',
          body: 'Esta é uma notificação de teste do seu sistema!',
          tag: 'test-notification',
          data: {
            type: 'test',
            url: '/',
            immediate: true
          }
        }
      });

      toast({
        title: "Notificação de teste enviada!",
        description: "Verifique se a notificação apareceu."
      });
    }
  };

  const scheduleNotification = (type: 'phrase' | 'summary' | 'reminder', immediate = false) => {
    if (permission !== 'granted' || !serviceWorkerReady) return;

    const messages = {
      phrase: {
        title: '💭 Frase Inspiradora',
        body: 'Uma nova frase te espera para inspirar seu dia!',
        url: '/frases'
      },
      summary: {
        title: '📚 Resumo do Dia',
        body: 'Descubra novos conhecimentos em nossos resumos!',
        url: '/resumos'
      },
      reminder: {
        title: '⏰ Lembrete de Leitura',
        body: 'Que tal dedicar alguns minutos à leitura?',
        url: '/'
      }
    };

    const message = messages[type];

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        payload: {
          ...message,
          tag: `${type}-notification`,
          data: {
            type,
            url: message.url,
            immediate
          }
        }
      });
    }
  };

  const simulateDailyNotifications = () => {
    if (!settings.enabled || permission !== 'granted') return;

    const { types } = settings;
    const notifications = [];

    if (types.phrases) {
      scheduleNotification('phrase', true);
      notifications.push('Frase inspiradora');
    }

    if (types.summaries) {
      setTimeout(() => scheduleNotification('summary', true), 2000);
      notifications.push('Resumo de livro');
    }

    if (types.reminders) {
      setTimeout(() => scheduleNotification('reminder', true), 4000);
      notifications.push('Lembrete de leitura');
    }

    if (notifications.length > 0) {
      toast({
        title: "Simulação iniciada!",
        description: `Enviando: ${notifications.join(', ')}`
      });
    }
  };

  return {
    settings,
    permission,
    isSupported,
    serviceWorkerReady,
    requestPermission,
    updateSettings,
    sendTestNotification,
    scheduleNotification,
    simulateDailyNotifications
  };
};