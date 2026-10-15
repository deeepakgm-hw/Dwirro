import { CueToken } from './vocab.js';

export interface ParsedCueResult {
  cleanText: string;
  cues: Array<{
    token: CueToken;
    index: number;
  }>;
}

const CUE_REGEX = /\[(expression|gesture|pause):?([a-zA-Z0-9_-]+)?(?::([0-9.]+))?\]/gi;

/**
 * Parses inline character cues formatted like:
 * "[expression:smile]" or "[gesture:nod:500]" or "[pause:200]" or "[smile]"
 */
export function parseCues(rawText: string): ParsedCueResult {
  const cues: Array<{ token: CueToken; index: number }> = [];

  const cleanText = rawText.replace(CUE_REGEX, (match, type, name, param, offset) => {
    let tokenType: CueToken['type'] = 'expression';
    let cueName = name || '';
    let durationOrIntensity: number | undefined;

    const lowerType = String(type).toLowerCase();
    if (lowerType === 'gesture') {
      tokenType = 'gesture';
    } else if (lowerType === 'pause') {
      tokenType = 'pause';
    } else {
      tokenType = 'expression';
    }

    if (param) {
      durationOrIntensity = parseFloat(param);
    }

    cues.push({
      token: {
        type: tokenType,
        name: cueName || 'default',
        intensity: tokenType === 'expression' ? durationOrIntensity : undefined,
        durationMs: tokenType !== 'expression' ? durationOrIntensity : undefined,
      },
      index: offset,
    });

    return '';
  }).trim();

  return {
    cleanText,
    cues,
  };
}
