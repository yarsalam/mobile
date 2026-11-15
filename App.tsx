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
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient();

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
      } catch {
        if (__DEV__) console.warn('[notifications] local presentation setup failed');
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
              <NavigationContainer
                ref={navigationRef}
                onReady={async () => {
                  const pending = await AsyncStorage.getItem(
                    'pending_notification_navigation',
                  );
                  if (pending === '1') {
                    await AsyncStorage.removeItem(
                      'pending_notification_navigation',
                    );
                    navigationRef.navigate('Notifications');
                  }
                }}>
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
