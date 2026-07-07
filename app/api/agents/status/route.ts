import { NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/admin';

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    // Agent status could be tracked in Firestore by the observabilty logger.
    // For now we just return the active sessions from ADK
    const snapshot = await adminDb.collection('adk_sessions')
      .orderBy('lastUpdateTime', 'desc')
      .limit(20)
      .get();
      
    const sessions = snapshot.docs.map(doc => doc.data());
    
    return NextResponse.json({ sessions });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch agent status', message: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
