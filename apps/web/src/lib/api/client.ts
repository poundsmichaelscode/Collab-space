import { useAuthStore } from '@/store/auth-store';
import type { ApiEnvelope, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
let refreshPromise: Promise<void> | null = null;

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function buildHeaders(init?: RequestInit) {
  const token = useAuthStore.getState().accessToken;
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('Content-Type') && init?.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const store = useAuthStore.getState();
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: store.refreshToken })
      });
      if (!response.ok) {
        useAuthStore.getState().clearSession();
        throw new Error('Session expired');
      }
      const payload = (await response.json()) as ApiEnvelope<{ accessToken: string; refreshToken: string; user: User }>;
      useAuthStore.getState().updateAccessToken(payload.data);
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiClient<T>(path: string, init?: RequestInit, retried = false): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: buildHeaders(init),
    cache: 'no-store',
    credentials: 'include'
  });
  const payload = await response.json().catch(() => null);

  if (response.status === 401 && !retried && !String(path).includes('/auth/login') && !String(path).includes('/auth/register')) {
    await refreshAccessToken();
    return apiClient<T>(path, init, true);
  }

  if (!response.ok) {
    throw new ApiError(payload?.error?.message ?? 'Request failed', response.status, payload?.error?.code);
  }
  return (payload as ApiEnvelope<T>).data;
}
