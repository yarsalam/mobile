import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A notification tapped while the app process is being started is routed
// after NavigationContainer becomes ready. No background polling is used.
notifee.onBackgroundEvent(async ({type}) => {
  if (type !== EventType.PRESS) return;
  try {
    await AsyncStorage.setItem('pending_notification_navigation', '1');
  } catch {
    // The app still opens; only the optional deep-link restoration is lost.
  }
});

AppRegistry.registerComponent(appName, () => App);
