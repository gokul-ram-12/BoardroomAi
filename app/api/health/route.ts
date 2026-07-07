import { NextResponse } from 'next/server';
import { AgentRegistry } from '@/ai/orchestrator/AgentRegistry';

export async function GET() {
  const registry = AgentRegistry.getInstance();
  
  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    orchestrator: {
      registeredAgents: registry.getAllAgents().length
    }
  });
}
