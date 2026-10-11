import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Platform, Alert } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

const NOTIFICATION_SOCKET_URL = 'http://192.168.0.133:5001/notification'; // namespace

export const useNotificationSocket = () => {
  const { token, user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token || !user) return;

    const socket = io(NOTIFICATION_SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Notification socket connected');
    });

    socket.on('notification', async (payload: any) => {
      console.log('New notification:', payload);
      // به‌روزرسانی کش react-query (اگر صفحه لیست باز باشد)
      queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', user.id] });

      // نمایش نوتیفیکیشن محلی
      try {
        await notifee.displayNotification({
          title: payload.type === 'message' ? 'پیام جدید' : 'بازدید جدید',
          body: payload.message,
          data: { ...payload, screen: payload.type === 'message' ? 'Chat' : 'UserProfile' },
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            smallIcon: 'ic_notification', // باید در مسیر mipmap تعریف شود
            pressAction: { id: 'default' },
          },
          ios: {
            sound: 'default',
          },
        });
      } catch (error) {
        console.log('Local notification error:', error);
      }
    });

    // مدیریت کلیک روی نوتیفیکیشن وقتی اپ باز است یا از پس‌زمینه می‌آید
    const unsubscribeForegroundEvent = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleNotificationPress(detail.notification?.data);
      }
    });

    const unsubscribeBackgroundEvent = notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        // اینجا navigation در دسترس نیست، باید با روش دیگری صفحه را باز کرد
        // معمولاً از deep link یا ذخیره‌سازی state استفاده می‌کنیم
        // فعلاً می‌گذاریم بعداً کامل شود
      }
    });

    return () => {
      socket.disconnect();
      unsubscribeForegroundEvent();
      // background event نیازی به پاک‌سازی ندارد
    };
  }, [token, user]);

  const handleNotificationPress = (data: any) => {
    if (!data) return;
    if (data.screen === 'Chat') {
      navigation.navigate('Chat', { userId: data.related_id, nickname: data.message });
    } else if (data.screen === 'UserProfile') {
      navigation.navigate('UserProfile', { user: data.related_id });
    }
  };

  return null;
};