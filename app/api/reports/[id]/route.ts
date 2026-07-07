import { NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/admin';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // In Next 16 we need to await params

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const doc = await adminDb.collection('reports').doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ report: doc.data() });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch report', message: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
