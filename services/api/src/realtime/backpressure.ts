export class RealtimeBackpressureController {
  private maxBufferItems: number;
  private currentBufferedCount: number = 0;

  constructor(maxBufferItems: number = 50) {
    this.maxBufferItems = maxBufferItems;
  }

  public shouldThrottle(): boolean {
    return this.currentBufferedCount >= this.maxBufferItems;
  }

  public trackItemAdded(): void {
    this.currentBufferedCount++;
  }

  public trackItemProcessed(): void {
    if (this.currentBufferedCount > 0) {
      this.currentBufferedCount--;
    }
  }
}
