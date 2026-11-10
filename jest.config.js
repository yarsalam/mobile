module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // React Navigation and several React Native packages publish ESM. Transform
  // those packages with the React Native Babel preset instead of ignoring them.
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|react-navigation|react-native-gesture-handler|react-native-reanimated|react-native-safe-area-context|react-native-screens|@react-native-community|@react-native-async-storage)/',
  ],
};
