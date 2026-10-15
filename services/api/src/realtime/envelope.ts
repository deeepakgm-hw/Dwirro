export interface RealtimeEnvelope<T = any> {
  id: string;
  traceId: string;
  timestamp: number;
  type: string;
  payload: T;
}

export function wrapEnvelope<T>(type: string, payload: T, traceId?: string): RealtimeEnvelope<T> {
  return {
    id: `env-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    traceId: traceId || `trace-${Date.now()}`,
    timestamp: Date.now(),
    type,
    payload,
  };
}
