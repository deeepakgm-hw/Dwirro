export class TimeTool {
  public getCurrentTime(timezone?: string): string {
    return new Date().toISOString();
  }
}
