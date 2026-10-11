import {NavigationContainer} from '@react-navigation/native';
import {MainProvider} from './src/context/MainContext';
import {AuthProvider} from './src/context/AuthContext';
import {NotificationSocketProvider} from './src/context/NotificationContext';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {ToastProvider} from './src/context/ToastContext';
import {navigationRef} from './src/lib/navigationRef';
import {ImageProvider} from './src/context/ImageContext';
import {FilterProvider} from './src/context/FilterContext';
import {AppInitializer} from './src/components/user/AppInitializer';
import {Host} from 'react-native-portalize';
import {HintTourProvider} from './src/components/hints/HintTourContext';
import {useEffect} from 'react';
import notifee, {AndroidImportance} from '@notifee/react-native';
import BackgroundFetch from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from './src/config/api';
import {getDeviceHeaders} from './src/lib/deviceInfo';

const queryClient = new QueryClient();

async function checkNotifications() {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) return;

    const deviceHeaders = await getDeviceHeaders();
    const res = await fetch(`${API_BASE_URL}/notifications/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...deviceHeaders,
      },
    });

    if (!res.ok) return;

    const data = await res.json();
    if (!data?.hasUnread) return;

    await notifee.createChannel({
      id: 'default_channel_v2',
      name: 'نوتیفیکیشن‌های یارسلام',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: 'یارسلام',
      body: `${Number(data.count) || 0} پیام جدید دارید`,
      android: {
        channelId: 'default_channel_v2',
        pressAction: {id: 'default'},
      },
    });
  } catch (error) {
    // Background checks should not crash app startup.
    if (__DEV__) console.warn('[checkNotifications] request failed');
  }
}

const App = () => {
  useEffect(() => {
    async function init() {
      try {
        await notifee.requestPermission();
        await notifee.createChannel({
          id: 'default_channel_v2',
          name: 'نوتیفیکیشن‌های یارسلام',
          importance: AndroidImportance.HIGH,
        });

        BackgroundFetch.configure(
          {
            minimumFetchInterval: 15,
            stopOnTerminate: false,
            startOnBoot: true,
            enableHeadless: true,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
          },
          async taskId => {
            try {
              await checkNotifications();
            } finally {
              BackgroundFetch.finish(taskId);
            }
          },
          error => {
            if (__DEV__) console.warn('[BackgroundFetch] configuration failed', error);
          },
        );
      } catch (error) {
        if (__DEV__) console.warn('[BackgroundFetch] initialization failed', error);
      }
    }

    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MainProvider>
          <Host>
            <HintTourProvider>
              <NavigationContainer ref={navigationRef}>
                <AuthProvider>
                  <NotificationSocketProvider>
                    <ImageProvider>
                      <FilterProvider>
                        <AppInitializer />
                      </FilterProvider>
                    </ImageProvider>
                  </NotificationSocketProvider>
                </AuthProvider>
              </NavigationContainer>
            </HintTourProvider>
          </Host>
        </MainProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
