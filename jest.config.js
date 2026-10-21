// jest.config.js
module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/shopai-backend/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/types/**',
    '!src/constants/**',
  ],
  coverageThreshold: {
    global: {
      statements: 5,
      branches: 0,
      functions: 1,
      lines: 5,
    },
    './src/utils/formatCurrency.ts': {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90,
    },
    './src/store/useCartStore.ts': {
      statements: 70,
      branches: 40,
      functions: 70,
      lines: 70,
    },
    './src/components/ui/ShopButton.tsx': {
      statements: 80,
      branches: 50,
      functions: 80,
      lines: 80,
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@shopify/flash-list|react-redux|@reduxjs|immer|redux)/)',
  ],
};
