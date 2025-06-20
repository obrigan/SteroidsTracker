
export class NotificationService {
  private static instance: NotificationService;
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  scheduleInjectionReminder(nextInjectionDate: Date, compound: string) {
    const now = new Date();
    const timeDiff = nextInjectionDate.getTime() - now.getTime();
    
    if (timeDiff > 0) {
      setTimeout(() => {
        this.showNotification(
          'Время инъекции! 💉',
          `Пора делать инъекцию ${compound}`,
          '/injections'
        );
      }, timeDiff);
    }
  }

  scheduleBloodTestReminder(daysUntilTest: number) {
    const reminderTime = (daysUntilTest - 1) * 24 * 60 * 60 * 1000; // 1 day before
    
    setTimeout(() => {
      this.showNotification(
        'Напоминание об анализах 🩸',
        'Завтра нужно сдать анализы крови',
        '/blood-tests'
      );
    }, reminderTime);
  }

  private showNotification(title: string, body: string, url?: string) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/manifest-icon-192.png',
        badge: '/manifest-icon-192.png',
        tag: 'steroid-tracker',
        requireInteraction: true
      });

      if (url) {
        notification.onclick = () => {
          window.focus();
          window.location.href = url;
          notification.close();
        };
      }
    }
  }
}
