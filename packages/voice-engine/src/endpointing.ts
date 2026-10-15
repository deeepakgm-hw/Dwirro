export interface EndpointingConfig {
  silenceThresholdMs: number;
  maxTurnDurationMs: number;
}

export class TurnEndpointDetector {
  private config: EndpointingConfig;
  private lastSpeechTimestamp: number = 0;

  constructor(config: Partial<EndpointingConfig> = {}) {
    this.config = {
      silenceThresholdMs: config.silenceThresholdMs ?? 600,
      maxTurnDurationMs: config.maxTurnDurationMs ?? 15000,
    };
  }

  public recordSpeech(timestamp: number = Date.now()): void {
    this.lastSpeechTimestamp = timestamp;
  }

  public isEndpointReached(currentTimestamp: number = Date.now()): boolean {
    if (this.lastSpeechTimestamp === 0) return false;
    return (currentTimestamp - this.lastSpeechTimestamp) >= this.config.silenceThresholdMs;
  }
}
