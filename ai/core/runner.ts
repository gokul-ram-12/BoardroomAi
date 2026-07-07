import { Runner, BaseAgent } from '@google/adk';
import { firebaseSessionService } from '../memory/FirebaseSessionService';

export function createRunner(rootAgent: BaseAgent) {
  return new Runner({
    agent: rootAgent,
    appName: 'BoardroomAI',
    sessionService: firebaseSessionService,
  });
}
