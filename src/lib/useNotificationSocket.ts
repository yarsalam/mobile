import {useEffect, useRef} from 'react';
import {io, Socket} from 'socket.io-client';
import {useAuth} from '../context/AuthContext';
import {Platform, Alert} from 'react-native';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {API_BASE_URL} from '../config/api';

export const useNotificationSocket = () => {
  const {token, user} = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token || !user) return;

    const socketUrl = API_BASE_URL.replace(/\/$/, '') + '/notification';
    const socket = io(socketUrl, {
      auth: {token},
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('notification', async (payload: any) => {
      queryClient.invalidateQueries({queryKey: ['notifications', user.id]});
      queryClient.invalidateQueries({queryKey: ['unread-notifications', user.id]});
      try {
        await notifee.displayNotification({
          title: payload.type === 'message' ? 'پیام جدید' : 'بازدید جدید',
          body: payload.message,
          data: {...payload, screen: payload.type === 'message' ? 'Chat' : 'UserProfile'},
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            smallIcon: 'ic_notification',
            pressAction: {id: 'default'},
          },
          ios: {sound: 'default'},
        });
      } catch {
        // Notification display can fail when the OS permission/channel is unavailable.
      }
    });

    const unsubscribeForegroundEvent = notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) handleNotificationPress(detail.notification?.data);
    });
    const unsubscribeBackgroundEvent = notifee.onBackgroundEvent(async () => {
      // Background navigation must be handled by the app's deep-link/bootstrap flow.
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      unsubscribeForegroundEvent();
      void unsubscribeBackgroundEvent;
      socketRef.current = null;
    };
  }, [token, user?.id, queryClient]);

  const handleNotificationPress = (data: any) => {
    if (!data) return;
    if (data.screen === 'Chat') {
      navigation.navigate('Chat', {userId: data.related_id, nickname: data.message});
    } else if (data.screen === 'UserProfile') {
      navigation.navigate('UserProfile', {userId: data.related_id});
    }
  };

  return socketRef;
};
