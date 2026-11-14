import React, {createContext, useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {io, Socket} from 'socket.io-client';
import {useAuth} from './AuthContext';
import {useQueryClient} from '@tanstack/react-query';
import {useToast} from './ToastContext';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {API_BASE_URL} from '../config/api';
import {fetchWithAuth} from '../lib/fetchWithAuth';
import {navigationRef} from '../lib/navigationRef';
import {
  registerRemotePushDevice,
  syncRemotePushToken,
} from '../lib/pushNotifications';

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

    let active = true;
    let unsubscribeTokenRefresh: (() => void) | undefined;
    let unsubscribeForegroundMessage: (() => void) | undefined;
    let unsubscribeNotificationOpen: (() => void) | undefined;
    let unsubscribeNotifeePress: (() => void) | undefined;

    const invalidateNotificationQueries = async () => {
      await Promise.all([
        queryClient.invalidateQueries({queryKey: ['unread-notifications']}),
        queryClient.invalidateQueries({queryKey: ['notifications']}),
        queryClient.invalidateQueries({queryKey: ['interaction-count']}),
        queryClient.invalidateQueries({queryKey: ['system-count']}),
        queryClient.invalidateQueries({queryKey: ['interactions']}),
        queryClient.invalidateQueries({queryKey: ['system-notifications']}),
        queryClient.invalidateQueries({queryKey: ['badges']}),
      ]);
    };

    const handleRemoteNotificationOpen = async (
      data?: Record<string, string> | null,
    ) => {
      const notificationId = Number(data?.notificationId);
      if (Number.isSafeInteger(notificationId) && notificationId > 0) {
        try {
          await fetchWithAuth(`/notifications/click/${notificationId}`, {
            method: 'POST',
          });
        } catch {
          // Opening the app must never be blocked by analytics delivery.
        }
      }

      await invalidateNotificationQueries();
      if (navigationRef.isReady()) {
        navigationRef.navigate('Notifications');
      }
    };

    const socketUrl = API_BASE_URL.replace(/\/$/, '') + '/notification';
    const newSocket = io(socketUrl, {
      auth: {token},
      transports: ['websocket'],
      reconnection: true,
    });

    newSocket.on(
      'notification',
      async (notif: {message?: string; type?: string}) => {
        await invalidateNotificationQueries();

        const message = notif?.message || 'اعلان جدید دریافت شد';
        const notificationType =
          notif?.type === 'message' || notif?.type === 'visitor'
            ? notif.type
            : undefined;

        if (appStateRef.current === 'active') {
          showToast(message, 'info', undefined, notificationType);
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
      },
    );

    setSocket(newSocket);

    // FCM is optional until the owner supplies the Android/iOS Firebase app
    // configuration. Failure here must not disable WebSocket/local fallback.
    const initialiseRemotePush = async () => {
      await registerRemotePushDevice();
      if (!active) return;

      unsubscribeTokenRefresh = messaging().onTokenRefresh(newToken => {
        void syncRemotePushToken(newToken).catch(error => {
          if (__DEV__) {
            console.warn('[FCM] token refresh registration failed', error);
          }
        });
      });

      unsubscribeForegroundMessage = messaging().onMessage(
        async remoteMessage => {
          if (!active) return;

          const title = remoteMessage.notification?.title || 'یارسلام';
          const body =
            remoteMessage.notification?.body || 'اعلان جدید دریافت شد';

          await notifee.displayNotification({
            title,
            body,
            data: remoteMessage.data,
            android: {
              channelId: 'default_channel_v2',
              pressAction: {id: 'default'},
            },
            ios: {sound: 'default'},
          });
          await invalidateNotificationQueries();
        },
      );

      unsubscribeNotificationOpen = messaging().onNotificationOpenedApp(
        remoteMessage => {
          void handleRemoteNotificationOpen(remoteMessage.data);
        },
      );

      unsubscribeNotifeePress = notifee.onForegroundEvent(({type, detail}) => {
        if (type === EventType.PRESS) {
          const data = detail.notification?.data as
            | Record<string, string>
            | undefined;
          void handleRemoteNotificationOpen(data);
        }
      });

      const initialMessage = await messaging().getInitialNotification();
      if (initialMessage?.data) {
        await handleRemoteNotificationOpen(initialMessage.data);
      }
    };

    void initialiseRemotePush().catch(error => {
      if (__DEV__) {
        console.warn(
          '[FCM] remote push is not configured on this app build',
          error,
        );
      }
    });

    return () => {
      active = false;
      unsubscribeTokenRefresh?.();
      unsubscribeForegroundMessage?.();
      unsubscribeNotificationOpen?.();
      unsubscribeNotifeePress?.();
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
