'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CollabDocument } from '@/types';
import { useUpdateDocument } from '@/hooks/use-workspace-data';

export function DocumentEditor({ document }: { document: CollabDocument }) {
  const [title, setTitle] = useState(document.title);
  const [text, setText] = useState(
    () => document.content.blocks.map((block) => block.text ?? '').join('\n\n')
  );
  const updateDocument = useUpdateDocument(document._id);

  const content = useMemo(
    () => ({
      type: 'doc' as const,
      version: 1,
      blocks: text
        .split(/\n\n+/)
        .map((value, index) => ({
          id: `${index + 1}`,
          type: index === 0 ? 'heading' as const : 'paragraph' as const,
          text: value
        }))
    }),
    [text]
  );

  return (
    <Card className="space-y-4 p-6">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea
        className="min-h-[360px] w-full rounded-xl border border-border bg-background p-4 outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">JSON-backed document editor with simple autosave-ready structure.</p>
        <Button
          onClick={() => updateDocument.mutate({ title, content })}
          disabled={updateDocument.isPending}
          type="button"
        >
          {updateDocument.isPending ? 'Saving...' : 'Save Document'}
        </Button>
      </div>
    </Card>
  );
}
