import notifee, { AndroidImportance } from '@notifee/react-native';
import { io } from 'socket.io-client';

let bgSocket = null;

// این تابع در بک‌گراند اجرا می‌شود و سوکت را زنده نگه می‌دارد
export const startBackgroundSocketService = async (token, userId) => {
  // 1. ساخت کانال برای اندروید
  const channelId = await notifee.createChannel({
    id: 'persistent-socket',
    name: 'سرویس اتصال یارسلام',
    importance: AndroidImportance.LOW, // Low برای اینکه صدا ندهد
  });

  // 2. ساخت کانال برای نوتیفیکیشن‌های پیام جدید
  const messageChannelId = await notifee.createChannel({
    id: 'new-messages',
    name: 'پیام‌های جدید',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });

  // 3. ثبت سرویس همیشه روشن (Foreground Service)
  notifee.registerForegroundService(() => {
    return new Promise(() => {
      // این Promise هرگز resolve نمی‌شود تا سرویس زنده بماند
      
      if (!bgSocket) {
        bgSocket = io('http://YOUR_SERVER_IP:5001/notification', {
          auth: { token },
          transports: ['websocket'],
        });

        bgSocket.on('connect', () => console.log('BG Socket Connected'));

        // وقتی پیامی از سوکت در پس‌زمینه آمد
        bgSocket.on('notification', async (notif) => {
          console.log('BG Notification received:', notif);
          
          // 4. نمایش یک نوتیفیکیشن واقعی روی صفحه گوشی
          await notifee.displayNotification({
            title: 'یارسلام',
            body: notif.message,
            android: {
              channelId: messageChannelId,
              pressAction: {
                id: 'default',
                launchActivity: 'default', // کلیک روی آن اپ را باز کند
              },
            },
          });
        });

        bgSocket.on('disconnect', () => console.log('BG Socket Disconnected'));
      }
    });
  });

  // 5. استارت کردن سرویس همراه با نوتیفیکیشن چسبنده
  await notifee.displayNotification({
    title: 'یارسلام در حال اجراست',
    body: 'برای دریافت پیام‌های جدید...',
    android: {
      channelId,
      asForegroundService: true, // این خط حیاتی است! سیستم را مجبور می‌کند سوکت را نکشد
      ongoing: true, // کاربر نمی‌تواند این نوتیفیکیشن را با سوایپ حذف کند
    },
  });
};

export const stopBackgroundSocketService = async () => {
  if (bgSocket) {
    bgSocket.disconnect();
    bgSocket = null;
  }
  await notifee.stopForegroundService();
};