'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  hydrated: boolean;
  setSession: (payload: { accessToken: string; refreshToken: string; user: User }) => void;
  updateAccessToken: (payload: { accessToken: string; refreshToken?: string; user?: User }) => void;
  clearSession: () => void;
  markHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hydrated: false,
      setSession: ({ accessToken, refreshToken, user }) => set({ accessToken, refreshToken, user }),
      updateAccessToken: ({ accessToken, refreshToken, user }) => set((state) => ({
        accessToken,
        refreshToken: refreshToken ?? state.refreshToken,
        user: user ?? state.user
      })),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
      markHydrated: () => set({ hydrated: true })
    }),
    {
      name: 'collabspace-auth',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => state?.markHydrated()
    }
  )
);
