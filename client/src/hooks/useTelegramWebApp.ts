import { useState, useEffect } from "react";
import { telegramWebApp } from "@/lib/telegramWebApp";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export function useTelegramWebApp() {
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkTelegramApp = () => {
      const isApp = telegramWebApp.isTelegramWebApp();
      setIsTelegramApp(isApp);
      
      if (isApp) {
        const tgUser = telegramWebApp.getTelegramUser();
        setUser(tgUser || null);
        
        // Setup theme detection
        if (window.Telegram?.WebApp) {
          const webApp = window.Telegram.WebApp;
          setTheme(webApp.colorScheme);
          setIsExpanded(webApp.isExpanded);
          
          // Listen for theme changes
          webApp.onEvent('themeChanged', () => {
            setTheme(webApp.colorScheme);
          });
          
          webApp.onEvent('viewportChanged', () => {
            setIsExpanded(webApp.isExpanded);
          });
        }
      }
    };

    checkTelegramApp();
  }, []);

  const hapticFeedback = {
    light: () => telegramWebApp.hapticImpact('light'),
    medium: () => telegramWebApp.hapticImpact('medium'),
    heavy: () => telegramWebApp.hapticImpact('heavy'),
    success: () => telegramWebApp.hapticNotification('success'),
    error: () => telegramWebApp.hapticNotification('error'),
    warning: () => telegramWebApp.hapticNotification('warning'),
    selection: () => telegramWebApp.hapticSelection()
  };

  const cloudStorage = {
    save: (key: string, value: string) => telegramWebApp.saveToCloud(key, value),
    get: (key: string) => telegramWebApp.getFromCloud(key)
  };

  const ui = {
    showMainButton: (text: string, callback: () => void) => 
      telegramWebApp.showMainButton(text, callback),
    hideMainButton: () => telegramWebApp.hideMainButton(),
    showBackButton: (callback: () => void) => 
      telegramWebApp.showBackButton(callback),
    hideBackButton: () => telegramWebApp.hideBackButton(),
    showAlert: (message: string) => telegramWebApp.showAlert(message),
    showConfirm: (message: string) => telegramWebApp.showConfirm(message),
    scanQR: () => telegramWebApp.showQRScanner(),
    close: () => telegramWebApp.close()
  };

  const sharing = {
    sendData: (data: any) => telegramWebApp.sendDataToBot(data)
  };

  return {
    isTelegramApp,
    user,
    theme,
    isExpanded,
    hapticFeedback,
    cloudStorage,
    ui,
    sharing
  };
}