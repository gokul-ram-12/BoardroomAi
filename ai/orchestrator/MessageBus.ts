type MessageHandler = (payload: unknown) => void;

export class MessageBus {
  private static instance: MessageBus;
  private listeners: Map<string, MessageHandler[]> = new Map();

  private constructor() {}

  public static getInstance(): MessageBus {
    if (!MessageBus.instance) {
      MessageBus.instance = new MessageBus();
    }
    return MessageBus.instance;
  }

  public subscribe(topic: string, handler: MessageHandler): () => void {
    const topicListeners = this.listeners.get(topic) || [];
    topicListeners.push(handler);
    this.listeners.set(topic, topicListeners);

    // Return unsubscribe function
    return () => {
      const updatedListeners = (this.listeners.get(topic) || []).filter(h => h !== handler);
      this.listeners.set(topic, updatedListeners);
    };
  }

  public publish(topic: string, payload: unknown): void {
    const topicListeners = this.listeners.get(topic) || [];
    topicListeners.forEach(handler => {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Error in message listener for topic ${topic}`, error);
      }
    });
  }
}
