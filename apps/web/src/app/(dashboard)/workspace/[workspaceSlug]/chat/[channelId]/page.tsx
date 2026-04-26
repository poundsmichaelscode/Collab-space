'use client';

import { useParams } from 'next/navigation';
import { ChannelView } from '@/components/chat/channel-view';
import { useChannels, useWorkspaces } from '@/hooks/use-workspace-data';

export default function ChatPage() {
  const params = useParams<{ workspaceSlug: string; channelId: string }>();
  const { data: workspaces = [] } = useWorkspaces();
  const workspace = workspaces.find((item) => item.slug === params.workspaceSlug);
  const { data: channels = [] } = useChannels(workspace?._id ?? '');
  const channel = channels.find((item) => item._id === params.channelId) ?? channels[0];

  if (!workspace || !channel) {
    return <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted">Loading chat...</div>;
  }

  return <ChannelView channelId={channel._id} workspaceId={workspace._id} channelName={channel.name} />;
}
