'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12.4 2.7c.3-.3.8-.3 1.1 0l7.1 7.1c.3.3.3.8 0 1.1l-7.1 7.1c-.3.3-.8.3-1.1 0l-7.1-7.1c-.3-.3-.3-.8 0-1.1l7.1-7.1z"></path><path d="M5.3 9.8 2.7 12.4c-.3.3-.3.8 0 1.1l7.1 7.1c.3.3.8.3 1.1 0l2.6-2.6"></path></svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">PermitFlow</h1>
      </div>
      <p className="mb-8 text-lg text-muted-foreground max-w-md text-center">
        The all-in-one solution to streamline your permit package creation and management.
      </p>
      <Button asChild size="lg">
        <Link href="/dashboard">
          Enter Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}
