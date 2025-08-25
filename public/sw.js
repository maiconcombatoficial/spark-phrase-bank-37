// Service Worker para notificações
self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

// Escutar mensagens para agendar notificações
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, icon, badge, tag, data } = event.data.payload;
    
    // Simular agendamento (em produção usaria setTimeout ou cron jobs)
    console.log('Notificação agendada:', { title, body, data });
    
    // Para demonstração, mostrar notificação imediatamente em alguns casos
    if (data.immediate) {
      self.registration.showNotification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: badge || '/favicon.ico',
        tag: tag || 'default',
        data,
        actions: [
          {
            action: 'view',
            title: 'Ver',
            icon: '/favicon.ico'
          },
          {
            action: 'dismiss',
            title: 'Dispensar'
          }
        ],
        requireInteraction: false,
        silent: false
      });
    }
  }
});

// Lidar com cliques em notificações
self.addEventListener('notificationclick', event => {
  console.log('Notificação clicada:', event.notification.data);
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Abrir a página relevante
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clientList => {
        // Verificar se já existe uma janela aberta
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Abrir nova janela se necessário
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Simular notificações programadas (em produção seria feito no servidor)
function simulateScheduledNotifications() {
  // Esta função seria chamada por um cron job ou sistema de agendamento
  const notifications = [
    {
      title: '💭 Frase do Dia',
      body: 'Uma nova frase inspiradora te espera!',
      tag: 'daily-phrase',
      data: { type: 'phrase', url: '/frases' }
    },
    {
      title: '📚 Lembrete de Leitura',
      body: 'Que tal ler um resumo hoje?',
      tag: 'reading-reminder',
      data: { type: 'summary', url: '/resumos' }
    }
  ];
  
  // Simular envio baseado nas configurações do usuário
  // Em produção, isso seria sincronizado com as preferências salvas
}