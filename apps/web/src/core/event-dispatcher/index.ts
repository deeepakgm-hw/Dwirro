type EventHandler<T = any> = (data: T) => void;

export class ClientEventDispatcher {
  private handlers = new Map<string, Set<EventHandler>>();

  public on<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  public off<T = any>(event: string, handler: EventHandler<T>): void {
    this.handlers.get(event)?.delete(handler);
  }

  public emit<T = any>(event: string, data: T): void {
    this.handlers.get(event)?.forEach((handler) => handler(data));
  }
}

export const eventDispatcher = new ClientEventDispatcher();
