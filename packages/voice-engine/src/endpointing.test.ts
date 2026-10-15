import { describe, it, expect } from 'vitest';
import { TurnEndpointDetector } from './endpointing.js';

describe('TurnEndpointDetector', () => {
  it('detects silence threshold endpointing', () => {
    const detector = new TurnEndpointDetector({ silenceThresholdMs: 500 });
    const t0 = 1000;
    detector.recordSpeech(t0);

    expect(detector.isEndpointReached(t0 + 200)).toBe(false);
    expect(detector.isEndpointReached(t0 + 500)).toBe(true);
    expect(detector.isEndpointReached(t0 + 800)).toBe(true);
  });
});
