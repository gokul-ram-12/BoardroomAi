export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'At Risk' | 'Planning';
  progress: number;
  dueDate: string;
  description?: string;
  agentsAssigned?: string[];
  tasksCompleted?: number;
  tasksTotal?: number;
  lastActivity?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'Idle' | 'Working' | 'Error' | 'Offline';
  lastActive: string;
  description?: string;
  tasksCompleted?: number;
  currentTask?: string | null;
  model?: string;
  capabilities?: string[];
}

export interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  author?: string;
  status?: 'Ready' | 'Generating' | 'Failed';
  description?: string;
  tags?: string[];
}

export interface Analytics {
  name: string;
  value: number;
  workflows?: number;
  savings?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  photoURL?: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  memberCount: number;
}

export interface ActivityItem {
  id: string;
  agent: string;
  action: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
