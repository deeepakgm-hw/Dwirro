export interface STTOptions {
  language?: string;
  interimResults?: boolean;
}

export interface STTTranscript {
  text: string;
  isFinal: boolean;
  confidence: number;
}

export interface STTProvider {
  transcribeStream(stream: AsyncIterable<Buffer>): AsyncIterable<STTTranscript>;
}
