export interface MicCaptureConfig {
  sampleRate: number;
  channelCount: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
}

export class MicrophoneCapture {
  private config: MicCaptureConfig;

  constructor(config: Partial<MicCaptureConfig> = {}) {
    this.config = {
      sampleRate: config.sampleRate || 16000,
      channelCount: config.channelCount || 1,
      echoCancellation: config.echoCancellation ?? true,
      noiseSuppression: config.noiseSuppression ?? true,
    };
  }

  public getConfig(): MicCaptureConfig {
    return this.config;
  }
}
