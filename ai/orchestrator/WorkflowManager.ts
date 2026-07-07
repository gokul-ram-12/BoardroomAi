import { adminDb } from '../../lib/firebase/admin';
import { logger } from '../observability/Logger';

export interface WorkflowStep {
  id: string;
  agentId?: string;
  task: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'timeout';
  dependencies: string[];
  result?: unknown;
  retries?: number;
  maxRetries?: number;
  timeoutMs?: number;
  startTime?: number;
  endTime?: number;
}

export class WorkflowManager {
  private steps: Map<string, WorkflowStep> = new Map();
  private workflowId: string;

  constructor(workflowId?: string) {
    this.workflowId = workflowId || `wf_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  public getId() {
    return this.workflowId;
  }

  public addStep(step: Omit<WorkflowStep, 'status' | 'retries'> & { status?: WorkflowStep['status'], retries?: number }): void {
    const newStep: WorkflowStep = {
      ...step,
      status: step.status || 'pending',
      retries: step.retries || 0,
      maxRetries: step.maxRetries || 3,
      timeoutMs: step.timeoutMs || 30000,
    };
    this.steps.set(newStep.id, newStep);
    logger.info('WorkflowManager', `Added step ${newStep.id}`, { workflowId: this.workflowId, step: newStep.id });
    this.checkpoint();
  }

  public getNextExecutableSteps(): WorkflowStep[] {
    return Array.from(this.steps.values()).filter(step => 
      (step.status === 'pending' || (step.status === 'failed' && (step.retries || 0) < (step.maxRetries || 3))) && 
      step.dependencies.every(depId => this.steps.get(depId)?.status === 'completed')
    );
  }

  public markStepStarted(id: string): void {
    const step = this.steps.get(id);
    if (step) {
      const wasFailed = step.status === 'failed';
      step.status = 'in-progress';
      step.startTime = Date.now();
      if (wasFailed) {
        step.retries = (step.retries || 0) + 1;
      }
      this.steps.set(id, step);
      logger.info('WorkflowManager', `Step started: ${id}`, { workflowId: this.workflowId, step: id });
      this.checkpoint();
    }
  }

  public updateStepStatus(id: string, status: WorkflowStep['status'], result?: unknown): void {
    const step = this.steps.get(id);
    if (step) {
      step.status = status;
      if (status === 'completed' || status === 'failed' || status === 'timeout') {
        step.endTime = Date.now();
      }
      if (result) step.result = result;
      this.steps.set(id, step);
      logger.info('WorkflowManager', `Step ${status}: ${id}`, { workflowId: this.workflowId, step: id, result });
      this.checkpoint();
    }
  }

  public isComplete(): boolean {
    const values = Array.from(this.steps.values());
    if (values.length === 0) return false;
    return values.every(step => step.status === 'completed');
  }

  public hasFailed(): boolean {
    return Array.from(this.steps.values()).some(step => step.status === 'failed' && (step.retries || 0) >= (step.maxRetries || 3));
  }

  public async checkpoint(): Promise<void> {
    if (!adminDb) return;
    try {
      const state = {
        workflowId: this.workflowId,
        steps: Array.from(this.steps.values()),
        isComplete: this.isComplete(),
        hasFailed: this.hasFailed(),
        updatedAt: Date.now()
      };
      await adminDb.collection('workflows').doc(this.workflowId).set(state);
    } catch (e) {
      logger.error('WorkflowManager', 'Failed to checkpoint workflow state', { error: String(e) });
    }
  }
}
