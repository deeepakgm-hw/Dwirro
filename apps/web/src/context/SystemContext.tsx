import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  ActionLevel,
} from '@aip/shared-types';
import {
  INITIAL_APPROVAL_ACTIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_SCHEDULE_EVENTS,
  INITIAL_TASKS,
  INITIAL_REMINDERS,
  INITIAL_DAILY_PLAN_ITEMS,
  INITIAL_DAILY_BRIEFING,
  INITIAL_EMAILS,
  INITIAL_BILLS,
  INITIAL_CALL_LOGS,
  INITIAL_NOTIFICATION_MESSAGES,
  INITIAL_AI_TOOL_EXECUTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_SETTINGS,
} from '../mock/mockData';
import {
  detectScheduleConflicts,
  detectDuplicateBills,
  generateBillReminderDates,
} from '@aip/shared-utils';
import { PolicyEngine } from '@aip/policy-engine';

interface SystemContextType {
  // Global Safety & Kill Switch
  isKillSwitchActive: boolean;
  setKillSwitch: (active: boolean) => void;
  policyEngine: PolicyEngine;
  
  // DND & Quiet Hours
  doNotDisturb: boolean;
  setDoNotDisturb: (dnd: boolean) => void;
  
  // Approvals & Notifications
  approvalActions: ApprovalAction[];
  approveAction: (actionId: string) => void;
  undoApproval: (actionId: string) => void;
  finalizeApproval: (actionId: string) => void;
  rejectAction: (actionId: string) => void;
  markApprovalRead: (actionId: string) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  
  // Schedule & Tasks
  scheduleEvents: ScheduleEvent[];
  tasks: TaskItem[];
  reminders: ReminderItem[];
  dailyPlan: DailyPlanItem[];
  dailyBriefing: DailyBriefing;
  addScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  toggleTask: (taskId: string) => void;
  addTask: (title: string, dueDate: string, priority: TaskItem['priority']) => void;
  addReminder: (title: string, timeIso: string) => { success: boolean; error?: string };
  updateDailyPlanItemStatus: (id: string, status: DailyPlanItem['status']) => void;
  approveEntireDailyPlan: () => void;
  
  // Email
  emails: EmailItem[];
  activeEmailId: string | null;
  setActiveEmailId: (id: string | null) => void;
  updateDraftReply: (emailId: string, text: string) => void;
  sendEmailReply: (emailId: string) => void;
  undoEmailReply: (emailId: string) => void;
  finalizeEmailSend: (emailId: string) => void;
  retryEmailDelivery: (emailId: string) => void;
  
  // Bills
  bills: BillItem[];
  addBill: (payee: string, amount: number, dueDate: string, source: 'mail' | 'sms' | 'manual') => { success: boolean; error?: string };
  updateBillDueDate: (billId: string, newDueDate: string) => void;
  
  // Calls & Messages
  callLogs: CallLogItem[];
  notificationMessages: NotificationMessageItem[];
  toggleRecordingConsent: (callId: string) => void;
  
  // AI Tools
  aiToolExecutions: AIToolExecution[];
  activeToolsState: Record<string, boolean>;
  toggleToolState: (provider: string, toolName: string) => void;
  
  // Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, level: ActionLevel, actor: AuditLogEntry['actor'], result: AuditLogEntry['result'], details?: string) => void;
  
  // Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  deleteEverything: (confirmationText: string) => boolean;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [policyEngine] = useState<PolicyEngine>(() => new PolicyEngine());
  const [isKillSwitchActive, setIsKillSwitchActive] = useState<boolean>(false);
  const [doNotDisturb, setDoNotDisturb] = useState<boolean>(false);

  const [approvalActions, setApprovalActions] = useState<ApprovalAction[]>(INITIAL_APPROVAL_ACTIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(() =>
    detectScheduleConflicts(INITIAL_SCHEDULE_EVENTS)
  );
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);
  const [dailyPlan, setDailyPlan] = useState<DailyPlanItem[]>(INITIAL_DAILY_PLAN_ITEMS);
  const [dailyBriefing] = useState<DailyBriefing>(INITIAL_DAILY_BRIEFING);

  const [emails, setEmails] = useState<EmailItem[]>(INITIAL_EMAILS);
  const [activeEmailId, setActiveEmailId] = useState<string | null>(INITIAL_EMAILS[0]?.id || null);

  const [bills, setBills] = useState<BillItem[]>(() => detectDuplicateBills(INITIAL_BILLS));
  const [callLogs, setCallLogs] = useState<CallLogItem[]>(INITIAL_CALL_LOGS);
  const [notificationMessages] = useState<NotificationMessageItem[]>(INITIAL_NOTIFICATION_MESSAGES);

  const [aiToolExecutions] = useState<AIToolExecution[]>(INITIAL_AI_TOOL_EXECUTIONS);
  const [activeToolsState, setActiveToolsState] = useState<Record<string, boolean>>({
    'Claude:Email Tone Synthesizer': true,
    'GPT:Schedule Overlap Resolver': true,
    'Antigravity:Codebase Conflict Auditor': true,
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SYSTEM_SETTINGS);

  const setKillSwitch = (active: boolean) => {
    setIsKillSwitchActive(active);
    policyEngine.setKillSwitch(active);
    addAuditLog(
      active ? 'Emergency Kill Switch Activated' : 'Emergency Kill Switch Resumed',
      'L3',
      'user',
      active ? 'blocked' : 'allowed',
      active ? 'All automated assistant actions paused' : 'Assistant operations resumed'
    );
  };

  const addAuditLog = (
    action: string,
    level: ActionLevel,
    actor: AuditLogEntry['actor'],
    result: AuditLogEntry['result'],
    details?: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      action,
      level,
      actor,
      result,
      details,
    };
    // Append-only
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const approveAction = (actionId: string) => {
    if (isKillSwitchActive) return;
    setApprovalActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status: 'approving' } : a))
    );
  };

  const undoApproval = (actionId: string) => {
    setApprovalActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status: 'pending' } : a))
    );
    addAuditLog('Action Approval Cancelled via Undo', 'L2', 'user', 'allowed', `Action ID: ${actionId}`);
  };

  const finalizeApproval = (actionId: string) => {
    setApprovalActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status: 'executed' } : a))
    );
    addAuditLog('Action Approved and Executed', 'L2', 'user', 'executed', `Action ID: ${actionId}`);
  };

  const rejectAction = (actionId: string) => {
    setApprovalActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status: 'rejected' } : a))
    );
    addAuditLog('Action Rejected by User', 'L2', 'user', 'rejected', `Action ID: ${actionId}`);
  };

  const markApprovalRead = (actionId: string) => {
    setApprovalActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, isRead: true } : a))
    );
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Check prompt injection
    const isForwardFiles = /forward (?:all )?files to/i.test(text);
    if (isForwardFiles) {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'Security Alert: Instruction to forward user files is blocked. Assistant will not execute unverified data forwarding commands.',
          timestamp: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, replyMsg]);
        addAuditLog('Prompt Injection Attempt Blocked', 'L4', 'policy-engine', 'blocked', text);
      }, 500);
      return;
    }

    // Check if user requested an action that produces an ApprovalCard
    const isRescheduleReq = /reschedule|calendar|meeting/i.test(text);
    const inlineAction: ApprovalAction | undefined = isRescheduleReq
      ? {
          id: `act-inline-${Date.now()}`,
          title: 'Reschedule Conflicting Meeting',
          description: 'Move Engineering Architecture Review to 11:30 AM',
          whatWillHappen: 'Send Google Calendar invite update to attendees.',
          level: 'L2',
          status: 'pending',
          channel: 'in-app',
          isRead: true,
          createdAt: new Date().toISOString(),
          undoCountdownSeconds: 5,
        }
      : undefined;

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: inlineAction
          ? `I noticed a conflict with your morning schedule. I have drafted a reschedule proposal for your review.`
          : `I have received your request: "${text}". How would you like to proceed?`,
        timestamp: new Date().toISOString(),
        action: inlineAction,
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    }, 400);
  };

  const addScheduleEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: `evt-${Date.now()}`,
    };
    setScheduleEvents((prev) => detectScheduleConflicts([...prev, newEvent]));
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (title: string, dueDate: string, priority: TaskItem['priority']) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      dueDate,
      priority,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const addReminder = (title: string, timeIso: string): { success: boolean; error?: string } => {
    if (new Date(timeIso).getTime() <= Date.now()) {
      return { success: false, error: 'Cannot set reminders for past times.' };
    }
    const newReminder: ReminderItem = {
      id: `rem-${Date.now()}`,
      title,
      time: timeIso,
      status: 'pending',
    };
    setReminders((prev) => [...prev, newReminder]);
    return { success: true };
  };

  const updateDailyPlanItemStatus = (id: string, status: DailyPlanItem['status']) => {
    setDailyPlan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const approveEntireDailyPlan = () => {
    setDailyPlan((prev) =>
      prev.map((item) => (item.status === 'proposed' ? { ...item, status: 'accepted' } : item))
    );
    addAuditLog('Evening Plan Approved', 'L1', 'user', 'approved', "Tomorrow's daily plan committed");
  };

  const updateDraftReply = (emailId: string, text: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === emailId
          ? {
              ...e,
              draftReply: e.draftReply
                ? { ...e.draftReply, text, status: 'draft' }
                : { text, status: 'draft' },
            }
          : e
      )
    );
  };

  const sendEmailReply = (emailId: string) => {
    if (isKillSwitchActive) return;
    setEmails((prev) =>
      prev.map((e) =>
        e.id === emailId && e.draftReply
          ? { ...e, draftReply: { ...e.draftReply, status: 'sending' } }
          : e
      )
    );
  };

  const undoEmailReply = (emailId: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === emailId && e.draftReply
          ? { ...e, draftReply: { ...e.draftReply, status: 'draft' } }
          : e
      )
    );
  };

  const finalizeEmailSend = (emailId: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === emailId && e.draftReply
          ? {
              ...e,
              draftReply: {
                ...e.draftReply,
                status: 'delivered',
                sentAt: new Date().toLocaleTimeString(),
              },
            }
          : e
      )
    );
    addAuditLog('Email Dispatched & Delivered', 'L2', 'assistant', 'executed', `Recipient: ${emailId}`);
  };

  const retryEmailDelivery = (emailId: string) => {
    sendEmailReply(emailId);
  };

  const addBill = (
    payee: string,
    amount: number,
    dueDate: string,
    source: 'mail' | 'sms' | 'manual'
  ): { success: boolean; error?: string } => {
    if (!payee || !amount || !dueDate) {
      return { success: false, error: 'Please enter payee, amount, and due date.' };
    }
    const newBill: BillItem = {
      id: `bill-${Date.now()}`,
      payee,
      amount,
      currency: 'USD',
      dueDate,
      source,
      status: 'upcoming',
      maskedAccount: '•••• •••• •••• 9999',
      escalationStep: 'push',
      reminderSchedule: { threeDay: true, oneDay: true, dayOf: true },
    };
    setBills((prev) => detectDuplicateBills([...prev, newBill]));
    return { success: true };
  };

  const updateBillDueDate = (billId: string, newDueDate: string) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id !== billId) return b;
        generateBillReminderDates(newDueDate);
        return {
          ...b,
          dueDate: newDueDate,
          reminderSchedule: { threeDay: true, oneDay: true, dayOf: true },
        };
      })
    );
  };

  const toggleRecordingConsent = (callId: string) => {
    setCallLogs((prev) =>
      prev.map((c) =>
        c.id === callId ? { ...c, recordingConsentGranted: !c.recordingConsentGranted } : c
      )
    );
  };

  const toggleToolState = (provider: string, toolName: string) => {
    const key = `${provider}:${toolName}`;
    const nextState = !activeToolsState[key];
    setActiveToolsState((prev) => ({ ...prev, [key]: nextState }));
    addAuditLog(
      nextState ? `Tool Enabled: ${toolName}` : `Tool Disabled: ${toolName}`,
      'L2',
      'user',
      'allowed',
      `Provider: ${provider}`
    );
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev: SystemSettings) => ({ ...prev, ...newSettings }));
  };

  const deleteEverything = (confirmationText: string): boolean => {
    if (confirmationText.trim() === 'DELETE EVERYTHING PERMANENTLY') {
      setApprovalActions([]);
      setChatMessages([]);
      setScheduleEvents([]);
      setTasks([]);
      setReminders([]);
      setDailyPlan([]);
      setEmails([]);
      setBills([]);
      setCallLogs([]);
      setAuditLogs([]);
      addAuditLog('System Data Purged', 'L4', 'user', 'executed', 'Full user data reset');
      return true;
    }
    return false;
  };

  return (
    <SystemContext.Provider
      value={{
        isKillSwitchActive,
        setKillSwitch,
        policyEngine,
        doNotDisturb,
        setDoNotDisturb,
        approvalActions,
        approveAction,
        undoApproval,
        finalizeApproval,
        rejectAction,
        markApprovalRead,
        chatMessages,
        sendMessage,
        scheduleEvents,
        tasks,
        reminders,
        dailyPlan,
        dailyBriefing,
        addScheduleEvent,
        toggleTask,
        addTask,
        addReminder,
        updateDailyPlanItemStatus,
        approveEntireDailyPlan,
        emails,
        activeEmailId,
        setActiveEmailId,
        updateDraftReply,
        sendEmailReply,
        undoEmailReply,
        finalizeEmailSend,
        retryEmailDelivery,
        bills,
        addBill,
        updateBillDueDate,
        callLogs,
        notificationMessages,
        toggleRecordingConsent,
        aiToolExecutions,
        activeToolsState,
        toggleToolState,
        auditLogs,
        addAuditLog,
        settings,
        updateSettings,
        deleteEverything,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within a SystemProvider');
  return context;
};
