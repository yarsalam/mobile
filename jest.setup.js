jest.mock('react-native-device-info', () => ({
  __esModule: true,
  default: {
    getBrand: jest.fn(() => 'test-brand'),
    getModel: jest.fn(() => 'test-model'),
    getUniqueId: jest.fn(async () => 'test-device-id'),
    getSystemVersion: jest.fn(() => 'test-os-version'),
    getVersion: jest.fn(() => '0.0.0-test'),
  },
}));

jest.mock('@notifee/react-native', () => {
  const notifee = {
    onForegroundEvent: jest.fn(() => jest.fn()),
    onBackgroundEvent: jest.fn(),
    requestPermission: jest.fn(async () => ({authorizationStatus: 1})),
    getNotificationSettings: jest.fn(async () => ({authorizationStatus: 1})),
    getInitialNotification: jest.fn(async () => null),
    getChannels: jest.fn(async () => []),
    createChannel: jest.fn(async () => 'test-channel'),
    createChannelGroup: jest.fn(async () => 'test-group'),
    displayNotification: jest.fn(async () => undefined),
    cancelNotification: jest.fn(async () => undefined),
    cancelAllNotifications: jest.fn(async () => undefined),
    createTriggerNotification: jest.fn(async () => undefined),
    stopForegroundService: jest.fn(async () => undefined),
    registerForegroundService: jest.fn(),
  };
  return {
    __esModule: true,
    default: notifee,
    ...notifee,
    AndroidImportance: {NONE: 0, MIN: 1, LOW: 2, DEFAULT: 3, HIGH: 4},
    AndroidVisibility: {SECRET: -1, PRIVATE: 0, PUBLIC: 1},
    AndroidCategory: {CALL: 'call', MESSAGE: 'msg', ALARM: 'alarm', SERVICE: 'service'},
    EventType: {UNKNOWN: -1, DISMISSED: 0, PRESS: 1, ACTION_PRESS: 2, DELIVERED: 3, APP_BLOCKED: 4, CHANNEL_BLOCKED: 5, CHANNEL_GROUP_BLOCKED: 6, TRIGGER_NOTIFICATION_CREATED: 7},
    AuthorizationStatus: {NOT_DETERMINED: -1, DENIED: 0, AUTHORIZED: 1, PROVISIONAL: 2},
    TriggerType: {TIMESTAMP: 0, INTERVAL: 1},
  };
});

jest.mock('react-native-background-fetch', () => {
  const backgroundFetch = {
    configure: jest.fn(async (_options, onEvent) => {
      backgroundFetch.onEvent = onEvent;
      return 0;
    }),
    finish: jest.fn(),
    start: jest.fn(async () => 0),
    stop: jest.fn(async () => 0),
    status: jest.fn(async () => 0),
    onEvent: null,
  };
  return {
    __esModule: true,
    default: backgroundFetch,
    ...backgroundFetch,
    NETWORK_TYPE_NONE: 0,
    NETWORK_TYPE_ANY: 1,
    NETWORK_TYPE_UNMETERED: 2,
    NETWORK_TYPE_NOT_ROAMING: 3,
    NETWORK_TYPE_CELLULAR: 4,
    FETCH_RESULT_NEW_DATA: 0,
    FETCH_RESULT_NO_DATA: 1,
    FETCH_RESULT_FAILED: 2,
  };
});
