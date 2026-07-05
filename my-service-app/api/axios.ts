import axios, { isAxiosError } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { deleteToken, getToken } from '../src/services/tokenStorage';

/**
 * Laravel API base URL.
 * - Physical iPhone/Android: set EXPO_PUBLIC_API_URL in .env to your PC's LAN IP.
 * - Android emulator: defaults to 10.0.2.2 (host machine).
 * - iOS simulator / Expo Web: defaults to localhost.
 */
function resolveApiBaseUrl(): string {
  const envUrl = Constants.expoConfig?.extra?.apiUrl as string | undefined;

  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  return (
    Platform.select({
      android: 'http://10.0.2.2:8000',
      ios: 'http://localhost:8000',
      default: 'http://localhost:8000',
    }) ?? 'http://localhost:8000'
  );
}

export const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      await deleteToken();
    }

    return Promise.reject(error);
  },
);

export default api;
