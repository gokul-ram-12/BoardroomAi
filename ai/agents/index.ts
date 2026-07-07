import { LlmAgent, AgentTool, SequentialAgent } from '@google/adk';
import { defaultModel, proModel } from '../core/adk';
import * as prompts from '../prompts';
import { z } from 'zod';
import * as Tools from '../tools';
import { PermissionManager, AgentRole } from '../mcp/PermissionManager';

const allTools = Tools as Record<string, unknown>;

// Define schemas for agents to accept structured inputs
const defaultSchema = z.object({
  task: z.string().describe('The task to execute'),
  context: z.string().optional().describe('Any previous context'),
});

function getToolsFor(role: AgentRole) {
  return PermissionManager.getAuthorizedTools(role, allTools);
}

export const QAAgent = new LlmAgent({
  name: 'QA',
  model: defaultModel,
  instruction: prompts.QA_PROMPT,
  tools: getToolsFor('QA'),
  inputSchema: defaultSchema,
});

export const ReportAgent = new LlmAgent({
  name: 'Report',
  model: defaultModel,
  instruction: prompts.REPORT_PROMPT,
  tools: getToolsFor('Report'),
  inputSchema: defaultSchema,
  outputKey: 'final_report',
});

export const FinanceAgent = new LlmAgent({
  name: 'Finance',
  model: defaultModel,
  instruction: prompts.FINANCE_PROMPT,
  tools: getToolsFor('Finance'),
  inputSchema: defaultSchema,
});

export const MarketingAgent = new LlmAgent({
  name: 'Marketing',
  model: defaultModel,
  instruction: prompts.MARKETING_PROMPT,
  tools: getToolsFor('Marketing'),
  inputSchema: defaultSchema,
});

export const ProductAgent = new LlmAgent({
  name: 'Product',
  model: defaultModel,
  instruction: prompts.PRODUCT_PROMPT,
  tools: getToolsFor('Product'),
  inputSchema: defaultSchema,
});

export const ResearchAgent = new LlmAgent({
  name: 'Research',
  model: defaultModel,
  instruction: prompts.RESEARCH_PROMPT,
  tools: getToolsFor('Research'),
  inputSchema: defaultSchema,
});

export const OperationsAgent = new LlmAgent({
  name: 'Operations',
  model: defaultModel,
  instruction: prompts.OPERATIONS_PROMPT,
  tools: getToolsFor('Operations'),
  inputSchema: defaultSchema,
});

// CEO acts as the primary orchestrator that delegates to others using AgentTools
export const CEOAgent = new LlmAgent({
  name: 'CEO',
  model: proModel,
  instruction: prompts.CEO_PROMPT,
  tools: [
    ...getToolsFor('CEO'),
    new AgentTool({ agent: ResearchAgent }),
    new AgentTool({ agent: ProductAgent }),
    new AgentTool({ agent: MarketingAgent }),
    new AgentTool({ agent: FinanceAgent }),
    new AgentTool({ agent: OperationsAgent }),
    new AgentTool({ agent: QAAgent }),
    new AgentTool({ agent: ReportAgent })
  ],
  outputKey: 'ceo_decision',
});

// For a strict sequential workflow if requested:
export const SequentialWorkflowAgent = new SequentialAgent({
  name: 'StandardWorkflow',
  subAgents: [
    CEOAgent,
    ResearchAgent,
    ProductAgent,
    FinanceAgent,
    MarketingAgent,
    QAAgent,
    ReportAgent
  ]
});
