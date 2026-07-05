require('dotenv').config();

module.exports = ({ config }) => ({
  ...config,
  plugins: [...(config.plugins ?? []), '@react-native-community/datetimepicker'],
  extra: {
    ...config.extra,
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
  },
});
