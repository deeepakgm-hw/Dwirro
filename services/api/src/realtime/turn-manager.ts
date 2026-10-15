export type TurnState = 'idle' | 'user_speaking' | 'agent_processing' | 'agent_speaking' | 'interrupted';

export class TurnManager {
  private currentTurnState: TurnState = 'idle';
  private currentTurnId: string | null = null;

  public startTurn(turnId: string, actor: 'user' | 'agent'): void {
    this.currentTurnId = turnId;
    this.currentTurnState = actor === 'user' ? 'user_speaking' : 'agent_speaking';
  }

  public endTurn(): void {
    this.currentTurnState = 'idle';
    this.currentTurnId = null;
  }

  public interrupt(): void {
    this.currentTurnState = 'interrupted';
  }

  public getState(): TurnState {
    return this.currentTurnState;
  }
}
