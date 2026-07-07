import { NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const snapshot = await adminDb.collection('workflows')
      .orderBy('updatedAt', 'desc')
      .limit(limit)
      .get();
      
    const workflows = snapshot.docs.map(doc => doc.data());
    
    return NextResponse.json({ workflows });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch history', message: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
