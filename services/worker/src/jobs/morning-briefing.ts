export interface MorningBriefingPayload {
  jobId: string;
  userId: string;
  schedule: string;
  idempotencyKey: string;
  timeoutMs: number;
  retryCount: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export const morningBriefingJob = {};
export default {};