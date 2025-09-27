export async function requestNotificationPermission(): Promise<boolean> {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function showNotification(title: string, options: {
  body?: string;
  tag?: string;
  actions?: NotificationAction[];
} = {}): void {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body: options.body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          tag: options.tag,
          requireInteraction: false,
          actions: options.actions || [],
        });
      });
    }
  }
}
