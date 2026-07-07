import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Bot, Clock, CheckCircle } from 'lucide-react';

const priorityColors: Record<string, string> = {
  Critical: 'text-red-400',
  High: 'text-orange-400',
  Medium: 'text-yellow-400',
  Low: 'text-muted-foreground',
};

const progressBarColors: Record<string, string> = {
  Completed: 'bg-green-500',
  'At Risk': 'bg-yellow-500',
  Active: 'bg-blue-500',
  Planning: 'bg-purple-500',
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="glass-card hover:bg-white/5 transition-colors cursor-pointer h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-snug">{project.name}</CardTitle>
          <StatusBadge status={project.status} />
        </div>
        {project.priority && (
          <p className={`text-xs font-medium ${priorityColors[project.priority] ?? ''}`}>
            {project.priority} Priority
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {project.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
        )}

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium text-foreground">{project.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progressBarColors[project.status] ?? 'bg-primary'}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Tasks */}
        {project.tasksCompleted !== undefined && project.tasksTotal !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle className="w-3 h-3" />
            <span>{project.tasksCompleted} / {project.tasksTotal} tasks completed</span>
          </div>
        )}

        {/* Agents */}
        {project.agentsAssigned && project.agentsAssigned.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Bot className="w-3 h-3" />
            <span className="truncate">{project.agentsAssigned.join(', ')}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/50">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Due {project.dueDate}</span>
          </div>
          {project.lastActivity && (
            <span className="text-xs">{project.lastActivity}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
