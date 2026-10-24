import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import {API_BASE_URL} from '../config/api';

const NOTIFICATION_SOCKET_URL = API_BASE_URL.replace(/\/$/, '') + '/notification';

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

    socket.on('notification', async (payload: any) => {
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
      } catch {
        // OS notification delivery can fail when permissions or channels are unavailable.
      }
    });

    // مدیریت کلیک روی نوتیفیکیشن وقتی اپ باز است یا از پس‌زمینه می‌آید
    const unsubscribeForegroundEvent = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleNotificationPress(detail.notification?.data);
      }
    });

    // Background notification navigation is handled by the app bootstrap/deep-link flow.

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