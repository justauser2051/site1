import { useState, useEffect } from 'react';
import { useProgress } from './useProgress';
import { useAuth } from './useAuth';
import { modules } from '../data/modules';

interface NotificationSettings {
  enabled: boolean;
  lastLoginTime: Date | null;
  lastNotificationTime: Date | null;
}

export const useNotifications = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: false,
    lastLoginTime: null,
    lastNotificationTime: null
  });
  const { getRecentlyWatched, hasAnyProgress } = useProgress();
  const { isAuthenticated } = useAuth();

  // Mensagens criativas para progresso incompleto
  const progressMessages = [
    "⚡ Está quase lá! Complete a próxima aula para otimizar seu sono! 💡",
    "⏰ Você está a um passo de melhorar seu sono! Volte para a aula e continue sua jornada! 💤",
    "🛏️ Não deixe o sono esperar! A aula que falta está esperando por você! 😴",
    "🚀 A próxima aula está te chamando! Dê um passo para o sono perfeito agora mesmo! 🌙",
    "🕒 O sono reparador está mais perto! Continue assistindo para concluir o módulo e dormir melhor! 🌙",
    "💫 Sua jornada para o sono perfeito continua! Complete a próxima aula agora! ✨",
    "🌟 O descanso que você merece está a uma aula de distância! Continue! 💤",
    "⭐ Não pare agora! Sua rotina de sono saudável depende da próxima aula! 🛌"
  ];

  // Mensagens para inatividade de 24h
  const inactivityMessages = [
    "⏰ O tempo está correndo! Volte agora e continue melhorando o seu sono! 💤",
    "😴 24 horas sem sonhar? Volte ao aplicativo e retome sua jornada de sono saudável! 🌙",
    "💡 Sua jornada de sono está esperando por você! Não deixe o descanso de lado por mais tempo!",
    "🔔 Está na hora de voltar! Uma boa noite de sono te espera — acesse o aplicativo agora!",
    "🌙 Sentimos sua falta! Volte e continue construindo sua rotina de sono perfeita! ⭐",
    "💤 24 horas é muito tempo longe do seu sono ideal! Retome sua jornada agora! 🚀",
    "🛌 O Sleep Protocol está te esperando! Volte e durma melhor hoje mesmo! 💫",
    "⚡ Não deixe sua evolução parar! Volte ao app e continue melhorando seu sono! 🌟"
  ];

  useEffect(() => {
    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('sleep-app-notifications');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setNotificationSettings({
          ...settings,
          lastLoginTime: settings.lastLoginTime ? new Date(settings.lastLoginTime) : null,
          lastNotificationTime: settings.lastNotificationTime ? new Date(settings.lastNotificationTime) : null
        });
      } catch (error) {
        console.error('Erro ao carregar configurações de notificação:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Atualizar último login quando usuário estiver autenticado
    if (isAuthenticated()) {
      updateLastLoginTime();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Configurar verificações periódicas quando notificações estiverem ativadas
    if (notificationSettings.enabled && isAuthenticated()) {
      const interval = setInterval(() => {
        checkAndSendNotifications();
      }, 60000); // Verificar a cada minuto

      return () => clearInterval(interval);
    }
  }, [notificationSettings.enabled, isAuthenticated]);

  const saveSettings = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    localStorage.setItem('sleep-app-notifications', JSON.stringify(settings));
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const sendNotification = (title: string, message: string, icon?: string) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: message,
        icon: icon || '/vite.svg',
        badge: '/vite.svg',
        tag: 'sleep-protocol',
        requireInteraction: false,
        silent: false
      });

      // Auto-fechar após 8 segundos
      setTimeout(() => {
        notification.close();
      }, 8000);

      // Atualizar último tempo de notificação
      const updatedSettings = {
        ...notificationSettings,
        lastNotificationTime: new Date()
      };
      saveSettings(updatedSettings);
    }
  };

  const getRandomMessage = (messages: string[]): string => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const checkIncompleteProgress = (): boolean => {
    const recentlyWatched = getRecentlyWatched();
    
    for (const progress of recentlyWatched) {
      const module = modules.find(m => m.id === progress.moduleId);
      if (module && progress.completedLessons < module.lessons.length) {
        // Encontrou módulo incompleto
        const nextLessonIndex = progress.completedLessons;
        const nextLesson = module.lessons[nextLessonIndex];
        
        if (nextLesson) {
          const message = getRandomMessage(progressMessages);
          sendNotification(
            '🎯 Sleep Protocol - Continue sua jornada!',
            message
          );
          return true;
        }
      }
    }
    return false;
  };

  const checkInactivity = (): boolean => {
    if (!notificationSettings.lastLoginTime) return false;

    const now = new Date();
    const timeSinceLastLogin = now.getTime() - notificationSettings.lastLoginTime.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 horas em millisegundos

    // Verificar se passou 24 horas desde o último login
    if (timeSinceLastLogin >= twentyFourHours) {
      // Verificar se já enviou notificação de inatividade recentemente (evitar spam)
      const timeSinceLastNotification = notificationSettings.lastNotificationTime 
        ? now.getTime() - notificationSettings.lastNotificationTime.getTime()
        : twentyFourHours + 1;

      // Só enviar se não enviou notificação nas últimas 6 horas
      const sixHours = 6 * 60 * 60 * 1000;
      if (timeSinceLastNotification >= sixHours) {
        const message = getRandomMessage(inactivityMessages);
        sendNotification(
          '🌙 Sleep Protocol - Sentimos sua falta!',
          message
        );
        return true;
      }
    }
    return false;
  };

  const checkAndSendNotifications = () => {
    if (!notificationSettings.enabled || Notification.permission !== 'granted') {
      return;
    }

    // Primeiro verificar progresso incompleto
    const sentProgressNotification = checkIncompleteProgress();
    
    // Se não enviou notificação de progresso, verificar inatividade
    if (!sentProgressNotification) {
      checkInactivity();
    }
  };

  const updateLastLoginTime = () => {
    const updatedSettings = {
      ...notificationSettings,
      lastLoginTime: new Date()
    };
    saveSettings(updatedSettings);
  };

  const toggleNotifications = async (): Promise<boolean> => {
    if (!notificationSettings.enabled) {
      // Tentando ativar notificações
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        const updatedSettings = {
          ...notificationSettings,
          enabled: true,
          lastLoginTime: new Date()
        };
        saveSettings(updatedSettings);
        
        // Enviar notificação de confirmação
        sendNotification(
          '🔔 Sleep Protocol - Notificações Ativadas!',
          'Agora você receberá lembretes personalizados para continuar sua jornada de sono saudável! 🌙'
        );
        
        return true;
      }
      return false;
    } else {
      // Desativando notificações
      const updatedSettings = {
        ...notificationSettings,
        enabled: false
      };
      saveSettings(updatedSettings);
      return true;
    }
  };

  const sendTestNotification = () => {
    if (notificationSettings.enabled && Notification.permission === 'granted') {
      sendNotification(
        '🧪 Sleep Protocol - Teste de Notificação',
        'Suas notificações estão funcionando perfeitamente! 🎉'
      );
    }
  };

  return {
    notificationSettings,
    toggleNotifications,
    sendTestNotification,
    isNotificationSupported: 'Notification' in window,
    hasPermission: Notification.permission === 'granted'
  };
};