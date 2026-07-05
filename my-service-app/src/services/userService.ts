import api from '../../api/axios';

import type { AuthUser } from './authService';

export async function fetchProfile(): Promise<AuthUser> {
  const { data } = await api.get<{ user: AuthUser }>('/api/user');
  return data.user;
}

export async function updateProfile(name: string): Promise<AuthUser> {
  const { data } = await api.patch<{ user: AuthUser }>('/api/user', { name });
  return data.user;
}
