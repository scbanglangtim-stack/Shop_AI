module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@constants': './src/constants',
          '@contexts': './src/contexts',
          '@data': './src/data',
          '@hooks': './src/hooks',
          '@types': './src/types',
        },
      },
    ],
  ],
};

