export interface BargeInDetectorConfig {
  speechConfidenceThreshold: number;
  gracePeriodMs: number;
}

export class BargeInDetector {
  private isInterrupted: boolean = false;

  public triggerBargeIn(): boolean {
    this.isInterrupted = true;
    return true;
  }

  public reset(): void {
    this.isInterrupted = false;
  }

  public getInterrupted(): boolean {
    return this.isInterrupted;
  }
}
