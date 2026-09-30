import {
  ApprovalAction,
  ChatMessage,
  ScheduleEvent,
  TaskItem,
  ReminderItem,
  DailyPlanItem,
  DailyBriefing,
  EmailItem,
  BillItem,
  CallLogItem,
  NotificationMessageItem,
  AIToolExecution,
  AuditLogEntry,
  SystemSettings,
} from '@aip/shared-types';

export const INITIAL_APPROVAL_ACTIONS: ApprovalAction[] = [
  {
    id: 'act-001',
    title: 'Reply to Acme Corp Proposal',
    description: 'Send approved contract revisions to client',
    whatWillHappen: 'An email will be dispatched from your Gmail account to client@acmecorp.com with the signed redline attachment.',
    level: 'L2',
    status: 'pending',
    channel: 'push',
    isRead: false,
    createdAt: new Date().toISOString(),
    undoCountdownSeconds: 5,
    targetEntity: { type: 'mail', id: 'mail-001' },
  },
  {
    id: 'act-002',
    title: 'Reschedule Weekly Sync',
    description: 'Resolve schedule overlap by moving meeting to 3:30 PM',
    whatWillHappen: 'Calendar invite updates will be sent to 4 attendees on Google Calendar.',
    level: 'L1',
    status: 'pending',
    channel: 'in-app',
    isRead: false,
    createdAt: new Date().toISOString(),
    undoCountdownSeconds: 3,
    targetEntity: { type: 'event', id: 'evt-002' },
  },
  {
    id: 'act-003',
    title: 'AWS Cloud Hosting Invoice Payment',
    description: 'Pay monthly hosting bill of $240.00',
    whatWillHappen: 'Requires manual payment. Dwirro does NOT execute automated money transfers.',
    level: 'L4',
    status: 'pending',
    channel: 'sms',
    isRead: false,
    createdAt: new Date().toISOString(),
    targetEntity: { type: 'bill', id: 'bill-001' },
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-001',
    sender: 'assistant',
    text: 'Hello! I am your AI executive assistant. How can I help coordinate your schedule, emails, and daily tasks today?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const INITIAL_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 'evt-001',
    title: 'Engineering Architecture Review',
    startTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    location: 'Conference Room Alpha / Google Meet',
    category: 'work',
  },
  {
    id: 'evt-002',
    title: 'Product Roadmap Planning',
    startTime: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(11, 30, 0, 0)).toISOString(),
    location: 'Virtual Room 4',
    category: 'meeting',
  },
  {
    id: 'evt-003',
    title: 'Executive 1-on-1 Sync',
    startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(14, 45, 0, 0)).toISOString(),
    location: 'Executive Boardroom',
    category: 'meeting',
  },
  {
    id: 'evt-004',
    title: 'Deep Work: Platform Security Audit',
    startTime: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    category: 'work',
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-001',
    title: 'Review Q3 Security Penetration Report',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'high',
    completed: false,
    source: 'Security Team',
    proposedNextStep: 'Verify zero untrusted HTML inputs in frontend components',
  },
  {
    id: 'task-002',
    title: 'Renew Azure Cloud Subscription Certificate',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    priority: 'urgent',
    completed: false,
    source: 'Infra Alerts',
    proposedNextStep: 'Download certificate bundle and update KeyVault',
  },
  {
    id: 'task-003',
    title: 'Approve vendor contract for AI Gateway',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    priority: 'medium',
    completed: true,
  },
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-001',
    title: 'Take medication after lunch',
    time: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
    status: 'pending',
  },
  {
    id: 'rem-002',
    title: 'Check flight status for upcoming conference',
    time: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
    status: 'pending',
  },
];

export const INITIAL_DAILY_PLAN_ITEMS: DailyPlanItem[] = [
  {
    id: 'dp-001',
    title: '09:00 AM - Morning Standup & Triage',
    time: '09:00',
    category: 'Work',
    status: 'accepted',
  },
  {
    id: 'dp-002',
    title: '11:00 AM - Sprint Demo Rehearsal',
    time: '11:00',
    category: 'Work',
    status: 'proposed',
  },
  {
    id: 'dp-003',
    title: '02:00 PM - Quarterly Budget Review',
    time: '14:00',
    category: 'Finance',
    status: 'proposed',
  },
  {
    id: 'dp-004',
    title: '05:00 PM - Gym & Recovery Workout',
    time: '17:00',
    category: 'Personal',
    status: 'accepted',
  },
];

export const INITIAL_DAILY_BRIEFING: DailyBriefing = {
  date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
  summary: 'You have 4 scheduled calendar events today with 1 detected overlap at 10:30 AM. 2 high-priority tasks are due before end of day.',
  topPriorities: [
    'Resolve the 10:30 AM Engineering Review overlap',
    'Review the Q3 Security Penetration Report',
    'Authorize Acme Corp redline email dispatch',
  ],
  scheduleHighlights: [
    '10:00 AM: Engineering Architecture Review',
    '02:00 PM: Executive 1-on-1 Sync',
    '03:30 PM: Platform Security Audit',
  ],
  worldNews: [
    'Global Tech Summit announces new strict AI agent safety standards.',
    'Cloud infrastructure providers implement next-gen post-quantum encryption protocols.',
  ],
  audioDurationSeconds: 45,
};

export const INITIAL_EMAILS: EmailItem[] = [
  {
    id: 'mail-001',
    sender: 'Sarah Jenkins <s.jenkins@acmecorp.com>',
    senderDomain: 'acmecorp.com',
    subject: 'Partnership Agreement - Final Revisions',
    snippet: 'Hi team, please find attached our finalized legal redline for review...',
    body: 'Hi team,\n\nPlease review our finalized legal terms attached. If you agree, please send over the signed copy.\n\nBest regards,\nSarah Jenkins\nAcme Corp VP Legal',
    receivedAt: new Date(Date.now() - 1800000).toISOString(),
    label: 'Real',
    confidencePercent: 98,
    reason: {
      spfDkim: 'pass',
      domainAge: '8 years established',
      linkCheck: 'clean',
      urgencyTone: 'normal',
    },
    isUrgent: false,
    isImportant: true,
    isRead: false,
    draftReply: {
      text: 'Hi Sarah,\n\nThanks for sending over the finalized terms. We have reviewed and approved the revisions. Please find the countersigned document attached.\n\nBest,\nDwirro Assistant on behalf of user',
      status: 'draft',
    },
  },
  {
    id: 'mail-002',
    sender: 'Urgent Security Desk <security-alert@bank-verify-secure.net>',
    senderDomain: 'bank-verify-secure.net',
    subject: 'CRITICAL: Account Suspended - Verify Identity Immediately',
    snippet: 'Suspicious notice claiming urgent action is required. Click here to confirm...',
    body: 'ATTENTION: Your trial subscription will expire within 1 hour unless verified at http://suspicious-domain-example.invalid/notice.',
    receivedAt: new Date(Date.now() - 7200000).toISOString(),
    label: 'Suspicious',
    confidencePercent: 99,
    reason: {
      spfDkim: 'fail',
      domainAge: 'Created 2 days ago',
      linkCheck: 'phishing',
      urgencyTone: 'manipulative',
    },
    isUrgent: true,
    isImportant: false,
    isRead: false,
  },
  {
    id: 'mail-003',
    sender: 'MegaDeals Marketing <newsletter@deals-central.promo>',
    senderDomain: 'deals-central.promo',
    subject: '50% off entire developer tool stack this weekend!',
    snippet: 'Exclusive discount code inside for our VIP subscribers...',
    body: 'Unsubscribe anytime by clicking the link in the footer.',
    receivedAt: new Date(Date.now() - 86400000).toISOString(),
    label: 'Spam',
    confidencePercent: 94,
    reason: {
      spfDkim: 'pass',
      domainAge: '1 year',
      linkCheck: 'clean',
      urgencyTone: 'normal',
    },
    isUrgent: false,
    isImportant: false,
    isRead: true,
  },
];

export const INITIAL_BILLS: BillItem[] = [
  {
    id: 'bill-001',
    payee: 'AWS Cloud Hosting',
    amount: 240.0,
    currency: 'USD',
    dueDate: new Date().toISOString().split('T')[0], // Due today
    source: 'mail',
    status: 'due_today',
    maskedAccount: '•••• •••• •••• 9012',
    escalationStep: 'sms',
    reminderSchedule: { threeDay: true, oneDay: true, dayOf: true },
  },
  {
    id: 'bill-002',
    payee: 'Internet Fiber Gigabit',
    amount: 85.0,
    currency: 'USD',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    source: 'sms',
    status: 'upcoming',
    maskedAccount: '•••• •••• •••• 3456',
    escalationStep: 'push',
    reminderSchedule: { threeDay: true, oneDay: false, dayOf: false },
  },
  {
    id: 'bill-003',
    payee: 'Electricity Utility Corp',
    amount: 112.5,
    currency: 'USD',
    dueDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    source: 'mail',
    status: 'overdue',
    maskedAccount: '•••• •••• •••• 7890',
    escalationStep: 'call',
    reminderSchedule: { threeDay: true, oneDay: true, dayOf: true },
  },
];

export const INITIAL_CALL_LOGS: CallLogItem[] = [
  {
    id: 'call-001',
    callerNumber: '+1 (555) 234-5678',
    callerName: 'Dr. Emily Harrison Clinic',
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    aiSummary: 'Dental appointment confirmation for Thursday at 2:00 PM. No preparation required.',
    transcript: 'Hello, this is the Dental Clinic calling to confirm your upcoming appointment this Thursday at 2:00 PM. Please press 1 or call back if you need to reschedule.',
    assistantAnnouncedItself: true,
    recordingConsentGranted: true,
    recordingAudioUrl: 'mock-audio://call-001.mp3',
    status: 'screened',
  },
  {
    id: 'call-002',
    callerNumber: '+1 (800) 999-0011',
    callerName: 'Unknown Telemarketer',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    aiSummary: 'Robocall offering solar panel estimates. Screened and filtered as spam.',
    transcript: 'Congratulations, your zip code qualifies for zero down solar panel installation...',
    assistantAnnouncedItself: true,
    recordingConsentGranted: false, // Recording hidden due to lack of consent
    status: 'missed',
  },
];

export const INITIAL_NOTIFICATION_MESSAGES: NotificationMessageItem[] = [
  {
    id: 'notif-001',
    sender: 'Alex Rivera (Slack #infra-dev)',
    app: 'slack',
    summary: 'Asked for confirmation on the Redis memory cluster upgrade schedule.',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    draftOnlyReply: 'Hey Alex, cluster upgrade approved for 11 PM UTC maintenance window tonight.',
  },
  {
    id: 'notif-002',
    sender: 'Mom (WhatsApp)',
    app: 'whatsapp',
    summary: 'Asking if you are free for family dinner this Sunday.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    draftOnlyReply: 'Hi Mom! Yes, looking forward to dinner on Sunday around 6 PM.',
  },
];

export const INITIAL_AI_TOOL_EXECUTIONS: AIToolExecution[] = [
  {
    id: 'tool-exec-001',
    provider: 'Antigravity',
    toolName: 'Codebase Conflict Auditor',
    status: 'completed',
    resultSummary: 'Scanned 14 workspace packages: 0 duplicate routes, 0 conflicting types.',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    durationMs: 420,
  },
  {
    id: 'tool-exec-002',
    provider: 'Claude',
    toolName: 'Email Tone Synthesizer',
    status: 'completed',
    resultSummary: 'Drafted professional legal reply for Acme Corp contract agreement.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    durationMs: 1250,
  },
  {
    id: 'tool-exec-003',
    provider: 'GPT',
    toolName: 'Schedule Overlap Resolver',
    status: 'completed',
    resultSummary: 'Detected 30m overlap between Engineering Review & Roadmap Planning; proposed 3:30 PM shift.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    durationMs: 890,
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    action: 'Session Authentication Succeeded',
    level: 'L0',
    actor: 'user',
    result: 'allowed',
    details: 'User authenticated with MFA verification from 127.0.0.1',
  },
  {
    id: 'audit-002',
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    action: 'Email Intelligence Scan',
    level: 'L0',
    actor: 'assistant',
    result: 'executed',
    details: 'Scanned 3 messages, flagged 1 phishing attempt',
  },
  {
    id: 'audit-003',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    action: 'Generate Outbound Email Draft',
    level: 'L1',
    actor: 'assistant',
    result: 'allowed',
    details: 'Draft created for Acme Corp, submitted to approval queue',
  },
];

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  killSwitchActive: false,
  doNotDisturb: false,
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '07:00',
  },
  dataRetentionDays: 30,
  monthlyCostCapUsd: 50.0,
  currentMonthSpendUsd: 14.85,
  integrations: {
    gmail: { connected: true, lastSync: new Date().toISOString() },
    googleCalendar: { connected: true, lastSync: new Date().toISOString() },
    telephony: { connected: true, lastSync: new Date().toISOString() },
  },
  metrics: {
    reminderAccuracyPercent: 99.4,
    mailClassificationErrorPercent: 0.6,
    avgApprovalToSendSeconds: 4.2,
    missedDeadlinesCount: 0,
    rejectedActionsCount: 1,
    errorsThisWeekCount: 0,
  },
};
