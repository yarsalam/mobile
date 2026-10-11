import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import notifee, {AndroidImportance} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ همون تابع — کپی کن یا از یه فایل مشترک import کن
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

// ✅ Headless Task — فقط وقتی اپ killed است اجرا می‌شه
const HeadlessTask = async event => {
  await checkNotifications();
  BackgroundFetch.finish(event.taskId);
};

BackgroundFetch.registerHeadlessTask(HeadlessTask);

AppRegistry.registerComponent(appName, () => App);