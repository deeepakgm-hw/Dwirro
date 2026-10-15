import { describe, it, expect } from 'vitest';
import { BargeInDetector } from './barge-in/index.js';

describe('BargeInDetector', () => {
  it('detects interrupt and allows reset', () => {
    const detector = new BargeInDetector();
    expect(detector.getInterrupted()).toBe(false);

    detector.triggerBargeIn();
    expect(detector.getInterrupted()).toBe(true);

    detector.reset();
    expect(detector.getInterrupted()).toBe(false);
  });
});
