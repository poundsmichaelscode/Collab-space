'use client';

import { useEffect } from 'react';
import { connectSocket } from '@/lib/socket/client';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/store/auth-store';
import type { User } from '@/types';

export function useAuthBootstrap() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    if (!hydrated || !token) return;
    if (user) {
      connectSocket();
      return;
    }

    apiClient<{ user: User }>('/auth/me')
      .then((data) => {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          setSession({ accessToken: token, refreshToken, user: data.user });
          connectSocket();
        }
      })
      .catch(() => clearSession());
  }, [clearSession, hydrated, setSession, token, user]);
}
