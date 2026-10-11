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

const queryClient = new QueryClient();

// ✅ خارج از component — هم App هم HeadlessTask استفاده می‌کنن
async function checkNotifications() {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) return;

    const res = await fetch('http://192.168.0.133:5001/notifications/pending', {
      headers: {Authorization: `Bearer ${token}`},
    });

    const data = await res.json();

    if (data.hasUnread) {
      await notifee.createChannel({
        id: 'default_channel_v2',
        name: 'نوتیفیکیشن‌های یارسلام',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: 'یارسلام',
        body: `${data.count} پیام جدید دارید`,
        android: {
          channelId: 'default_channel_v2',
          pressAction: {id: 'default'},
        },
      });
    }
  } catch (e) {
    console.log('[checkNotifications] error:', e);
  }
}

const App = () => {
  useEffect(() => {
    async function init() {
      const settings = await notifee.requestPermission();
      console.log('Permission status:', settings.authorizationStatus);

      await notifee.createChannel({
        id: 'default_channel_v2',
        name: 'نوتیفیکیشن‌های یارسلام',
        importance: AndroidImportance.HIGH,
      });

      // ✅ ثبت BackgroundFetch
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 1,
          stopOnTerminate: false, // بعد از kill هم ادامه بده
          startOnBoot: true,      // بعد از reboot شروع کن
          enableHeadless: true,   // حالت killed فعال
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        },
        async taskId => {
          // حالت foreground/background
          await checkNotifications();
          BackgroundFetch.finish(taskId);
        },
        error => {
          console.log('[BackgroundFetch] configure error:', error);
        },
      );
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