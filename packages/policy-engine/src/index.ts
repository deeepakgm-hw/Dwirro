import { ActionLevel, ActionDefinition, AuditLogEntry } from '@aip/shared-types';

export const ACTION_LEVEL_DESCRIPTIONS: Record<ActionLevel, { label: string; badgeColor: string; description: string }> = {
  L0: {
    label: 'L0 - Autonomous',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Autonomous action: No prior confirmation needed.',
  },
  L1: {
    label: 'L1 - Notify Only',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Executes automatically with asynchronous user notification.',
  },
  L2: {
    label: 'L2 - Review & Approve',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Requires explicit user approval before execution.',
  },
  L3: {
    label: 'L3 - High Consequence',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'High consequence action: Requires multi-step confirmation and audit logging.',
  },
  L4: {
    label: 'L4 - Strictly Manual',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    description: 'Strictly manual (Do it yourself): Assistant cannot execute under any condition.',
  },
};

export const DEFAULT_ACTION_CATALOG: ActionDefinition[] = [
  {
    id: 'act-mail-read',
    title: 'Summarize Incoming Mail',
    description: 'Scan inbox and generate executive summaries',
    category: 'email',
    defaultLevel: 'L0',
    currentLevel: 'L0',
    canDemoteOrPromote: true,
  },
  {
    id: 'act-mail-draft',
    title: 'Draft Email Reply',
    description: 'Create draft in user tone without sending',
    category: 'email',
    defaultLevel: 'L1',
    currentLevel: 'L1',
    canDemoteOrPromote: true,
  },
  {
    id: 'act-mail-send',
    title: 'Send Outbound Email',
    description: 'Dispatch generated email to recipient',
    category: 'email',
    defaultLevel: 'L2',
    currentLevel: 'L2',
    canDemoteOrPromote: true,
  },
  {
    id: 'act-calendar-propose',
    title: 'Propose Calendar Reschedule',
    description: 'Draft schedule conflict resolution',
    category: 'calendar',
    defaultLevel: 'L1',
    currentLevel: 'L1',
    canDemoteOrPromote: true,
  },
  {
    id: 'act-bill-remind',
    title: 'Bill Reminder Escalation',
    description: 'Send Push/SMS alerts for upcoming bills',
    category: 'bill',
    defaultLevel: 'L1',
    currentLevel: 'L1',
    canDemoteOrPromote: true,
  },
  {
    id: 'act-tool-external',
    title: 'Execute Cloud Tool / Agent',
    description: 'Dispatch subtask to external AI model',
    category: 'system',
    defaultLevel: 'L2',
    currentLevel: 'L2',
    canDemoteOrPromote: true,
  },
  {
    id: 'act-config-retention',
    title: 'Alter Data Retention Policy',
    description: 'Purge or shorten log storage windows',
    category: 'system',
    defaultLevel: 'L3',
    currentLevel: 'L3',
    canDemoteOrPromote: true,
  },
  {
    id: 'act-pay-funds',
    title: 'Execute Financial Payment / Money Transfer',
    description: 'Transmit funds or debit user bank/card',
    category: 'financial',
    defaultLevel: 'L4',
    currentLevel: 'L4',
    canDemoteOrPromote: false, // L4 is strictly locked
  },
  {
    id: 'act-system-wipe',
    title: 'Delete Complete User History',
    description: 'Purge all memory, credentials and accounts',
    category: 'system',
    defaultLevel: 'L4',
    currentLevel: 'L4',
    canDemoteOrPromote: false, // L4 is strictly locked
  },
];

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
