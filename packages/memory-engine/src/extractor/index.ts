export interface ExtractedFact {
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
}

export class MemoryExtractor {
  public async extractFactsFromTurn(userMessage: string, assistantReply: string): Promise<ExtractedFact[]> {
    return [];
  }
}
