import { Tool } from '../tools/interfaces';

export type AgentRole = 
  | 'CEO' 
  | 'Research' 
  | 'Product' 
  | 'Marketing' 
  | 'Finance' 
  | 'Operations' 
  | 'Report' 
  | 'QA';

export interface AgentGoal {
  primary: string;
  secondary: string[];
}

export interface AgentSchema {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
}


export interface AgentMemoryInterface {
  addMessage: (role: 'user' | 'agent' | 'system', content: string) => Promise<void>;
  getHistory: () => Promise<unknown[]>;
  clear: () => Promise<void>;
  summarize: () => Promise<string>;
}

export interface AgentExecutionInterface {
  executeTask: (task: string, context?: unknown) => Promise<unknown>;
  getStatus: () => 'idle' | 'working' | 'error';
  abort: () => void;
}

export interface BaseAgent {
  id: string;
  role: AgentRole;
  goal: AgentGoal;
  responsibilities: string[];
  systemPrompt: string;
  tools: Tool[];
  inputSchema: AgentSchema;
  outputSchema: AgentSchema;
  memory: AgentMemoryInterface;
  execution: AgentExecutionInterface;
}
