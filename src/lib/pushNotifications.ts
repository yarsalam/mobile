import messaging from '@react-native-firebase/messaging';
import {fetchWithAuth} from './fetchWithAuth';
import {getDeviceHeaders} from './deviceInfo';

export async function syncRemotePushToken(pushToken: string | null) {
  const headers = await getDeviceHeaders();
  return fetchWithAuth('/user-device', {
    method: 'POST',
    body: JSON.stringify({
      deviceId: headers['X-Device-Id'],
      platform: 'mobile',
      brand: headers['X-Brand'],
      model: headers['X-Model'],
      osVersion: headers['X-OS-Version'],
      appVersion: headers['X-App-Version'],
      timezone: headers['X-Timezone'],
      pushToken,
      pushEnabled: Boolean(pushToken),
    }),
  });
}

export async function registerRemotePushDevice(): Promise<string | null> {
  const authorization = await messaging().requestPermission();
  const authorized =
    authorization === messaging.AuthorizationStatus.AUTHORIZED ||
    authorization === messaging.AuthorizationStatus.PROVISIONAL;

  if (authorized) {
    // iOS requires explicit remote-message registration before requesting a token.
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    await syncRemotePushToken(token);
    return token;
  }

  // Revoke a previous token when the user has denied/withdrawn notification permission.
  await syncRemotePushToken(null);
  return null;
}

export async function revokeRemotePushDevice(): Promise<void> {
  const headers = await getDeviceHeaders();
  await fetchWithAuth('/user-device/push', {
    method: 'DELETE',
    body: JSON.stringify({deviceId: headers['X-Device-Id']}),
  });
}
