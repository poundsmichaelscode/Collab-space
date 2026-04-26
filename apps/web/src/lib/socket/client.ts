'use client';

import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth-store';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:5000';
let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false, transports: ['websocket'] });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket?.connected) socket.disconnect();
}

export function connectSocket() {
  const token = useAuthStore.getState().accessToken;
  if (!token) return null;
  const instance = getSocket();
  instance.auth = { token };
  if (!instance.connected) instance.connect();
  return instance;
}
