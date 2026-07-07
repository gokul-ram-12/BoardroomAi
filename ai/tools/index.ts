import { createMCPProxyTool } from '../mcp/MCPToolRegistry';

// We dynamically create ADK FunctionTools that act as proxies to the MCP server.
// The MCP ToolRegistry could also fetch these schemas dynamically via ListTools, 
// but for static type resolution in ADK we define the Zod schemas mapping here.

export const SearchTool = createMCPProxyTool(
  'Search',
  'Searches the web for real-time information',
  {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Input for the tool' }
    },
    required: ['query'],
  }
);

export const FileAccessTool = createMCPProxyTool(
  'FileAccess',
  'Reads and writes files in the workspace',
  {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'Path to the file' },
      action: { type: 'string', enum: ['read', 'write'], description: 'Action to perform' },
      content: { type: 'string', description: 'Content to write' }
    },
    required: ['path', 'action'],
  }
);

export const FirestoreTool = createMCPProxyTool(
  'Firestore',
  'Queries the BoardroomAI database',
  {
    type: 'object',
    properties: {
      collection: { type: 'string', description: 'Firestore collection name' },
      query: { type: 'string', description: 'Query string' }
    },
    required: ['collection', 'query'],
  }
);

export const GitHubTool = createMCPProxyTool(
  'GitHub',
  'Interacts with GitHub repositories',
  {
    type: 'object',
    properties: {
      repo: { type: 'string', description: 'Repository name' },
      action: { type: 'string', enum: ['read_issues', 'read_pr', 'search_code'], description: 'Action to perform' }
    },
    required: ['repo', 'action'],
  }
);

export const ReportsTool = createMCPProxyTool(
  'Reports',
  'Generates professional reports',
  {
    type: 'object',
    properties: {
      topic: { type: 'string', description: 'Report topic' },
      format: { type: 'string', enum: ['markdown', 'json'], description: 'Report format' }
    },
    required: ['topic', 'format'],
  }
);

export const AnalyticsTool = createMCPProxyTool(
  'Analytics',
  'Fetches business metrics and analytics',
  {
    type: 'object',
    properties: {
      metric: { type: 'string', description: 'Metric to fetch' }
    },
    required: ['metric'],
  }
);

export const NotificationsTool = createMCPProxyTool(
  'Notifications',
  'Sends alerts to users',
  {
    type: 'object',
    properties: {
      message: { type: 'string', description: 'Notification message' },
      userId: { type: 'string', description: 'User ID to notify' }
    },
    required: ['message', 'userId'],
  }
);

export const ExportTool = createMCPProxyTool(
  'Export',
  'Exports data to PDF or CSV',
  {
    type: 'object',
    properties: {
      format: { type: 'string', enum: ['pdf', 'csv'], description: 'Format to export' },
      dataId: { type: 'string', description: 'ID of data to export' }
    },
    required: ['format', 'dataId'],
  }
);

export const ProjectTool = createMCPProxyTool(
  'Project',
  'Fetches and manages project scopes',
  {
    type: 'object',
    properties: {
      projectId: { type: 'string', description: 'ID of the project' },
      action: { type: 'string', enum: ['get_status', 'update_status'], description: 'Action to perform' }
    },
    required: ['projectId', 'action'],
  }
);
