import { NextRequest, NextResponse } from 'next/server';
import { createRunner } from '../../../../ai/core/runner';
import { ReportAgent } from '../../../../ai/agents';
import { z } from 'zod';
import { adminAuth } from '../../../../lib/firebase/admin';

const ReportRequestSchema = z.object({
  topic: z.string().min(1),
  format: z.enum(['markdown', 'json']).optional().default('markdown'),
});

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('__session')?.value;
    if (!sessionCookie || !adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    const body = await req.json();
    const result = ReportRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request', details: result.error }, { status: 400 });
    }

    const { topic, format } = result.data;
    
    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const runner = createRunner(ReportAgent);
          const generator = runner.runEphemeral({
            userId,
            newMessage: { parts: [{ text: `Generate a report on: ${topic}. Format: ${format}` }] },
          });

          for await (const event of generator) {
            const data = JSON.stringify(event) + '\n';
            controller.enqueue(encoder.encode(data));
          }
          controller.close();
        } catch (err) {
          console.error('Report generation error', err);
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Report error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
