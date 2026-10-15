export interface VADConfig {
  threshold: number;
  minSpeechDurationMs: number;
  silenceDurationMs: number;
}

export class VoiceActivityDetector {
  private config: VADConfig;

  constructor(config: Partial<VADConfig> = {}) {
    this.config = {
      threshold: config.threshold ?? 0.5,
      minSpeechDurationMs: config.minSpeechDurationMs ?? 250,
      silenceDurationMs: config.silenceDurationMs ?? 400,
    };
  }

  public processFrame(pcmData: Float32Array): boolean {
    return false;
  }
}
