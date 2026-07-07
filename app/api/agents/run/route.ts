import { NextRequest, NextResponse } from 'next/server';
import { createRunner } from '../../../../ai/core/runner';
import * as allAgents from '../../../../ai/agents';
import { getApiKey, MISSING_API_KEY_ERROR } from '../../../../ai/core/adk';
import { z } from 'zod';
import { adminAuth } from '../../../../lib/firebase/admin';
import { BaseAgent } from '@google/adk';
import { firebaseSessionService } from '../../../../ai/memory/FirebaseSessionService';

const AgentRunSchema = z.object({
  agentId: z.string().min(1),
  task: z.string().min(1),
});

export async function POST(req: NextRequest) {
  // Guard: API key must be present
  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: MISSING_API_KEY_ERROR },
      { status: 500 }
    );
  }

  let userId = 'anonymous_demo_user';
  const sessionCookie = req.cookies.get('__session')?.value;
  if (sessionCookie && adminAuth) {
    try {
      const decodedClaims = await adminAuth.verifyIdToken(sessionCookie, true);
      userId = decodedClaims.uid;
    } catch (e) {
      console.warn('Invalid session cookie, falling back to anonymous');
    }
  }

  try {
    const body = await req.json();
    const result = AgentRunSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request', details: result.error }, { status: 400 });
    }

    const { agentId, task } = result.data;

    // Resolve the agent by name or map key
    const agentsMap = allAgents as Record<string, BaseAgent>;
    const targetAgent =
      Object.values(agentsMap).find(a => typeof a === 'object' && a !== null && (a as BaseAgent).name === agentId)
      ?? agentsMap[`${agentId}Agent`];

    if (!targetAgent) {
      return NextResponse.json({ error: `Agent '${agentId}' not found` }, { status: 404 });
    }

    const sessionId = `agent_${agentId}_${userId}_${Date.now()}`;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
        };

        try {
          send({ type: 'status', message: `Initializing ${agentId}...`, agent: agentId });

          const runner = createRunner(targetAgent);
          await firebaseSessionService.createSession({
            sessionId,
            appName: 'BoardroomAI',
            userId,
          });

          const events = runner.runAsync({
            userId,
            sessionId,
            newMessage: {
              role: 'user',
              parts: [{ text: task }],
            },
          });

          for await (const event of events) {
            const author = (event as unknown as { author?: string }).author ?? agentId;
            // Stream function calls (agent delegations)
            // Cast through unknown to avoid TS Event overlap error
            const eventAny = event as unknown as Record<string, unknown>;
            
            // Check if the ADK returned a model error (e.g. invalid API key)
            if (eventAny.errorMessage) {
              send({ type: 'error', message: `Model Error: ${eventAny.errorMessage}` });
              continue;
            }

            const content = eventAny.content as Record<string, unknown> | undefined;
            const parts = content?.parts as Array<Record<string, unknown>> | undefined;

            if (parts) {
              for (const part of parts) {
                if (part.text && typeof part.text === 'string' && part.text.trim()) {
                  send({
                    type: 'text',
                    agent: author,
                    message: part.text,
                    isFinal: isFinalResponse,
                  });
                }
              }
            }
          }

          send({ type: 'done', message: `${agentId} completed.` });
          controller.close();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          send({ type: 'error', message });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Internal server error', message }, { status: 500 });
  }
}
