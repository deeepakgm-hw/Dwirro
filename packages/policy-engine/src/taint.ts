export interface TaintSource {
  origin: 'external_email' | 'web_search' | 'untrusted_webhook' | 'user_input';
  tainted: boolean;
}

export function isInputTainted(source: TaintSource): boolean {
  return source.tainted;
}
