'use client';

import { ReactNode } from 'react';
import { useAuthBootstrap } from '@/hooks/use-auth-bootstrap';

export function AppBootstrap({ children }: { children: ReactNode }) {
  useAuthBootstrap();
  return <>{children}</>;
}
