export interface RealtimeTransport {
  send(sessionId: string, event: string, data: any): void;
  broadcast(event: string, data: any): void;
}
