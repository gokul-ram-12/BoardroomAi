import { BaseSessionService, CreateSessionRequest, GetSessionRequest, ListSessionsRequest, ListSessionsResponse, DeleteSessionRequest, Session, createSession } from '@google/adk';
import { adminDb } from '../../lib/firebase/admin';

export class FirebaseSessionService extends BaseSessionService {
  private get collection() {
    if (!adminDb) throw new Error('Firebase Admin DB not initialized');
    return adminDb.collection('adk_sessions');
  }

  async createSession(request: CreateSessionRequest): Promise<Session> {
    const id = request.sessionId || `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const session = createSession({
      id,
      appName: request.appName,
      userId: request.userId,
      state: request.state || {},
      events: [],
      lastUpdateTime: Date.now(),
    });

    await this.collection.doc(id).set(session);
    return session;
  }

  async getSession(request: GetSessionRequest): Promise<Session | undefined> {
    const doc = await this.collection.doc(request.sessionId).get();
    if (!doc.exists) return undefined;
    return doc.data() as Session;
  }

  async listSessions(request: ListSessionsRequest): Promise<ListSessionsResponse> {
    const querySnapshot = await this.collection
      .where('appName', '==', request.appName)
      .where('userId', '==', request.userId)
      .get();
      
    const sessions = querySnapshot.docs.map(doc => doc.data() as Session);
    return {
      sessions,
      page: 1,
      limit: sessions.length,
      totalItems: sessions.length,
      totalPages: 1,
    };
  }

  async deleteSession(request: DeleteSessionRequest): Promise<void> {
    await this.collection.doc(request.sessionId).delete();
  }
}

export const firebaseSessionService = new FirebaseSessionService();
