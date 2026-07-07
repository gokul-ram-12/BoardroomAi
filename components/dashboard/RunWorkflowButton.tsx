'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2, CheckCircle, AlertCircle, Bot, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StreamEvent {
  type: 'status' | 'text' | 'tool_call' | 'tool_response' | 'done' | 'error';
  agent?: string;
  tool?: string;
  message: string;
  isFinal?: boolean;
}

interface LogEntry {
  id: string;
  type: StreamEvent['type'];
  agent?: string;
  tool?: string;
  message: string;
  timestamp: string;
}

const agentColors: Record<string, string> = {
  CEO: 'text-purple-400',
  Research: 'text-blue-400',
  Finance: 'text-green-400',
  Product: 'text-cyan-400',
  Marketing: 'text-pink-400',
  Operations: 'text-orange-400',
  QA: 'text-yellow-400',
  Report: 'text-teal-400',
  Agent: 'text-gray-400',
};

const typePrefix: Record<StreamEvent['type'], string> = {
  status: '⚡',
  text: '💬',
  tool_call: '🔧',
  tool_response: '✅',
  done: '🎉',
  error: '❌',
};

function getAgentColor(agent?: string): string {
  if (!agent) return 'text-gray-400';
  for (const [key, color] of Object.entries(agentColors)) {
    if (agent.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return 'text-gray-400';
}

export function RunWorkflowButton() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [task, setTask] = useState('Analyze the competitive landscape for a B2B SaaS company entering the project management market. Provide market sizing, top competitors, positioning strategy, and a go-to-market plan.');
  const [finalReport, setFinalReport] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const addLog = (event: StreamEvent) => {
    setLogs(prev => [...prev, {
      id: `${Date.now()}-${Math.random()}`,
      type: event.type,
      agent: event.agent,
      tool: event.tool,
      message: event.message,
      timestamp: new Date().toLocaleTimeString(),
    }]);
  };

  const handleRun = async () => {
    if (!task.trim()) return;
    setLoading(true);
    setLogs([]);
    setFinalReport(null);
    setStatus('running');

    try {
      const response = await fetch('/api/workflow/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        const err = await response.json();
        const msg = err.error ?? 'Workflow failed';
        addLog({ type: 'error', message: msg });
        setStatus('error');
        return;
      }

      if (!response.body) {
        addLog({ type: 'error', message: 'No response stream received.' });
        setStatus('error');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const event: StreamEvent = JSON.parse(trimmed);
            addLog(event);

            if (event.type === 'text' && event.isFinal) {
              setFinalReport(event.message);
            }
            if (event.type === 'done') {
              setStatus('success');
            }
            if (event.type === 'error') {
              setStatus('error');
            }
          } catch {
            addLog({ type: 'status', agent: 'System', message: trimmed });
          }
        }
      }

      if (status !== 'error') setStatus('success');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unexpected error';
      addLog({ type: 'error', message: msg });
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input row */}
      <div className="flex gap-2">
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          rows={2}
          className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Enter a business objective for the CEO Agent to orchestrate..."
          disabled={loading}
        />
        <Button
          onClick={handleRun}
          disabled={loading || !task.trim()}
          className="gap-2 self-start"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {loading ? 'Running...' : 'Execute'}
        </Button>
      </div>

      {/* Status bar */}
      {status !== 'idle' && (
        <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md border ${
          status === 'running' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
          status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
          'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {status === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
          {status === 'success' && <CheckCircle className="w-3 h-3" />}
          {status === 'error' && <AlertCircle className="w-3 h-3" />}
          {status === 'running' ? 'CEO Agent orchestrating workflow...' :
           status === 'success' ? 'Workflow completed successfully.' :
           'Workflow encountered an error.'}
        </div>
      )}

      {/* Execution log terminal */}
      {logs.length > 0 && (
        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-gray-400 font-mono flex items-center gap-2">
              <Bot className="w-3 h-3" />
              Agent Execution Log
              {loading && <span className="ml-auto flex items-center gap-1"><Zap className="w-3 h-3 animate-pulse text-yellow-400" /> Live</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 pb-4 h-[280px] overflow-y-auto font-mono text-xs leading-relaxed space-y-1">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2">
                  <span className="text-gray-600 shrink-0 w-16">{log.timestamp}</span>
                  <span className="shrink-0">{typePrefix[log.type]}</span>
                  {log.agent && (
                    <span className={`shrink-0 font-semibold ${getAgentColor(log.agent)}`}>
                      [{log.agent}]
                    </span>
                  )}
                  <span className={`break-all ${log.type === 'error' ? 'text-red-400' : log.type === 'done' ? 'text-green-400' : 'text-gray-300'}`}>
                    {log.type === 'tool_call' ? `Calling tool: ${log.tool}` : log.message.slice(0, 200)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Final report panel */}
      {finalReport && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              Final Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-foreground/90 whitespace-pre-wrap max-h-96 overflow-y-auto font-mono text-xs leading-relaxed">
              {finalReport}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
