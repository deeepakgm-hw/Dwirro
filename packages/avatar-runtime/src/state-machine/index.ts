import { AvatarState } from '../core/types.js';

export class AvatarStateMachine {
  private currentState: AvatarState = 'unloaded';

  public getState(): AvatarState {
    return this.currentState;
  }

  public transition(next: AvatarState): void {
    this.currentState = next;
  }
}
