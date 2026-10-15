export type CharacterExpression =
  | 'neutral'
  | 'happy'
  | 'smile'
  | 'thinking'
  | 'serious'
  | 'concerned'
  | 'surprised'
  | 'attentive';

export type CharacterGesture =
  | 'idle'
  | 'nod'
  | 'shake_head'
  | 'wave'
  | 'point'
  | 'explain'
  | 'shrug'
  | 'listen';

export interface EmotionVector {
  valence: number; // -1.0 (unhappy) to +1.0 (happy)
  arousal: number; // 0.0 (calm) to +1.0 (excited)
}

export interface CueToken {
  type: 'expression' | 'gesture' | 'pause';
  name: string;
  intensity?: number;
  durationMs?: number;
}
