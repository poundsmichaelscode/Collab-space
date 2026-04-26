import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/lib/query/provider';
import { AppBootstrap } from '@/components/providers/app-bootstrap';

export const metadata = {
  title: 'CollabSpace',
  description: 'Real-time team collaboration platform'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <AppBootstrap>{children}</AppBootstrap>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
