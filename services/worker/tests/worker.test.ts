import { describe, it, expect } from 'vitest';
import * as jobs from '../src/jobs/index.js';

describe('Worker Jobs Definition', () => {
  it('should export all 12 job stubs', () => {
    expect(jobs).toBeDefined();
    expect(jobs.morningBriefingJob).toBeDefined();
    expect(jobs.eveningPlannerJob).toBeDefined();
    expect(jobs.dailyOpportunityScanJob).toBeDefined();
    expect(jobs.examScanJob).toBeDefined();
    expect(jobs.techEventScanJob).toBeDefined();
    expect(jobs.hackathonScanJob).toBeDefined();
    expect(jobs.billRemindersJob).toBeDefined();
    expect(jobs.deadlineRemindersJob).toBeDefined();
    expect(jobs.dailyReportJob).toBeDefined();
    expect(jobs.weeklyReportJob).toBeDefined();
    expect(jobs.integrationHealthCheckJob).toBeDefined();
    expect(jobs.notificationCleanupJob).toBeDefined();
  });
});