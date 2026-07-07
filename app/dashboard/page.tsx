'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Folder, Bot, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { RunWorkflowButton } from '@/components/dashboard/RunWorkflowButton';
import { mockActivity, mockAgents, mockProjects } from '@/lib/constants/mockData';

const activityTypeStyles: Record<string, string> = {
  success: 'bg-green-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

export default function DashboardOverview() {
  const stats = [
    {
      title: 'Active Projects',
      value: mockProjects.filter(p => p.status === 'Active').length.toString(),
      description: `${mockProjects.filter(p => p.status === 'At Risk').length} at risk`,
      icon: Folder,
      color: 'text-blue-500',
    },
    {
      title: 'AI Agents Online',
      value: mockAgents.filter(a => a.status === 'Working' || a.status === 'Idle').length.toString(),
      description: `${mockAgents.filter(a => a.status === 'Working').length} actively working`,
      icon: Bot,
      color: 'text-purple-500',
    },
    {
      title: 'Workflows Executed',
      value: '1,234',
      description: '+12% from last week',
      icon: Activity,
      color: 'text-green-500',
    },
    {
      title: 'Estimated Savings',
      value: '$23.7k',
      description: 'This month vs manual labor',
      icon: TrendingUp,
      color: 'text-orange-500',
    },
  ];

  const workingAgents = mockAgents.filter(a => a.status === 'Working');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome to BoardroomAI — your enterprise AI operating system.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Runner */}
      <div>
        <h2 className="text-xl font-bold mb-4">Execute AI Workflow</h2>
        <RunWorkflowButton />
      </div>

      {/* Activity + Agents */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Activity
            </CardTitle>
            <CardDescription>Live stream of agent actions across all workflows.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {mockActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 text-sm">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${activityTypeStyles[item.type]}`} />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{item.agent}</span>
                    <span className="text-muted-foreground"> — {item.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Agents */}
        <Card className="col-span-3 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Active Agents
            </CardTitle>
            <CardDescription>Real-time status of your AI workforce.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workingAgents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{agent.currentTask}</p>
                  </div>
                  <span className="text-xs text-green-500 font-medium shrink-0">Active</span>
                </div>
              ))}
              {workingAgents.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                  <CheckCircle className="w-8 h-8" />
                  <p className="text-sm">All agents standing by</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Projects Requiring Attention
          </CardTitle>
          <CardDescription>Projects that are at risk or behind schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProjects.filter(p => p.status === 'At Risk').map((p) => (
              <div key={p.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">Due {p.dueDate} · {p.tasksCompleted}/{p.tasksTotal} tasks</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-yellow-500" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{p.progress}%</span>
                </div>
              </div>
            ))}
            {mockProjects.filter(p => p.status === 'At Risk').length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">All projects on track ✓</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
