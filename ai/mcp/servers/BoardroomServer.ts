import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

export const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

export class BoardroomMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'boardroom-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'Search',
          description: 'Searches the web for real-time information',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Input for the tool' }
            },
            required: ['query'],
          },
        },
        {
          name: 'FileAccess',
          description: 'Reads and writes files in the workspace',
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Path to the file' },
              action: { type: 'string', enum: ['read', 'write'], description: 'Action to perform' },
              content: { type: 'string', description: 'Content to write' }
            },
            required: ['path', 'action'],
          },
        },
        {
          name: 'Firestore',
          description: 'Queries the BoardroomAI database',
          inputSchema: {
            type: 'object',
            properties: {
              collection: { type: 'string', description: 'Firestore collection name' },
              query: { type: 'string', description: 'Query string' }
            },
            required: ['collection', 'query'],
          },
        },
        {
          name: 'GitHub',
          description: 'Interacts with GitHub repositories',
          inputSchema: {
            type: 'object',
            properties: {
              repo: { type: 'string', description: 'Repository name' },
              action: { type: 'string', enum: ['read_issues', 'read_pr', 'search_code'], description: 'Action to perform' }
            },
            required: ['repo', 'action'],
          },
        },
        {
          name: 'Reports',
          description: 'Generates professional reports',
          inputSchema: {
            type: 'object',
            properties: {
              topic: { type: 'string', description: 'Report topic' },
              format: { type: 'string', enum: ['markdown', 'json'], description: 'Report format' }
            },
            required: ['topic', 'format'],
          },
        },
        {
          name: 'Analytics',
          description: 'Fetches business metrics and analytics',
          inputSchema: {
            type: 'object',
            properties: {
              metric: { type: 'string', description: 'Metric to fetch' }
            },
            required: ['metric'],
          },
        },
        {
          name: 'Notifications',
          description: 'Sends alerts to users',
          inputSchema: {
            type: 'object',
            properties: {
              message: { type: 'string', description: 'Notification message' },
              userId: { type: 'string', description: 'User ID to notify' }
            },
            required: ['message', 'userId'],
          },
        },
        {
          name: 'Export',
          description: 'Exports data to PDF or CSV',
          inputSchema: {
            type: 'object',
            properties: {
              format: { type: 'string', enum: ['pdf', 'csv'], description: 'Format to export' },
              dataId: { type: 'string', description: 'ID of data to export' }
            },
            required: ['format', 'dataId'],
          },
        },
        {
          name: 'Project',
          description: 'Fetches and manages project scopes',
          inputSchema: {
            type: 'object',
            properties: {
              projectId: { type: 'string', description: 'ID of the project' },
              action: { type: 'string', enum: ['get_status', 'update_status'], description: 'Action to perform' }
            },
            required: ['projectId', 'action'],
          },
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const mockResponse = (text: string) => ({
        content: [{ type: 'text', text }]
      });

      switch (name) {
        case 'Search':
          return mockResponse(`Search executed for: ${args?.query}. (Mock MCP Response)`);
        case 'FileAccess':
          return mockResponse(`FileAccess executed on ${args?.path}`);
        case 'Firestore':
          return mockResponse(`Firestore query executed on ${args?.collection}`);
        case 'GitHub':
          return mockResponse(`GitHub action ${args?.action} on ${args?.repo}`);
        case 'Reports':
          return mockResponse(`Report generated on ${args?.topic} in ${args?.format}`);
        case 'Analytics':
          return mockResponse(`Analytics fetched for ${args?.metric}: 100`);
        case 'Notifications':
          return mockResponse(`Notification sent to ${args?.userId}`);
        case 'Export':
          return mockResponse(`Exported ${args?.dataId} to ${args?.format}`);
        case 'Project':
          return mockResponse(`Project ${args?.action} executed for ${args?.projectId}`);
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    });
  }

  public async start() {
    await this.server.connect(serverTransport);
  }
}

export const boardroomServer = new BoardroomMCPServer();
// The server starts synchronously but .connect() returns a Promise. 
// For embedded usage it's safe to call it without awaiting here.
boardroomServer.start().catch(console.error);
