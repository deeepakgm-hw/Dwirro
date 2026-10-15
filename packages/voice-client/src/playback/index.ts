export interface AudioPlaybackQueueConfig {
  sampleRate: number;
  bufferAheadMs: number;
}

export class AudioPlaybackQueue {
  private queue: Float32Array[] = [];

  public enqueue(chunk: Float32Array): void {
    this.queue.push(chunk);
  }

  public clear(): void {
    this.queue = [];
  }

  public getQueueLength(): number {
    return this.queue.length;
  }
}
