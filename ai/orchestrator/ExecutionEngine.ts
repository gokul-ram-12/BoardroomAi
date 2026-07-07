import { WorkflowManager, WorkflowStep } from './WorkflowManager';
import { AgentRegistry } from './AgentRegistry';

export class ExecutionEngine {
  private workflowManager: WorkflowManager;
  private registry: AgentRegistry;

  constructor(workflowManager: WorkflowManager) {
    this.workflowManager = workflowManager;
    this.registry = AgentRegistry.getInstance();
  }

  public async runNextSteps(): Promise<void> {
    const steps = this.workflowManager.getNextExecutableSteps();
    
    if (steps.length === 0) return;

    const executions = steps.map(step => this.executeStep(step));
    await Promise.all(executions);
    
    // Recursively run until complete (or stopped)
    if (!this.workflowManager.isComplete()) {
      await this.runNextSteps();
    }
  }

  private async executeStep(step: WorkflowStep): Promise<void> {
    this.workflowManager.updateStepStatus(step.id, 'in-progress');
    
    try {
      if (!step.agentId) throw new Error('No agent assigned to step');
      const agent = this.registry.getAgent(step.agentId);
      if (!agent) throw new Error('Agent not found');

      // Stub for actual AI execution
      const result = await agent.execution.executeTask(step.task);
      this.workflowManager.updateStepStatus(step.id, 'completed', result);
    } catch (error) {
      console.error(`Step ${step.id} failed:`, error);
      this.workflowManager.updateStepStatus(step.id, 'failed');
    }
  }
}
