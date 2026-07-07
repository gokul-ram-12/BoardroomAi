'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center px-4">
      <div className="p-4 rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold mb-2">System Failure</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        An unexpected error occurred in the enterprise system. Our agent workforce has been notified.
      </p>
      <Button onClick={reset} variant="default">
        Attempt Recovery
      </Button>
    </div>
  );
}
