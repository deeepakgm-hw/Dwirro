export interface MemoryWriteRequest {
  userId: string;
  content: string;
  tags?: string[];
  embedding?: number[];
}

export class MemoryWritePath {
  public async write(request: MemoryWriteRequest): Promise<{ id: string }> {
    return { id: 'mem-write-1' };
  }
}
