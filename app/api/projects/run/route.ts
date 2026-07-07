import { NextResponse } from 'next/server';
import { z } from 'zod';
import { CEOAgent } from '../../../../ai/agents';
import { createRunner } from '../../../../ai/core/runner';
import { getApiKey, MISSING_API_KEY_ERROR } from '../../../../ai/core/adk';
import { WorkflowManager } from '../../../../ai/orchestrator/WorkflowManager';
import { firebaseSessionService } from '../../../../ai/memory/FirebaseSessionService';

const requestSchema = z.object({
  projectId: z.string(),
  task: z.string(),
});

export async function POST(req: Request) {
  // Guard: API key must be present
  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: MISSING_API_KEY_ERROR },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request body', details: result.error }, { status: 400 });
    }

    const { projectId, task } = result.data;

    // Track execution in WorkflowManager
    const workflow = new WorkflowManager();
    workflow.addStep({ id: 'project_exec', task: `Execute project ${projectId}: ${task}`, dependencies: [] });
    workflow.markStepStarted('project_exec');

    // Run the CEO Agent with project context
    const runner = createRunner(CEOAgent);
    const sessionId = `exec_${projectId}_${Date.now()}`;
    
    await firebaseSessionService.createSession({
      sessionId,
      appName: 'BoardroomAI',
      userId: 'system',
    });

    const events = runner.runAsync({
      userId: 'system',
      sessionId,
      newMessage: {
        role: 'user',
        parts: [{
          text: `${task}\n\nContext: Project ID: ${projectId}. You are executing a project workflow. Delegate to your specialist agents as appropriate and produce a comprehensive project analysis and action plan.`,
        }],
      },
    });

    // Exhaust the event stream (session is persisted to Firestore via FirebaseSessionService)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _event of events) { /* consume stream */ }

    // Retrieve final session state from Firestore
    const session = await firebaseSessionService.getSession({
      sessionId,
      appName: 'BoardroomAI',
      userId: 'system',
    });
    const finalState = session?.state ?? {};

    workflow.updateStepStatus('project_exec', 'completed', finalState);

    return NextResponse.json({
      success: true,
      workflowId: workflow.getId(),
      sessionId,
      sessionState: finalState,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Internal Server Error', message }, { status: 500 });
  }
}
