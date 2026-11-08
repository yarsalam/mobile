// Native modules are unavailable in the Node-based Jest environment.
jest.mock('react-native-device-info', () => ({
  getBrand: jest.fn(() => 'jest'),
  getModel: jest.fn(() => 'jest-model'),
  getUniqueId: jest.fn(async () => 'jest-device-id'),
  getSystemVersion: jest.fn(() => '0'),
  getVersion: jest.fn(() => '0.0.0'),
}));

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn(async () => ({})),
    createChannel: jest.fn(async () => 'default_channel_v2'),
    displayNotification: jest.fn(async () => undefined),
  },
  AndroidImportance: {HIGH: 4},
}));

jest.mock('react-native-background-fetch', () => ({
  __esModule: true,
  default: {
    configure: jest.fn(),
    finish: jest.fn(),
    stop: jest.fn(),
  },
  NETWORK_TYPE_ANY: 1,
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-screens', () =>
  require('react-native-screens/mock'),
);

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock'),
);
