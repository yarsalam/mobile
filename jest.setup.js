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

jest.mock('@react-native-async-storage/async-storage', () => {
  const values = new Map();
  const storage = {
    getItem: jest.fn(async (key) => values.get(key) ?? null),
    setItem: jest.fn(async (key, value) => {
      values.set(key, value);
    }),
    removeItem: jest.fn(async (key: string) => {
      values.delete(key);
    }),
    clear: jest.fn(async () => values.clear()),
    getAllKeys: jest.fn(async () => Array.from(values.keys())),
    multiGet: jest.fn(async (keys) =>
      keys.map(key => [key, values.get(key) ?? null]),
    ),
    multiSet: jest.fn(async (pairs) => {
      pairs.forEach(([key, value]) => values.set(key, value));
    }),
    multiRemove: jest.fn(async (keys: string[]) => {
      keys.forEach(key => values.delete(key));
    }),
  };
  return {__esModule: true, default: storage, ...storage};
});

jest.mock('react-native-screens', () =>
  require('react-native-screens/mock'),
);

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock'),
);
