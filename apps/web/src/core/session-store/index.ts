import { UserSession } from '@aip/shared-types';

export interface ClientSessionState {
  session: UserSession | null;
  token: string | null;
}

export class SessionStore {
  private state: ClientSessionState = {
    session: null,
    token: null,
  };

  public getSession(): UserSession | null {
    return this.state.session;
  }

  public setSession(session: UserSession | null, token: string | null = null): void {
    this.state = { session, token };
  }
}

export const sessionStore = new SessionStore();
