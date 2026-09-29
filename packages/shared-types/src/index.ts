export const ErrorCode = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  TIMEOUT: 'TIMEOUT',
  PROVIDER_ERROR: 'PROVIDER_ERROR',
  INVALID_DATA: 'INVALID_DATA',
  POLICY_BLOCKED: 'POLICY_BLOCKED',
  APPROVAL_REQUIRED: 'APPROVAL_REQUIRED',
  INTEGRATION_DISABLED: 'INTEGRATION_DISABLED',
  CHANNEL_UNAVAILABLE: 'CHANNEL_UNAVAILABLE',
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface BaseJobPayload {
  jobId: string;
  userId: string;
  schedule: string;
  idempotencyKey: string;
  timeoutMs: number;
  retryCount: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export default {};
