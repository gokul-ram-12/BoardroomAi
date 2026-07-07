import { BaseAgent } from '../types/agent';
import { Tool } from '../tools/interfaces';

export interface ADKConfig {
  projectId: string;
  location: string;
  model: string;
}

export class ADKAdapter {
  private config: ADKConfig;

  constructor(config: ADKConfig) {
    this.config = config;
  }

  /**
   * Initializes the Google ADK environment.
   * To be implemented in Phase 3.
   */
  public async initialize(): Promise<void> {
    console.log(`Initializing ADK for project ${this.config.projectId}`);
  }

  /**
   * Transforms our internal Agent definition to a Google ADK compatible Agent format.
   */
  public adaptAgent(agent: BaseAgent): Record<string, unknown> {
    return {
      name: agent.id,
      instructions: agent.systemPrompt,
      tools: agent.tools.map(this.adaptTool)
    };
  }

  /**
   * Transforms our internal Tool schema to a Google ADK compatible Tool format.
   */
  public adaptTool(tool: Tool): Record<string, unknown> {
    return {
      name: tool.name,
      description: tool.description,
      schema: tool.schema
    };
  }
}
