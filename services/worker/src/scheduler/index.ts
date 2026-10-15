export interface ScheduledJobDef {
  name: string;
  cronExpression: string;
  timezone?: string;
}

export const CRON_SCHEDULES: Record<string, ScheduledJobDef> = {
  morningBriefing: {
    name: 'morning-briefing',
    cronExpression: '0 7 * * *',
  },
  eveningReflection: {
    name: 'evening-reflection',
    cronExpression: '0 21 * * *',
  },
  retentionPurge: {
    name: 'retention-purge',
    cronExpression: '0 3 * * 0',
  },
};
