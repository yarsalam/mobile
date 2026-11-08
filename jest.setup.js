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
