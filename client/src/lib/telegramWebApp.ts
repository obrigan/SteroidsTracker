// Telegram WebApp API integration
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
      photo_url?: string;
    };
    chat?: {
      id: number;
      type: string;
      title?: string;
      username?: string;
    };
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;

  // Methods
  ready(): void;
  expand(): void;
  close(): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  enableVerticalSwipes(): void;
  disableVerticalSwipes(): void;
  onEvent(eventType: string, eventHandler: () => void): void;
  offEvent(eventType: string, eventHandler: () => void): void;
  sendData(data: string): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  openInvoice(url: string, callback?: (status: string) => void): void;
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text: string;
    }>;
  }, callback?: (buttonId: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
  showScanQrPopup(params: {
    text?: string;
  }, callback?: (text: string) => void): void;
  closeScanQrPopup(): void;
  readTextFromClipboard(callback?: (text: string) => void): void;
  requestWriteAccess(callback?: (granted: boolean) => void): void;
  requestContact(callback?: (granted: boolean, contact?: any) => void): void;

  // Haptic Feedback
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };

  // CloudStorage
  CloudStorage: {
    setItem(key: string, value: string, callback?: (error: string | null, stored: boolean) => void): void;
    getItem(key: string, callback?: (error: string | null, value: string) => void): void;
    getItems(keys: string[], callback?: (error: string | null, values: Record<string, string>) => void): void;
    removeItem(key: string, callback?: (error: string | null, removed: boolean) => void): void;
    removeItems(keys: string[], callback?: (error: string | null, removed: boolean) => void): void;
    getKeys(callback?: (error: string | null, keys: string[]) => void): void;
  };

  // MainButton
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    setParams(params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }): void;
  };

  // BackButton
  BackButton: {
    isVisible: boolean;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
  };

  // SettingsButton
  SettingsButton: {
    isVisible: boolean;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export class TelegramWebAppService {
  private static instance: TelegramWebAppService;
  private tg: TelegramWebApp | null = null;

  private constructor() {
    this.initTelegramWebApp();
  }

  static getInstance(): TelegramWebAppService {
    if (!TelegramWebAppService.instance) {
      TelegramWebAppService.instance = new TelegramWebAppService();
    }
    return TelegramWebAppService.instance;
  }

  private initTelegramWebApp() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.tg = window.Telegram.WebApp;
      this.tg.ready();
      this.tg.expand();
      this.setupTheme();
    }
  }

  isTelegramWebApp(): boolean {
    return this.tg !== null;
  }

  getTelegramUser() {
    return this.tg?.initDataUnsafe.user;
  }

  getInitData(): string {
    return this.tg?.initData || '';
  }

  private setupTheme() {
    if (!this.tg) return;

    // Apply Telegram theme colors to CSS variables
    const themeParams = this.tg.themeParams;
    const root = document.documentElement;

    if (themeParams.bg_color) {
      root.style.setProperty('--tg-bg-color', themeParams.bg_color);
    }
    if (themeParams.text_color) {
      root.style.setProperty('--tg-text-color', themeParams.text_color);
    }
    if (themeParams.button_color) {
      root.style.setProperty('--tg-button-color', themeParams.button_color);
    }

    // Set app colors
    this.tg.setHeaderColor('#000000');
    this.tg.setBackgroundColor('#000000');
  }

  // Haptic feedback methods
  hapticImpact(style: 'light' | 'medium' | 'heavy' = 'medium') {
    this.tg?.HapticFeedback.impactOccurred(style);
  }

  hapticNotification(type: 'error' | 'success' | 'warning') {
    this.tg?.HapticFeedback.notificationOccurred(type);
  }

  hapticSelection() {
    this.tg?.HapticFeedback.selectionChanged();
  }

  // Main button methods
  showMainButton(text: string, callback: () => void) {
    if (!this.tg) return;
    
    this.tg.MainButton.setText(text);
    this.tg.MainButton.onClick(callback);
    this.tg.MainButton.show();
  }

  hideMainButton() {
    this.tg?.MainButton.hide();
  }

  // Back button methods
  showBackButton(callback: () => void) {
    if (!this.tg) return;
    
    this.tg.BackButton.onClick(callback);
    this.tg.BackButton.show();
  }

  hideBackButton() {
    this.tg?.BackButton.hide();
  }

  // Cloud storage methods
  async saveToCloud(key: string, value: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.tg) {
        resolve(false);
        return;
      }

      this.tg.CloudStorage.setItem(key, value, (error, stored) => {
        resolve(!error && stored);
      });
    });
  }

  async getFromCloud(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.tg) {
        resolve(null);
        return;
      }

      this.tg.CloudStorage.getItem(key, (error, value) => {
        resolve(error ? null : value);
      });
    });
  }

  // Show native popups
  showAlert(message: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.tg) {
        alert(message);
        resolve();
        return;
      }

      this.tg.showAlert(message, () => resolve());
    });
  }

  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.tg) {
        resolve(confirm(message));
        return;
      }

      this.tg.showConfirm(message, (confirmed) => resolve(confirmed));
    });
  }

  // QR Scanner
  showQRScanner(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.tg) {
        resolve(null);
        return;
      }

      this.tg.showScanQrPopup({
        text: 'Сканируйте QR-код для быстрого добавления данных'
      }, (text) => {
        resolve(text);
      });
    });
  }

  // Share data with bot
  sendDataToBot(data: any) {
    if (!this.tg) return;
    
    this.tg.sendData(JSON.stringify(data));
  }

  // Close app
  close() {
    this.tg?.close();
  }
}

export const telegramWebApp = TelegramWebAppService.getInstance();