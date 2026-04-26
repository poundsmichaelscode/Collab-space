'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Composer({ onSend, pending }: { onSend: (value: string) => Promise<void>; pending: boolean }) {
  const [value, setValue] = useState('');

  return (
    <form
      className="mt-4 flex gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        const nextValue = value.trim();
        if (!nextValue) return;
        await onSend(nextValue);
        setValue('');
      }}
    >
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Message channel" />
      <Button type="submit" disabled={pending}>{pending ? 'Sending...' : 'Send'}</Button>
    </form>
  );
}
