import React, {createContext, useCallback, useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {io, Socket} from 'socket.io-client';
import {useAuth} from './AuthContext';
import {useQueryClient} from '@tanstack/react-query';
import {useToast} from './ToastContext';
import notifee, {EventType} from '@notifee/react-native';
import {navigationRef} from '../lib/navigationRef';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchWithAuth} from '../lib/fetchWithAuth';
import {API_BASE_URL} from '../config/api';
import {refreshNotificationQueries} from '../lib/notificationSync';
import {consumePendingNotificationTap} from '../lib/notificationTap';

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
  const pendingTapProcessingRef = useRef(false);

  const consumeQueuedNotificationTap = useCallback(async (
    allowNavigation: boolean,
  ) => {
    if (!user?.id || !token || pendingTapProcessingRef.current) return;
    pendingTapProcessingRef.current = true;
    try {
      await consumePendingNotificationTap({
        storage: {
          getItem: key => AsyncStorage.getItem(key),
          removeItem: key => AsyncStorage.removeItem(key),
        },
        allowNavigation,
        isNavigationReady: () => navigationRef.isReady(),
        navigateToNotifications: () => navigationRef.navigate('Notifications'),
        markClicked: notificationId =>
          fetchWithAuth(`/notifications/click/${notificationId}`, {
            method: 'POST',
          }),
      });
    } catch {
      if (__DEV__) {
        console.warn('[notifications] could not consume pending notification tap');
      }
    } finally {
      pendingTapProcessingRef.current = false;
    }
  }, [user?.id, token]);

  // NavigationContainer.onReady handles cold-start routing; this consumes only
  // click attribution so the two paths cannot navigate twice.
  useEffect(() => {
    consumeQueuedNotificationTap(false).catch(() => undefined);
  }, [consumeQueuedNotificationTap]);

  useEffect(() => {
    if (!user?.id || !token) return;
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type !== EventType.PRESS) return;
      const rawId = detail.notification?.id;
      const match =
        typeof rawId === 'string' ? /^notification-(\\d+)$/.exec(rawId) : null;
      if (match) {
        fetchWithAuth(`/notifications/click/${Number(match[1])}`, {
          method: 'POST',
        }).catch(() => undefined);
      }
      if (navigationRef.isReady()) navigationRef.navigate('Notifications');
    });
    return unsubscribe;
  }, [user?.id, token]);

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
    const refreshInbox = () =>
      refreshNotificationQueries(queryClient).catch(() => undefined);

    const socketUrl = API_BASE_URL.replace(/\\/$/, '') + '/notification';
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
    newSocket.on('connect', refreshInbox);

    newSocket.on(
      'notification',
      async (notif: {
        id?: number;
        message?: string;
        type?: string;
      }) => {
        // The Socket.IO event is already authenticated and persisted by the
        // backend. Start reconciliation but do not wait for HTTP before showing it.
        refreshInbox();

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
          try {
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
          } catch {
            if (__DEV__) {
              console.warn('[notifications] local display failed');
            }
          }
        }
      },
    );

    const appStateSubscription = AppState.addEventListener(
      'change',
      nextState => {
        appStateRef.current = nextState;
        if (nextState === 'active') {
          // A tap saved while this process was backgrounded is consumed here.
          // Cold-start routing remains owned by NavigationContainer.onReady.
          consumeQueuedNotificationTap(true).catch(() => undefined);
          if (!newSocket.connected) newSocket.connect();
          else refreshInbox();
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
  }, [user?.id, token, queryClient, showToast, consumeQueuedNotificationTap]);

  return (
    <NotificationSocketContext.Provider value={{socket}}>
      {children}
    </NotificationSocketContext.Provider>
  );
};
