export interface DailyReportPayload {
  jobId: string;
  userId: string;
  schedule: string;
  idempotencyKey: string;
  timeoutMs: number;
  retryCount: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export const dailyReportJob = {};
export default {};