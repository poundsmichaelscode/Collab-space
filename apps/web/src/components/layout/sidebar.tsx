'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useWorkspaces, useChannels } from '@/hooks/use-workspace-data';
import { useUIStore } from '@/store/ui-store';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useUIStore();
  const { data: workspaces = [] } = useWorkspaces();
  const activeWorkspace = workspaces[0];
  const { data: channels = [] } = useChannels(activeWorkspace?._id ?? '');

  const items = activeWorkspace
    ? [
        { label: 'Chat', href: `/workspace/${activeWorkspace.slug}/chat/${channels[0]?._id ?? ''}` },
        { label: 'Docs', href: `/workspace/${activeWorkspace.slug}/docs/home` },
        { label: 'Tasks', href: `/workspace/${activeWorkspace.slug}/boards/main` },
        { label: 'Inbox', href: `/workspace/${activeWorkspace.slug}/inbox` }
      ]
    : [];

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 88 : 280 }}
      transition={{ duration: 0.2 }}
      className="relative hidden h-screen border-r border-border bg-surface p-4 lg:block"
    >
      <div className="mb-6">
        <div className="text-lg font-semibold">CollabSpace</div>
        <div className="text-xs text-muted">{activeWorkspace?.name ?? 'Workspace Hub'}</div>
      </div>

      <div className="mb-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Navigation</p>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-xl px-3 py-2 text-sm transition hover:bg-background ${pathname === item.href ? 'bg-background text-primary' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Channels</p>
        {channels.map((channel) => (
          <Link
            key={channel._id}
            href={`/workspace/${activeWorkspace?.slug ?? 'workspace'}/chat/${channel._id}`}
            className={`block rounded-xl px-3 py-2 text-sm transition hover:bg-background ${pathname?.includes(channel._id) ? 'bg-background text-primary' : ''}`}
          >
            # {channel.name}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 text-xs text-muted">
        Created by Pounds Michaels Digitals
      </div>
    </motion.aside>
  );
}
