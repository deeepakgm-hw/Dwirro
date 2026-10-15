import { describe, it, expect } from 'vitest';
import { parseCues } from './cue-parser.js';

describe('Character Protocol Cue Parser', () => {
  it('strips cue tokens and produces clean text', () => {
    const raw = 'Hello there [expression:smile:0.8], I have your morning briefing ready [gesture:nod:600].';
    const result = parseCues(raw);

    expect(result.cleanText).toBe('Hello there , I have your morning briefing ready .');
    expect(result.cues).toHaveLength(2);
    expect(result.cues[0].token.type).toBe('expression');
    expect(result.cues[0].token.name).toBe('smile');
    expect(result.cues[0].token.intensity).toBe(0.8);

    expect(result.cues[1].token.type).toBe('gesture');
    expect(result.cues[1].token.name).toBe('nod');
    expect(result.cues[1].token.durationMs).toBe(600);
  });

  it('handles clean text without cues untouched', () => {
    const raw = 'Just a standard text sentence.';
    const result = parseCues(raw);
    expect(result.cleanText).toBe(raw);
    expect(result.cues).toHaveLength(0);
  });
});
