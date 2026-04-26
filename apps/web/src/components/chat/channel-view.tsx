'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { connectSocket, getSocket } from '@/lib/socket/client';
import { useCreateMessage, useMessages } from '@/hooks/use-workspace-data';
import type { Message } from '@/types';
import { MessageList } from '@/components/chat/message-list';
import { Composer } from '@/components/chat/composer';

export function ChannelView({ channelId, workspaceId, channelName }: { channelId: string; workspaceId: string; channelName: string }) {
  const queryClient = useQueryClient();
  const { data: messages = [] } = useMessages(channelId);
  const createMessage = useCreateMessage(channelId);

  useEffect(() => {
    const socket = connectSocket();
    if (!socket || !channelId) return;

    socket.emit('channel:join', channelId);
    const handler = (message: Message) => {
      if (message.channelId === channelId) {
        queryClient.setQueryData<Message[]>(['messages', channelId], (current = []) => [...current, message]);
      }
    };

    socket.on('message:new', handler);
    return () => {
      socket.off('message:new', handler);
    };
  }, [channelId, queryClient]);

  return (
    <section>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">#{channelName}</h1>
        <p className="text-sm text-muted">Real-time team discussion</p>
      </div>
      <MessageList messages={messages} />
      <Composer
        pending={createMessage.isPending}
        onSend={async (value) => {
          const socket = getSocket();
          if (socket.connected) {
            socket.emit('message:send', { workspaceId, channelId, body: value });
          } else {
            await createMessage.mutateAsync({ workspaceId, body: value });
          }
        }}
      />
    </section>
  );
}
