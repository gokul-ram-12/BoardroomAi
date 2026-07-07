export interface MemoryEntry {
  id: string;
  type: 'conversation' | 'task' | 'workspace' | 'session';
  content: unknown;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export class MemoryManager {
  private memoryStore: Map<string, MemoryEntry[]> = new Map();

  /**
   * Initializes or gets the memory array for a specific context (e.g. projectId)
   */
  private getContextMemory(contextId: string): MemoryEntry[] {
    if (!this.memoryStore.has(contextId)) {
      this.memoryStore.set(contextId, []);
    }
    return this.memoryStore.get(contextId)!;
  }

  public async save(contextId: string, entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<string> {
    const mem = this.getContextMemory(contextId);
    const newEntry: MemoryEntry = {
      ...entry,
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString()
    };
    
    mem.push(newEntry);
    
    // In Phase 3, this will save to Firestore
    return newEntry.id;
  }

  public async retrieve(contextId: string, type?: MemoryEntry['type']): Promise<MemoryEntry[]> {
    const mem = this.getContextMemory(contextId);
    if (type) {
      return mem.filter(m => m.type === type);
    }
    return mem;
  }

  public async clear(contextId: string): Promise<void> {
    this.memoryStore.delete(contextId);
  }
}
