import { describe, it, expect } from 'vitest';
import { PolicyEngine } from './evaluate.js';

interface TestCase {
  actionId: string;
  expectedLevel: string;
  canExecAutonomous: boolean;
  blocked?: boolean;
}

describe('Policy Engine Rules Table Test', () => {
  const engine = new PolicyEngine();

  const testMatrix: TestCase[] = [
    { actionId: 'act-mail-read', expectedLevel: 'L0', canExecAutonomous: true },
    { actionId: 'act-mail-draft', expectedLevel: 'L1', canExecAutonomous: true },
    { actionId: 'act-mail-send', expectedLevel: 'L2', canExecAutonomous: false },
    { actionId: 'act-tool-external', expectedLevel: 'L2', canExecAutonomous: false },
    { actionId: 'act-pay-funds', expectedLevel: 'L4', canExecAutonomous: false, blocked: true },
    { actionId: 'act-system-wipe', expectedLevel: 'L4', canExecAutonomous: false, blocked: true },
  ];

  it.each(testMatrix)('evaluates action $actionId to level $expectedLevel', ({ actionId, expectedLevel, canExecAutonomous, blocked }: TestCase) => {
    const action = engine.getAction(actionId);
    expect(action).toBeDefined();
    expect(action?.currentLevel).toBe(expectedLevel);
    expect(engine.canExecuteWithoutApproval(actionId)).toBe(canExecAutonomous);
    if (blocked) {
      expect(engine.isExecutionBlocked(actionId)).toBe(true);
    }
  });

  it('blocks all actions when kill switch is enabled', () => {
    const freshEngine = new PolicyEngine();
    freshEngine.setKillSwitch(true);
    expect(freshEngine.canExecuteWithoutApproval('act-mail-read')).toBe(false);
    expect(freshEngine.isExecutionBlocked('act-mail-read')).toBe(true);
  });
});
