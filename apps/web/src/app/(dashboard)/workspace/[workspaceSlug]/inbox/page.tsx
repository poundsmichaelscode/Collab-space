'use client';

import { NotificationPanel } from '@/components/notifications/notification-panel';
import { useNotifications } from '@/hooks/use-workspace-data';

export default function InboxPage() {
  const { data: notifications = [] } = useNotifications();
  return <NotificationPanel notifications={notifications} />;
}
