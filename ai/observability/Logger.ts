import { adminDb } from '../../lib/firebase/admin';

export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'INFO' | 'WARN' | 'ERROR';
  component: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export class ObservabilityLogger {
  private static instance: ObservabilityLogger;

  private constructor() {}

  public static getInstance(): ObservabilityLogger {
    if (!ObservabilityLogger.instance) {
      ObservabilityLogger.instance = new ObservabilityLogger();
    }
    return ObservabilityLogger.instance;
  }

  public async log(type: LogEntry['type'], component: string, message: string, metadata?: Record<string, unknown>) {
    const entry: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: Date.now(),
      type,
      component,
      message,
      metadata
    };

    console.log(`[${type}] [${component}] ${message}`, metadata || '');

    // Checkpoint to Firestore if initialized
    if (adminDb) {
      try {
        await adminDb.collection('execution_logs').doc(entry.id).set(entry);
      } catch (e) {
        console.error('Failed to write log to Firestore', e);
      }
    }
  }

  public info(component: string, message: string, metadata?: Record<string, unknown>) {
    return this.log('INFO', component, message, metadata);
  }

  public warn(component: string, message: string, metadata?: Record<string, unknown>) {
    return this.log('WARN', component, message, metadata);
  }

  public error(component: string, message: string, metadata?: Record<string, unknown>) {
    return this.log('ERROR', component, message, metadata);
  }
}

export const logger = ObservabilityLogger.getInstance();
