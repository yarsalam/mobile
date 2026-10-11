import React, {createContext, useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {io, Socket} from 'socket.io-client';
import {useAuth} from './AuthContext';
import {useQueryClient} from '@tanstack/react-query';
import {useToast} from './ToastContext';
import notifee from '@notifee/react-native';

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

  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!user?.id || !token) return;

    const newSocket = io('http://192.168.0.133:5001/notification', {
      auth: {token},
      transports: ['websocket'],
    });

    newSocket.on('connect', () => console.log('✅ Socket connected'));

    newSocket.on('notification', async (notif: any) => {
      console.log('🔔 notification received, state:', AppState.currentState);

      // ✅ Real-time badge update — همه رو invalidate کن
      queryClient.invalidateQueries({queryKey: ['unread-notifications']});
      queryClient.invalidateQueries({queryKey: ['notifications']});
      queryClient.invalidateQueries({queryKey: ['interaction-count']});
      queryClient.invalidateQueries({queryKey: ['system-count']});
      queryClient.invalidateQueries({queryKey: ['interactions']});
      queryClient.invalidateQueries({queryKey: ['system-notifications']});
      await queryClient.refetchQueries({
        queryKey: ['badges'],
      });
      if (AppState.currentState === 'active') {
        showToast(notif.message, 'info', undefined, notif.type);
      } else {
        await notifee.displayNotification({
          title: 'یارسلام',
          body: notif.message,
          android: {
            channelId: 'default_channel_v2',
            pressAction: {id: 'default'},
          },
        });
      }
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user?.id, token]);

  return (
    <NotificationSocketContext.Provider value={{socket}}>
      {children}
    </NotificationSocketContext.Provider>
  );
};
