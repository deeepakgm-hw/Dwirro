export interface VisemeFrame {
  timestamp: number;
  viseme: 'aa' | 'ih' | 'ou' | 'ee' | 'oh' | 'sil';
  weight: number;
}

export class AudioLipSyncEngine {
  public calculateVisemes(audioChunk: Float32Array): VisemeFrame[] {
    return [];
  }
}
