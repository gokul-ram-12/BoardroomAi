import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { mockAnalytics, mockAgents, mockProjects } from '@/lib/constants/mockData';
import { Activity, ArrowUpRight, TrendingUp, Zap, Bot, Folder } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  const totalSavings = mockAnalytics.reduce((acc, d) => acc + (d.savings ?? 0), 0);
  const totalWorkflows = mockAnalytics.reduce((acc, d) => acc + (d.workflows ?? 0), 0);
  const avgResponseTime = '1.1s';
  const completionRate = '94.8%';

  const metrics = [
    { title: 'Task Completion Rate', value: completionRate, description: '+2.1% from last week', icon: TrendingUp, trend: 'up' as const },
    { title: 'Average Response Time', value: avgResponseTime, description: '-0.3s from last week', icon: Zap, trend: 'up' as const },
    { title: 'Total Workflows Run', value: totalWorkflows.toLocaleString(), description: 'Across all agents YTD', icon: Activity, trend: 'neutral' as const },
    { title: 'Estimated Cost Savings', value: `$${(totalSavings / 1000).toFixed(1)}k`, description: 'Estimated this year', icon: ArrowUpRight, trend: 'up' as const },
  ];

  const projectCompletion = mockProjects
    .filter(p => p.tasksTotal && p.tasksTotal > 0)
    .map(p => ({
      name: p.name.split(' ').slice(0, 3).join(' ') + '...',
      progress: p.progress,
      status: p.status,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Performance metrics, ROI analysis, and agent productivity insights.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <MetricCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart data={mockAnalytics} />
        </div>

        {/* Breakdown sidebar */}
        <div className="space-y-4">
          {/* Agent Efficiency */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bot className="w-4 h-4" /> Agent Efficiency
              </CardTitle>
              <CardDescription>Tasks per agent (YTD)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAgents.slice(0, 5).map(agent => (
                <div key={agent.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground truncate">{agent.name.split(' — ')[0]}</span>
                    <span className="font-medium">{agent.tasksCompleted}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, ((agent.tasksCompleted ?? 0) / 450) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Project Progress */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Folder className="w-4 h-4" /> Project Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectCompletion.slice(0, 5).map((p, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground truncate">{p.name}</span>
                    <span className="font-medium">{p.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.status === 'Completed' ? 'bg-green-500' : p.status === 'At Risk' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
