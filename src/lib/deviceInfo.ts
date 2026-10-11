import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export async function getDeviceHeaders() {
  const brand = DeviceInfo.getBrand();
  const model = DeviceInfo.getModel();
  const deviceId = await DeviceInfo.getUniqueId();
  const osVersion = DeviceInfo.getSystemVersion();
  const appVersion = DeviceInfo.getVersion();

  return {
    'X-Platform': Platform.OS,
    'X-Brand': brand,
    'X-Model': model,
    'X-Device-Id': deviceId,
    'X-App-Version': appVersion,
    'X-OS-Version': osVersion,
  };
}
