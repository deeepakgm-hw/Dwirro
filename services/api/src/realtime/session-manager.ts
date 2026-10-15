export interface ActiveRealtimeSession {
  sessionId: string;
  userId: string;
  socketId: string;
  connectedAt: number;
  lastPingAt: number;
}

export class RealtimeSessionManager {
  private sessions = new Map<string, ActiveRealtimeSession>();

  public register(session: ActiveRealtimeSession): void {
    this.sessions.set(session.sessionId, session);
  }

  public unregister(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  public getSession(sessionId: string): ActiveRealtimeSession | undefined {
    return this.sessions.get(sessionId);
  }

  public getActiveCount(): number {
    return this.sessions.size;
  }
}

export const realtimeSessionManager = new RealtimeSessionManager();
