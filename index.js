import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A notification tapped while the app process is being started is routed
// after NavigationContainer becomes ready. No background polling is used.
notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type !== EventType.PRESS) return;
  try {
    const rawId = detail.notification?.id;
    const match =
      typeof rawId === 'string' ? /^notification-(\d+)$/.exec(rawId) : null;
    if (match) {
      await AsyncStorage.setItem('pending_notification_click_id', match[1]);
    }
    await AsyncStorage.setItem('pending_notification_navigation', '1');
  } catch {
    // The app still opens; only optional click attribution/deep-link restoration is lost.
  }
});

AppRegistry.registerComponent(appName, () => App);
