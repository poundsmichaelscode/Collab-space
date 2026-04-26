'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useBootstrapWorkspace } from '@/hooks/use-workspace-data';
import { useAuthStore } from '@/store/auth-store';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const bootstrapWorkspace = useBootstrapWorkspace();
  const [form, setForm] = useState({ email: 'demo@collabspace.dev', password: 'Password123!' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await apiClient<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setSession(result);

      const bootstrap = await bootstrapWorkspace.mutateAsync();
      router.push(`/workspace/${bootstrap.workspace.slug}/chat/${bootstrap.channel._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-2 text-2xl font-semibold">Welcome back</h1>
        <p className="mb-6 text-sm text-muted">Sign in to your workspace.</p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} />
          <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} />
          {error ? <p className="text-sm text-primary">{error}</p> : null}
          <Button className="w-full" disabled={loading || bootstrapWorkspace.isPending}>
            {loading || bootstrapWorkspace.isPending ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted">
          No account? <Link href="/register" className="text-primary">Create one</Link>
        </p>
      </Card>
    </main>
  );
}
