import { NextRequest, NextResponse } from 'next/server';
import { createRunner } from '../../../../ai/core/runner';
import { CEOAgent } from '../../../../ai/agents';
import { getApiKey, MISSING_API_KEY_ERROR } from '../../../../ai/core/adk';
import { z } from 'zod';
import { adminAuth } from '../../../../lib/firebase/admin';
import { firebaseSessionService } from '../../../../ai/memory/FirebaseSessionService';

const WorkflowRequestSchema = z.object({
  task: z.string().min(1),
  projectId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // Guard: API key must be present before any execution
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
    const result = WorkflowRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request', details: result.error }, { status: 400 });
    }

    const { task, projectId } = result.data;
    const sessionId = `workflow_${userId}_${Date.now()}`;

    // Create streaming SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
        };

        try {
          send({ type: 'status', message: 'Initializing CEO Agent...', agent: 'CEO' });

          const runner = createRunner(CEOAgent);
          const fullTask = projectId
            ? `${task}\n\nContext: This is for Project ID: ${projectId}. Coordinate your specialist agents to provide a comprehensive response.`
            : `${task}\n\nCoordinate your specialist agents to provide a comprehensive enterprise-grade response.`;

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
              parts: [{ text: fullTask }],
            },
          });

          for await (const event of events) {
            const author = (event as unknown as { author?: string }).author ?? 'Agent';

            const isFinalResponse = (event as unknown as { isFinalResponse?: boolean }).isFinalResponse ?? false;

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
                if (part.functionCall) {
                  const fc = part.functionCall as Record<string, unknown>;
                  send({
                    type: 'tool_call',
                    agent: author,
                    tool: fc.name,
                    message: `${author} → calling ${fc.name}...`,
                  });
                } else if (part.functionResponse) {
                  const fr = part.functionResponse as Record<string, unknown>;
                  send({
                    type: 'tool_response',
                    agent: author,
                    tool: fr.name,
                    message: `${author} ← received response from ${fr.name}`,
                  });
                } else if (part.text && typeof part.text === 'string' && part.text.trim()) {
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

          send({ type: 'done', message: 'Workflow completed successfully.' });
          controller.close();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          send({ type: 'error', message: `Execution error: ${message}` });
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
