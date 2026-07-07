import { BaseAgent, AgentRole } from '../types/agent';

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, BaseAgent> = new Map();

  private constructor() {}

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  public register(agent: BaseAgent): void {
    this.agents.set(agent.id, agent);
  }

  public getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  public getAgentsByRole(role: AgentRole): BaseAgent[] {
    return Array.from(this.agents.values()).filter(a => a.role === role);
  }

  public getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }
}
