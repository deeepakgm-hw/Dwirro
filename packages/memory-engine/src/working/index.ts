export interface WorkingMemoryItem {
  id: string;
  topic: string;
  value: any;
  updatedAt: number;
}

export class WorkingMemory {
  private buffer: Map<string, WorkingMemoryItem> = new Map();

  public set(key: string, item: WorkingMemoryItem): void {
    this.buffer.set(key, item);
  }

  public get(key: string): WorkingMemoryItem | undefined {
    return this.buffer.get(key);
  }

  public clear(): void {
    this.buffer.clear();
  }
}
