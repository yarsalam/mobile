import React, {createContext, useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {io, Socket} from 'socket.io-client';
import {useAuth} from './AuthContext';
import {useQueryClient} from '@tanstack/react-query';
import {useToast} from './ToastContext';
import notifee from '@notifee/react-native';
import {API_BASE_URL} from '../config/api';

export const NotificationSocketContext = createContext<{
  socket: Socket | null;
} | null>(null);

export const NotificationSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {user, token} = useAuth();
  const queryClient = useQueryClient();
  const {showToast} = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!user?.id || !token) {
      setSocket(current => {
        current?.disconnect();
        return null;
      });
      return;
    }

    const socketUrl = API_BASE_URL.replace(/\/$/, '') + '/notification';
    const newSocket = io(socketUrl, {
      auth: {token},
      transports: ['websocket'],
      reconnection: true,
    });

    newSocket.on('notification', async (notif: {message?: string; type?: string}) => {
      await Promise.all([
        queryClient.invalidateQueries({queryKey: ['unread-notifications']}),
        queryClient.invalidateQueries({queryKey: ['notifications']}),
        queryClient.invalidateQueries({queryKey: ['interaction-count']}),
        queryClient.invalidateQueries({queryKey: ['system-count']}),
        queryClient.invalidateQueries({queryKey: ['interactions']}),
        queryClient.invalidateQueries({queryKey: ['system-notifications']}),
        queryClient.invalidateQueries({queryKey: ['badges']}),
      ]);

      const message = notif?.message || 'اعلان جدید دریافت شد';
      if (appStateRef.current === 'active') {
        showToast(message, 'info', undefined, notif?.type);
      } else {
        await notifee.displayNotification({
          title: 'یارسلام',
          body: message,
          android: {
            channelId: 'default_channel_v2',
            pressAction: {id: 'default'},
          },
        });
      }
    });

    setSocket(newSocket);
    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
      setSocket(current => (current === newSocket ? null : current));
    };
  }, [user?.id, token, queryClient, showToast]);

  return (
    <NotificationSocketContext.Provider value={{socket}}>
      {children}
    </NotificationSocketContext.Provider>
  );
};
