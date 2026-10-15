export interface MemoryReadQuery {
  userId: string;
  query: string;
  limit?: number;
}

export class MemoryReadPath {
  public async query(readQuery: MemoryReadQuery): Promise<any[]> {
    return [];
  }
}
