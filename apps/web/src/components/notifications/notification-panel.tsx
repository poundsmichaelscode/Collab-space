'use client';

import type { NotificationItem } from '@/types';

export function NotificationPanel({ notifications }: { notifications: NotificationItem[] }) {
  return (
    <div className="space-y-3">
      {notifications.map((item) => (
        <div key={item._id} className="rounded-2xl border border-border bg-surface p-4 text-sm">
          <p className="font-medium">{item.title}</p>
          {item.body ? <p className="mt-1 text-muted">{item.body}</p> : null}
        </div>
      ))}
      {notifications.length === 0 ? <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">No notifications yet.</div> : null}
    </div>
  );
}
