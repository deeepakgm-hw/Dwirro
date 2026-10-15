export class VoicePathRouter {
  public routeInboundAudio(sessionId: string, audioChunk: Buffer): void {
    // Routes inbound audio chunk to voice-engine STT pipeline
  }

  public routeOutboundAudio(sessionId: string, audioChunk: Buffer): void {
    // Dispatches synthesized TTS chunks to client session transport
  }
}
