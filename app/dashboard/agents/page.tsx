'use client';
import { mockAgents } from '@/lib/constants/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw, Bot, CheckCircle, Zap, Activity } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

interface SessionData {
  id: string;
  lastUpdateTime: number;
  events?: unknown[];
}

const statusColors: Record<string, string> = {
  Working: 'bg-green-500',
  Idle: 'bg-yellow-500',
  Offline: 'bg-gray-500',
  Error: 'bg-red-500',
};

export default function AgentsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents/status');
      const data = await res.json();
      if (res.ok) setSessions(data.sessions || []);
    } catch {
      // silently ignore — Firebase may not be configured in demo
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const working = mockAgents.filter(a => a.status === 'Working').length;
  const idle = mockAgents.filter(a => a.status === 'Idle').length;
  const totalTasks = mockAgents.reduce((acc, a) => acc + (a.tasksCompleted ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Workforce</h1>
          <p className="text-muted-foreground">Monitor and orchestrate your autonomous agent team.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchStatus} disabled={loading} title="Refresh sessions">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button className="gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            Deploy Agent
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xl font-bold">{working}</p>
              <p className="text-xs text-muted-foreground">Working Now</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <Bot className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-xl font-bold">{idle}</p>
              <p className="text-xs text-muted-foreground">Standing By</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xl font-bold">{totalTasks.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Tasks Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {mockAgents.map((agent) => (
          <Card key={agent.id} className="glass-card hover:bg-white/5 transition-colors cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold leading-tight">{agent.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
                <StatusBadge status={agent.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Status indicator */}
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${statusColors[agent.status]} ${agent.status === 'Working' ? 'animate-pulse' : ''}`} />
                <span className="text-muted-foreground truncate">
                  {agent.currentTask ?? 'Standing by'}
                </span>
              </div>

              {/* Capabilities */}
              {agent.capabilities && (
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.map(cap => (
                    <span key={cap} className="text-xs bg-secondary/50 rounded px-1.5 py-0.5">{cap}</span>
                  ))}
                </div>
              )}

              {/* Tasks completed */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {agent.tasksCompleted?.toLocaleString()} tasks
                </div>
                <span>{agent.lastActive}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Sessions */}
      {sessions.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Live ADK Sessions</CardTitle>
            <CardDescription>Active Google ADK sessions from the multi-agent orchestrator.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left font-medium">Session ID</th>
                    <th className="p-3 text-left font-medium">Last Updated</th>
                    <th className="p-3 text-left font-medium">Events</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sessions.map((session, i) => (
                    <tr key={i} className="hover:bg-secondary/20">
                      <td className="p-3 font-mono text-xs">{session.id}</td>
                      <td className="p-3 text-muted-foreground">{new Date(session.lastUpdateTime).toLocaleString()}</td>
                      <td className="p-3">{session.events?.length ?? 0} event(s)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
