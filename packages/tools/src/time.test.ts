import { describe, it, expect } from 'vitest';
import { TimeTool } from './time/index.js';

describe('TimeTool', () => {
  it('returns valid ISO timestamp', () => {
    const tool = new TimeTool();
    const timeStr = tool.getCurrentTime();
    expect(timeStr).toBeDefined();
    expect(new Date(timeStr).getTime()).toBeGreaterThan(0);
  });
});
