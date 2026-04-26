import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="max-w-4xl">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">CollabSpace</p>
        <h1 className="mb-4 text-4xl font-semibold md:text-6xl">
          Chat, docs, and task boards in one real-time workspace.
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base text-muted md:text-lg">
          A functional MVP starter inspired by Slack, Notion, and Trello, for seamless collaboration.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/login"><Button>Get Started</Button></Link>
          <Link href="/register" className="rounded-xl border border-border px-4 py-2 text-sm">Create Account</Link>
        </div>
      </div>
      <footer className="absolute bottom-6 text-sm text-muted">Created by Pounds Michaels Digitals</footer>
    </main>
  );
}
