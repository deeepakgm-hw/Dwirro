import { Queue } from 'bullmq';

export const QUEUE_NAMES = {
  MORNING_BRIEFING: 'morning-briefing',
  REMINDER_DELIVERY: 'reminder-delivery',
  MEMORY_CONSOLIDATION: 'memory-consolidation',
  EMBEDDING_BACKFILL: 'embedding-backfill',
  TOKEN_REFRESH: 'token-refresh',
  RETENTION_PURGE: 'retention-purge',
  APPROVAL_EXPIRY: 'approval-expiry',
  NOTIFICATION_DIGEST: 'notification-digest',
  EVENING_REFLECTION: 'evening-reflection',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
