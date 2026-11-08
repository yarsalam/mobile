module.exports = {
  preset: '@react-native/jest-preset',
  // React Navigation 7 ships ESM entrypoints. Let Metro's Babel preset
  // transform this package (and its native peers) in Jest instead of loading
  // raw "export" statements in Node's CommonJS runtime.
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-safe-area-context|react-native-screens)/',
  ],
};
