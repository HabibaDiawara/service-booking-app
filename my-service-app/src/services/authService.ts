import api from '../../api/axios';
import { getApiErrorMessage } from './apiErrors';
import { deleteToken, saveToken } from './tokenStorage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user?: AuthUser;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/api/login', credentials);
  await saveToken(data.token);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/api/logout');
  } finally {
    await deleteToken();
  }
}

export function getAuthErrorMessage(error: unknown): string {
  return getApiErrorMessage(error);
}
