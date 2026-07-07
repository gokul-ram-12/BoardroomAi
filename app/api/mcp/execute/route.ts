import { NextResponse } from 'next/server';
import { z } from 'zod';
import { mcpClientManager } from '../../../../ai/mcp/MCPClient';

import { logger } from '../../../../ai/observability/Logger';

const requestSchema = z.object({
  tool: z.string(),
  args: z.record(z.string(), z.any()),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = requestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request body', details: result.error }, { status: 400 });
    }

    const { tool, args } = result.data;
    logger.info('MCP-API', `Executing direct MCP tool: ${tool}`, { args });

    const client = await mcpClientManager.connect();
    const response = await client.callTool({
      name: tool,
      arguments: args,
    });

    return NextResponse.json({ success: true, response });
  } catch (error: unknown) {
    logger.error('MCP-API', `MCP execution failed: ${(error instanceof Error ? error.message : String(error))}`);
    return NextResponse.json({ error: 'Internal Server Error', message: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
