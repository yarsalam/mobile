import React, {createContext, useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {io, Socket} from 'socket.io-client';
import {useAuth} from './AuthContext';
import {useQueryClient} from '@tanstack/react-query';
import {useToast} from './ToastContext';
import notifee from '@notifee/react-native';
import {API_BASE_URL} from '../config/api';
import {refreshNotificationQueries} from '../lib/notificationSync';

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
  const appStateRef = useRef<AppStateStatus>(
    AppState.currentState as AppStateStatus,
  );

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

    const seenNotificationIds = new Set<number>();
    const refreshInbox = () => refreshNotificationQueries(queryClient);

    const socketUrl = API_BASE_URL.replace(/\/$/, '') + '/notification';
    const newSocket = io(socketUrl, {
      auth: {token},
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 15000,
    });

    // Reconcile the local cache against the server-owned inbox on every
    // successful initial connection and reconnect.
    newSocket.on('connect', () => {
      void refreshInbox();
    });

    newSocket.on(
      'notification',
      async (notif: {
        id?: number;
        message?: string;
        type?: string;
      }) => {
        await refreshInbox();

        const notificationId = Number(notif?.id);
        if (Number.isSafeInteger(notificationId) && notificationId > 0) {
          if (seenNotificationIds.has(notificationId)) return;
          seenNotificationIds.add(notificationId);
          if (seenNotificationIds.size > 200) {
            const oldest = seenNotificationIds.values().next().value;
            if (oldest !== undefined) seenNotificationIds.delete(oldest);
          }
        }

        const message = notif?.message || 'اعلان جدید دریافت شد';
        const notificationType =
          notif?.type === 'message' || notif?.type === 'visitor'
            ? notif.type
            : undefined;

        if (appStateRef.current === 'active') {
          showToast(message, 'info', undefined, notificationType);
        } else {
          await notifee.displayNotification({
            id:
              Number.isSafeInteger(notificationId) && notificationId > 0
                ? `notification-${notificationId}`
                : undefined,
            title: 'یارسلام',
            body: message,
            android: {
              channelId: 'default_channel_v2',
              pressAction: {id: 'default'},
            },
          });
        }
      },
    );

    const appStateSubscription = AppState.addEventListener(
      'change',
      nextState => {
        appStateRef.current = nextState;
        if (nextState === 'active') {
          if (!newSocket.connected) newSocket.connect();
          else void refreshInbox();
        }
      },
    );

    setSocket(newSocket);
    return () => {
      appStateSubscription.remove();
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
