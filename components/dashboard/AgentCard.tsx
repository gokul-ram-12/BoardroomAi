import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Agent } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Bot, Clock } from 'lucide-react';

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Card className="glass-card hover:bg-white/5 transition-colors cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-md">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
        </div>
        <StatusBadge status={agent.status} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mt-2">{agent.role}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Last active: {agent.lastActive}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
