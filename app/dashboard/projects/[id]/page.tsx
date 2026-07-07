'use client';
import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Loader2, CheckCircle, AlertCircle, ArrowLeft, Bot, Clock, Users } from 'lucide-react';
import { mockProjects, mockAgents } from '@/lib/constants/mockData';

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const project = mockProjects.find(p => p.id === unwrappedParams.id) ?? null;
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const agentsForProject = mockAgents.filter(a =>
    project?.agentsAssigned?.some(name => a.name.includes(name.split(' ')[0]))
  );

  const runWorkflow = async () => {
    setRunning(true);
    setStatus('running');
    setLogs([
      `[${new Date().toISOString()}] Initiating AI workflow for project: ${project?.name || unwrappedParams.id}`,
      `[${new Date().toISOString()}] CEO Agent (Aria) analyzing project context...`,
      `[${new Date().toISOString()}] Delegating sub-tasks to specialized agents...`,
    ]);
    try {
      const res = await fetch('/api/projects/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: unwrappedParams.id,
          task: `Execute comprehensive project analysis for: ${project?.name || 'Project ' + unwrappedParams.id}`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setLogs(prev => [
          ...prev,
          `[${new Date().toISOString()}] Workflow execution pipeline completed.`,
          `[${new Date().toISOString()}] Workflow ID: ${data.workflowId}`,
          `[${new Date().toISOString()}] Status: SUCCESS — All agents reported back.`,
        ]);
        setStatus('success');
      } else {
        throw new Error(data.error || 'Failed to run workflow');
      }
    } catch (e: unknown) {
      setLogs(prev => [
        ...prev,
        `[${new Date().toISOString()}] ERROR: ${e instanceof Error ? e.message : String(e)}`,
      ]);
      setStatus('error');
    } finally {
      setRunning(false);
    }
  };

  if (!project) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/projects">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
          <AlertCircle className="w-12 h-12" />
          <h2 className="text-xl font-semibold">Project not found</h2>
          <p className="text-sm">The project with ID &quot;{unwrappedParams.id}&quot; does not exist.</p>
        </div>
      </div>
    );
  }

  const progressColor =
    project.status === 'Completed' ? 'bg-green-500' :
    project.status === 'At Risk' ? 'bg-yellow-500' :
    project.status === 'Active' ? 'bg-blue-500' : 'bg-purple-500';

  return (
    <div className="space-y-6">
      <Link href="/dashboard/projects">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Button>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
        <Button onClick={runWorkflow} disabled={running} className="gap-2 shrink-0">
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? 'Executing...' : 'Run AI Workflow'}
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="font-semibold">{project.dueDate}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Tasks</p>
              <p className="font-semibold">{project.tasksCompleted} / {project.tasksTotal} completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Agents</p>
              <p className="font-semibold">{project.agentsAssigned?.length ?? 0} assigned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${progressColor}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className="text-sm font-bold w-12 text-right">{project.progress}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Agents */}
      {agentsForProject.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-4 h-4" /> Assigned Agents
            </CardTitle>
            <CardDescription>AI agents actively working on this project.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {agentsForProject.map((agent) => (
                <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${agent.status === 'Working' ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{agent.currentTask ?? agent.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Execution Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Execution Logs
            {status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
            {status === 'running' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          </CardTitle>
          <CardDescription>Real-time execution details from the AI Workforce</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded-md h-52 overflow-y-auto font-mono text-xs leading-relaxed">
            {logs.length === 0 ? (
              <span className="text-gray-500">No logs yet. Click &apos;Run AI Workflow&apos; to start execution.</span>
            ) : (
              logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
