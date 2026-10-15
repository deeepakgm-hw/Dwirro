export class SyncClock {
  private offsetMs: number = 0;

  public synchronize(serverTimestamp: number): void {
    const now = Date.now();
    this.offsetMs = serverTimestamp - now;
  }

  public now(): number {
    return Date.now() + this.offsetMs;
  }
}
