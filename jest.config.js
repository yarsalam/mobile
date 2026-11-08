module.exports = {
  preset: '@react-native/jest-preset',
  // React Navigation 7 ships ESM entrypoints. Let Babel transform those packages.
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-safe-area-context|react-native-screens)/',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
