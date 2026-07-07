import { WorkflowStep } from './WorkflowManager';

export class DependencyResolver {
  /**
   * Sorts tasks using topological sort to resolve execution order based on dependencies.
   */
  public static resolveOrder(steps: Map<string, WorkflowStep>): WorkflowStep[] {
    const sorted: WorkflowStep[] = [];
    const visited: Set<string> = new Set();
    const temp: Set<string> = new Set();

    const visit = (stepId: string) => {
      if (temp.has(stepId)) throw new Error('Circular dependency detected');
      if (!visited.has(stepId)) {
        temp.add(stepId);
        const step = steps.get(stepId);
        if (!step) throw new Error(`Missing step: ${stepId}`);
        
        step.dependencies.forEach(dep => visit(dep));
        
        temp.delete(stepId);
        visited.add(stepId);
        sorted.push(step);
      }
    };

    Array.from(steps.keys()).forEach(id => visit(id));
    return sorted;
  }
}
