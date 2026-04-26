'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';

export default function InviteAcceptPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [status, setStatus] = useState<string | null>(null);

  async function acceptInvite() {
    if (!accessToken) {
      router.push(`/login?next=/invite/${params.token}`);
      return;
    }
    try {
      const result = await apiClient<{ workspace: { slug: string } }>(`/workspaces/accept-invite/${params.token}`, { method: 'POST' });
      setStatus('Invite accepted. Redirecting...');
      router.push(`/workspace/${result.workspace.slug}/inbox`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to accept invite');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-lg space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Workspace invitation</h1>
        <p className="text-sm text-muted">Accept the invitation to join this CollabSpace workspace.</p>
        {status ? <p className="text-sm text-primary">{status}</p> : null}
        <Button type="button" onClick={acceptInvite}>Accept Invite</Button>
      </Card>
    </main>
  );
}
