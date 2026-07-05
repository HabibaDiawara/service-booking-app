import { isAxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return 'Connection timed out. Is Laravel running on your PC?';
      }

      return 'Cannot reach the server. Check EXPO_PUBLIC_API_URL in .env.';
    }

    const data = error.response.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;

    if (data?.errors) {
      const firstFieldError = Object.values(data.errors)[0]?.[0];
      if (firstFieldError) {
        return firstFieldError;
      }
    }

    if (data?.message) {
      return data.message;
    }
  }

  return fallback;
}
