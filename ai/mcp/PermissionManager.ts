import { ToolUnion } from '@google/adk';

export type AgentRole = 'CEO' | 'Research' | 'Product' | 'Marketing' | 'Finance' | 'Operations' | 'Report' | 'QA';

export class PermissionManager {
  private static toolAllowList: Record<AgentRole, string[]> = {
    CEO: ['Project', 'Notifications', 'Search'],
    Research: ['Search', 'FileAccess', 'GitHub'],
    Product: ['Project', 'Search', 'Firestore'],
    Marketing: ['Search', 'Analytics'],
    Finance: ['Analytics', 'Firestore', 'Search'],
    Operations: ['Project', 'Notifications', 'Firestore'],
    Report: ['Reports', 'Export', 'FileAccess', 'Firestore'],
    QA: ['Search', 'FileAccess'],
  };

  public static isAuthorized(role: AgentRole, toolName: string): boolean {
    const allowedTools = this.toolAllowList[role];
    if (!allowedTools) return false;
    return allowedTools.includes(toolName);
  }

  public static getAuthorizedTools(role: AgentRole, allTools: Record<string, unknown>): ToolUnion[] {
    const allowed = this.toolAllowList[role] || [];
    return allowed.map(toolName => allTools[toolName]).filter(Boolean) as ToolUnion[];
  }
}
