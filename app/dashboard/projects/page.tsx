import Link from 'next/link';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { mockProjects } from '@/lib/constants/mockData';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, AlertTriangle, Clock, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProjectsPage() {
  const active = mockProjects.filter(p => p.status === 'Active').length;
  const atRisk = mockProjects.filter(p => p.status === 'At Risk').length;
  const planning = mockProjects.filter(p => p.status === 'Planning').length;
  const completed = mockProjects.filter(p => p.status === 'Completed').length;

  const summaryStats = [
    { label: 'Active', value: active, icon: Activity, color: 'text-blue-500' },
    { label: 'At Risk', value: atRisk, icon: AlertTriangle, color: 'text-yellow-500' },
    { label: 'Planning', value: planning, icon: Clock, color: 'text-purple-500' },
    { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your active AI workspaces and strategic objectives.</p>
        </div>
        <Button className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryStats.map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="block">
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </div>
  );
}
