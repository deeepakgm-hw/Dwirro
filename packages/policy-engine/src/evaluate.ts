import { ActionDefinition, ActionLevel } from '@aip/shared-types';
import { DEFAULT_ACTION_CATALOG } from './rules.js';

export class PolicyEngine {
  private actions: Map<string, ActionDefinition>;
  private isKillSwitchActive: boolean = false;

  constructor(initialActions: ActionDefinition[] = DEFAULT_ACTION_CATALOG) {
    this.actions = new Map(initialActions.map((a) => [a.id, { ...a }]));
  }

  public setKillSwitch(active: boolean): void {
    this.isKillSwitchActive = active;
  }

  public getKillSwitch(): boolean {
    return this.isKillSwitchActive;
  }

  public getAllActions(): ActionDefinition[] {
    return Array.from(this.actions.values());
  }

  public getAction(id: string): ActionDefinition | undefined {
    return this.actions.get(id);
  }

  public updateActionLevel(id: string, newLevel: ActionLevel): { success: boolean; reason?: string } {
    const action = this.actions.get(id);
    if (!action) {
      return { success: false, reason: 'Action not found' };
    }
    if (!action.canDemoteOrPromote || action.defaultLevel === 'L4') {
      return { success: false, reason: 'L4 actions are strictly immutable and cannot be changed' };
    }
    action.currentLevel = newLevel;
    return { success: true };
  }

  public canExecuteWithoutApproval(actionId: string): boolean {
    if (this.isKillSwitchActive) return false;
    const action = this.actions.get(actionId);
    if (!action) return false;
    return action.currentLevel === 'L0' || action.currentLevel === 'L1';
  }

  public isExecutionBlocked(actionId: string): boolean {
    if (this.isKillSwitchActive) return true;
    const action = this.actions.get(actionId);
    if (!action) return true;
    return action.currentLevel === 'L4';
  }
}
