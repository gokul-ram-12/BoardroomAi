'use client';


import { Card } from '@/components/ui/card';

export function Architecture() {
  return (
    <section id="architecture" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 skew-y-3 origin-top-left -z-10" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Robust Architecture</h2>
          <p className="text-muted-foreground">Designed for scalability, security, and seamless agent orchestration.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="glass-card p-1 md:p-8 relative overflow-hidden border-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10" />
            
            <div className="aspect-video bg-background/50 rounded-lg border border-border flex items-center justify-center p-8 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-muted-foreground text-sm font-mono">[ Architecture Diagram Placeholder ]</p>
                <p className="text-xs text-muted-foreground mt-2">Next.js 15 App Router · Firebase · Vercel · MCP Integration</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
