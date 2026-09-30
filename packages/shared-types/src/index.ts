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
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  KILL_SWITCH_ACTIVE: 'KILL_SWITCH_ACTIVE',
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

export type ActionLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export interface ActionDefinition {
  id: string;
  title: string;
  description: string;
  category: 'email' | 'calendar' | 'bill' | 'call' | 'task' | 'system' | 'financial';
  defaultLevel: ActionLevel;
  currentLevel: ActionLevel;
  canDemoteOrPromote: boolean; // false for L4 (strictly locked)
}

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
  requiresTwoFactor: boolean;
  isLocked: boolean;
  twoFactorAttempts: number;
  lockoutUntil: number | null;
  lastActiveTimestamp: number;
}

export interface ApprovalAction {
  id: string;
  title: string;
  description: string;
  whatWillHappen: string;
  level: ActionLevel;
  status: 'pending' | 'approving' | 'approved' | 'rejected' | 'cancelled' | 'executed';
  channel: 'push' | 'sms' | 'call' | 'in-app';
  isRead: boolean;
  createdAt: string;
  undoCountdownSeconds?: number;
  targetEntity?: {
    type: 'mail' | 'event' | 'bill' | 'call' | 'task' | 'tool';
    id: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  action?: ApprovalAction;
  isAudio?: boolean;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  location?: string;
  category: 'meeting' | 'work' | 'personal' | 'travel';
  hasConflict?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  source?: string;
  proposedNextStep?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string; // ISO string
  status: 'pending' | 'fired' | 'dismissed';
}

export interface DailyPlanItem {
  id: string;
  title: string;
  time: string;
  category: string;
  status: 'accepted' | 'edited' | 'dropped' | 'proposed';
}

export interface DailyBriefing {
  date: string;
  summary: string;
  topPriorities: string[];
  scheduleHighlights: string[];
  worldNews: string[];
  audioDurationSeconds: number;
}

export interface EmailItem {
  id: string;
  sender: string;
  senderDomain: string;
  subject: string;
  snippet: string;
  body: string;
  receivedAt: string;
  label: 'Real' | 'Spam' | 'Suspicious';
  confidencePercent: number;
  reason: {
    spfDkim: 'pass' | 'fail' | 'none';
    domainAge: string;
    linkCheck: 'clean' | 'suspicious' | 'phishing';
    urgencyTone: 'normal' | 'high' | 'manipulative';
  };
  isUrgent: boolean;
  isImportant: boolean;
  isRead: boolean;
  draftReply?: {
    text: string;
    status: 'draft' | 'pending_approval' | 'sending' | 'sent' | 'failed' | 'delivered';
    sentAt?: string;
    error?: string;
  };
}

export interface BillItem {
  id: string;
  payee: string;
  amount: number;
  currency: string;
  dueDate: string; // YYYY-MM-DD
  source: 'mail' | 'sms' | 'manual';
  status: 'upcoming' | 'due_today' | 'overdue' | 'paid';
  maskedAccount: string;
  hasConflict?: boolean;
  escalationStep: 'push' | 'sms' | 'call' | 'resolved';
  reminderSchedule: {
    threeDay: boolean;
    oneDay: boolean;
    dayOf: boolean;
  };
}

export interface CallLogItem {
  id: string;
  callerNumber: string;
  callerName?: string;
  timestamp: string;
  aiSummary: string;
  transcript: string;
  assistantAnnouncedItself: boolean;
  recordingConsentGranted: boolean;
  recordingAudioUrl?: string;
  status: 'missed' | 'screened' | 'live';
}

export interface NotificationMessageItem {
  id: string;
  sender: string;
  app: 'whatsapp' | 'slack' | 'telegram' | 'sms';
  summary: string;
  timestamp: string;
  draftOnlyReply?: string;
}

export interface AIToolExecution {
  id: string;
  provider: 'Claude' | 'GPT' | 'Antigravity';
  toolName: string;
  status: 'completed' | 'running' | 'failed' | 'blocked';
  resultSummary: string;
  timestamp: string;
  durationMs: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  level: ActionLevel;
  actor: 'user' | 'assistant' | 'system' | 'policy-engine';
  result: 'allowed' | 'blocked' | 'approved' | 'rejected' | 'failed' | 'executed';
  details?: string;
}

export interface SystemSettings {
  killSwitchActive: boolean;
  doNotDisturb: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
  };
  dataRetentionDays: number;
  monthlyCostCapUsd: number;
  currentMonthSpendUsd: number;
  integrations: {
    gmail: { connected: boolean; lastSync?: string };
    googleCalendar: { connected: boolean; lastSync?: string };
    telephony: { connected: boolean; lastSync?: string };
  };
  metrics: {
    reminderAccuracyPercent: number;
    mailClassificationErrorPercent: number;
    avgApprovalToSendSeconds: number;
    missedDeadlinesCount: number;
    rejectedActionsCount: number;
    errorsThisWeekCount: number;
  };
}
