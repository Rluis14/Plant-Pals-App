module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo(nent)?|@expo|expo-router|@expo/vector-icons|@testing-library|@react-native-async-storage|@react-native-community|@react-navigation|react-native-reanimated|react-native-safe-area-context|react-native-screens|react-native-svg|react-native-web|@unimodules|unimodules|sentry-expo|native-base|@react-native-picker|@shopify|@gorhom|moti|solito)/)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};