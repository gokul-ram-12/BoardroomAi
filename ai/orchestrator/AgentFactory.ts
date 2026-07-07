import { BaseAgent } from '@google/adk';
import { CEOAgent, ResearchAgent, ProductAgent, MarketingAgent, FinanceAgent, OperationsAgent, ReportAgent, QAAgent } from '../agents';

export type AgentRole = 'CEO' | 'Research' | 'Product' | 'Marketing' | 'Finance' | 'Operations' | 'Report' | 'QA';

export class AgentFactory {
  public static createAgent(role: AgentRole): BaseAgent {
    switch (role) {
      case 'CEO': return CEOAgent;
      case 'Research': return ResearchAgent;
      case 'Product': return ProductAgent;
      case 'Marketing': return MarketingAgent;
      case 'Finance': return FinanceAgent;
      case 'Operations': return OperationsAgent;
      case 'Report': return ReportAgent;
      case 'QA': return QAAgent;
      default:
        throw new Error(`Unknown agent role: ${role}`);
    }
  }
}
