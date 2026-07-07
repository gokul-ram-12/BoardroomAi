'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl tracking-tight">BoardroomAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#architecture" className="hover:text-foreground transition-colors">Architecture</Link>
          <Link href="#workflows" className="hover:text-foreground transition-colors">Workflows</Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button onClick={logout} variant="outline">Sign Out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={signInWithGoogle} className="hidden sm:inline-flex">
                Log In
              </Button>
              <Button onClick={signInWithGoogle}>Get Started</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
