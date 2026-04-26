import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none ring-0 placeholder:text-muted',
        className
      )}
      {...props}
    />
  );
}
