module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        alias: {
          '@': './app',
          '@component': './app/shared/component',
          '@shared': './app/shared',
          '@constants': './app/shared/constants',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react-native-reanimated/plugin', // ✅ MUST BE LAST
  ],
};
