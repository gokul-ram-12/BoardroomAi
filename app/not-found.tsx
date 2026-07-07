import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved to another quadrant of the enterprise system.
      </p>
      <Link href="/">
        <Button className="gap-2">
          <Home className="w-4 h-4" />
          Return to Base
        </Button>
      </Link>
    </div>
  );
}
