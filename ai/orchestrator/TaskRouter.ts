import { AgentRole } from '../types/agent';
import { AgentRegistry } from './AgentRegistry';

export class TaskRouter {
  private registry: AgentRegistry;

  constructor() {
    this.registry = AgentRegistry.getInstance();
  }

  /**
   * Evaluates a task description and returns the most appropriate AgentRole to handle it.
   * This is a stub for future LLM-based routing logic.
   */
  public routeTask(taskDescription: string): AgentRole {
    const desc = taskDescription.toLowerCase();
    
    if (desc.includes('research') || desc.includes('find')) return 'Research';
    if (desc.includes('product') || desc.includes('design')) return 'Product';
    if (desc.includes('market') || desc.includes('campaign')) return 'Marketing';
    if (desc.includes('finance') || desc.includes('budget')) return 'Finance';
    if (desc.includes('report') || desc.includes('document')) return 'Report';
    if (desc.includes('test') || desc.includes('qa')) return 'QA';
    if (desc.includes('orchestrate') || desc.includes('plan')) return 'CEO';
    
    return 'Operations'; // Fallback
  }
}
