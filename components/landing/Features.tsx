'use client';

import { motion } from 'framer-motion';
import { Network, ShieldCheck, Zap, ServerCog, Activity, Boxes } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Multi-Agent Collaboration',
    description: 'Specialized AI agents work together to break down complex tasks and solve real business workflows efficiently.',
    icon: Network,
  },
  {
    title: 'Enterprise Security',
    description: 'Built with enterprise-grade security using Firebase Authentication and role-based access control.',
    icon: ShieldCheck,
  },
  {
    title: 'Lightning Fast',
    description: 'Optimized for speed on Vercel Edge Network with Next.js App Router and React Server Components.',
    icon: Zap,
  },
  {
    title: 'MCP Server Integration',
    description: 'Ready for Model Context Protocol to seamlessly connect AI agents to your internal data sources.',
    icon: ServerCog,
  },
  {
    title: 'Real-time Analytics',
    description: 'Monitor agent performance and workflow execution with real-time dashboard analytics.',
    icon: Activity,
  },
  {
    title: 'Extensible Skills',
    description: 'Equip your agents with custom skills and tools tailored specifically for your business domain.',
    icon: Boxes,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise Features</h2>
          <p className="text-muted-foreground">Everything you need to orchestrate a powerful AI workforce securely and efficiently.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-card h-full transition-transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
