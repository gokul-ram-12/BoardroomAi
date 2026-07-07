import { FunctionTool } from '@google/adk';

import { mcpClientManager } from './MCPClient';


export function createMCPProxyTool(name: string, description: string, schema: Record<string, unknown>) {
  return new FunctionTool({
    name,
    description,
    parameters: schema,
    execute: async (input: unknown) => {
      // Lazy connect to MCP Server if not connected
      const client = await mcpClientManager.connect();
      
      const response = await client.callTool({
        name,
        arguments: input as Record<string, unknown> | undefined,
      });

      // Extract result from MCP response format
      if ('content' in response && Array.isArray(response.content) && response.content.length > 0) {
        if (response.content[0].type === 'text') {
          return { status: 'success', result: response.content[0].text };
        }
      }
      return { status: 'success', result: response.content };
    },
  });
}
