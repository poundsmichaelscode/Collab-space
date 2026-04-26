'use client';

import type { Message } from '@/types';

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div key={message._id} className="rounded-2xl border border-border bg-surface p-4">
          <div className="mb-1 flex items-center gap-2 text-sm">
            <span className="font-semibold">{message.senderName ?? 'Teammate'}</span>
            <span className="text-muted">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p className="text-sm text-foreground">{message.body}</p>
        </div>
      ))}
      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
          No messages yet. Start the conversation.
        </div>
      ) : null}
    </div>
  );
}
