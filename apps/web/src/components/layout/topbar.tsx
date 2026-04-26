'use client';

import { Bell, LogOut, Search, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth-store';
import { useInviteToWorkspace, useNotifications, useWorkspaces } from '@/hooks/use-workspace-data';
import { apiClient } from '@/lib/api/client';

export function Topbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { data: notifications = [] } = useNotifications();
  const { data: workspaces = [] } = useWorkspaces();
  const activeWorkspace = workspaces[0];
  const inviteMutation = useInviteToWorkspace(activeWorkspace?._id ?? '');
  const unreadCount = notifications.filter((item) => !item.readAt).length;

  async function sendInvite() {
    if (!activeWorkspace) return;
    const email = window.prompt('Invite teammate email');
    if (!email) return;
    const result = await inviteMutation.mutateAsync({ email, role: 'member' });
    window.alert(`Invite created:
${result.inviteUrl}`);
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-3">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input className="pl-9" placeholder="Search messages, docs, tasks" />
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-xl border border-border p-2" onClick={sendInvite} type="button" title="Invite teammate">
          <UserPlus className="h-4 w-4" />
        </button>
        <button className="relative rounded-xl border border-border p-2" type="button">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-white">{unreadCount}</span> : null}
        </button>
        <ThemeToggle />
        <button
          className="rounded-full border border-border px-3 py-2 text-sm flex items-center gap-2"
          onClick={async () => {
            try { await apiClient('/auth/logout', { method: 'POST' }); } catch {}
            clearSession();
            router.push('/login');
          }}
          type="button"
        >
          <span>{user?.fullName?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() ?? 'PM'}</span>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
