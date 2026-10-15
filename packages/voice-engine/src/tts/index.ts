export interface TTSOptions {
  voiceId?: string;
  speed?: number;
  pitch?: number;
}

export interface TTSProvider {
  synthesize(text: string, options?: TTSOptions): Promise<Buffer>;
  synthesizeStream(text: string, options?: TTSOptions): AsyncIterable<Buffer>;
}
