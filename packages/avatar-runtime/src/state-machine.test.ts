import { describe, it, expect } from 'vitest';
import { AvatarStateMachine } from './state-machine/index.js';

describe('AvatarStateMachine', () => {
  it('initializes in unloaded state and transitions to ready', () => {
    const sm = new AvatarStateMachine();
    expect(sm.getState()).toBe('unloaded');
    sm.transition('ready');
    expect(sm.getState()).toBe('ready');
  });

  it('transitions through speaking and idle states', () => {
    const sm = new AvatarStateMachine();
    sm.transition('speaking');
    expect(sm.getState()).toBe('speaking');
    sm.transition('idle');
    expect(sm.getState()).toBe('idle');
  });
});
