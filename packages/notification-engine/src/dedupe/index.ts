export class NotificationDeduplicator {
  private seenHashes = new Set<string>();

  public isDuplicate(hash: string): boolean {
    if (this.seenHashes.has(hash)) return true;
    this.seenHashes.add(hash);
    return false;
  }
}
