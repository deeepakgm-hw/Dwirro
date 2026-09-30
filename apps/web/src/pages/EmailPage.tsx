import React, { useState, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import {
  Mail,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Send,
  RotateCcw,
  Clock,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';

export const EmailPage: React.FC = () => {
  const {
    emails,
    activeEmailId,
    setActiveEmailId,
    updateDraftReply,
    sendEmailReply,
    undoEmailReply,
    finalizeEmailSend,
    retryEmailDelivery,
    isKillSwitchActive,
  } = useSystem();

  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent' | 'suspicious'>('all');
  const [undoTimers, setUndoTimers] = useState<Record<string, number>>({});

  const activeEmail = emails.find((e) => e.id === activeEmailId) || emails[0];

  // Manage undo delay timer for replies in 'sending' status
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    emails.forEach((email) => {
      if (email.draftReply?.status === 'sending') {
        const id = email.id;
        if (undoTimers[id] === undefined) {
          setUndoTimers((prev) => ({ ...prev, [id]: 5 }));
        }

        const interval = setInterval(() => {
          setUndoTimers((prev) => {
            const current = prev[id] ?? 5;
            if (current <= 1) {
              clearInterval(interval);
              finalizeEmailSend(id);
              const next = { ...prev };
              delete next[id];
              return next;
            }
            return { ...prev, [id]: current - 1 };
          });
        }, 1000);

        intervals.push(interval);
      }
    });

    return () => {
      intervals.forEach((i) => clearInterval(i));
    };
  }, [emails, undoTimers, finalizeEmailSend]);

  const filteredEmails = emails.filter((mail) => {
    if (filter === 'unread') return !mail.isRead;
    if (filter === 'urgent') return mail.isUrgent;
    if (filter === 'suspicious') return mail.label === 'Suspicious';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <Mail className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-extrabold text-slate-100">Email Intelligence Hub</h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {(['all', 'unread', 'urgent', 'suspicious'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Email List Column */}
        <div className="lg:col-span-5 space-y-3">
          {filteredEmails.map((mail) => {
            const isSelected = mail.id === activeEmail?.id;
            return (
              <div
                key={mail.id}
                data-testid="email-card"
                onClick={() => setActiveEmailId(mail.id)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all shadow-sm ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/60 shadow-md'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-200 truncate">{mail.sender}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {mail.label === 'Suspicious' && (
                      <span
                        data-testid="badge-suspicious"
                        className="text-[10px] uppercase font-bold bg-red-950 text-red-300 border border-red-500/50 px-2 py-0.5 rounded-full flex items-center gap-1"
                      >
                        <ShieldAlert className="w-3 h-3 text-red-400" /> Suspicious ({mail.confidencePercent}%)
                      </span>
                    )}
                    {mail.label === 'Real' && (
                      <span className="text-[10px] uppercase font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Real ({mail.confidencePercent}%)
                      </span>
                    )}
                    {mail.label === 'Spam' && (
                      <span className="text-[10px] uppercase font-bold bg-amber-950 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded-full">
                        Spam ({mail.confidencePercent}%)
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-slate-100 mb-1">{mail.subject}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{mail.snippet}</p>

                {mail.draftReply?.status === 'delivered' && (
                  <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Reply delivered
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Email Detail & Smart Reply Column */}
        <div className="lg:col-span-7">
          {activeEmail ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-slate-800">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-bold text-slate-100">{activeEmail.subject}</h3>
                  <span className="text-xs text-slate-400 shrink-0 font-mono">
                    {new Date(activeEmail.receivedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-0.5">
                  <p>From: <strong className="text-slate-200">{activeEmail.sender}</strong></p>
                  <p>Domain: <span className="font-mono text-cyan-400">{activeEmail.senderDomain}</span></p>
                </div>
              </div>

              {/* Security Classification Rationale */}
              <div
                className={`rounded-2xl p-4 border text-xs space-y-2 ${
                  activeEmail.label === 'Suspicious'
                    ? 'bg-red-950/30 border-red-500/40 text-red-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="uppercase tracking-wider">AI Security & Authenticity Report</span>
                  <span>Confidence: {activeEmail.confidencePercent}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div>• SPF/DKIM Verification: <strong className="uppercase">{activeEmail.reason.spfDkim}</strong></div>
                  <div>• Domain Trust: <strong>{activeEmail.reason.domainAge}</strong></div>
                  <div>• Link Analysis: <strong>{activeEmail.reason.linkCheck}</strong></div>
                  <div>• Urgency Tone: <strong>{activeEmail.reason.urgencyTone}</strong></div>
                </div>

                {activeEmail.label === 'Suspicious' && (
                  <div
                    data-testid="suspicious-warning-alert"
                    className="mt-3 bg-red-900/40 border border-red-500/50 rounded-xl p-3 text-red-200 flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">Caution: Suspicious Communication</strong>
                      <p className="text-[11px] mt-0.5">
                        One-click navigation is disabled. Links are rendered in plaintext for your safety.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800/80 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {activeEmail.body}
              </div>

              {/* Smart Reply Section */}
              {activeEmail.draftReply && (
                <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      AI Generated Reply Draft (In Your Style)
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      Status: {activeEmail.draftReply.status}
                    </span>
                  </div>

                  <textarea
                    data-testid="email-reply-textarea"
                    rows={4}
                    value={activeEmail.draftReply.text}
                    onChange={(e) => updateDraftReply(activeEmail.id, e.target.value)}
                    disabled={activeEmail.draftReply.status === 'sending' || activeEmail.draftReply.status === 'delivered'}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />

                  {activeEmail.draftReply.status === 'sending' ? (
                    <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-amber-300">
                        <Clock className="w-4 h-4 animate-spin text-amber-400" />
                        <span>
                          Sending in <strong>{undoTimers[activeEmail.id] ?? 5}s</strong> (Delay protection active)...
                        </span>
                      </div>
                      <button
                        data-testid="undo-email-btn"
                        onClick={() => undoEmailReply(activeEmail.id)}
                        className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-500/40 px-3 py-1.5 rounded-lg font-semibold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Undo Send
                      </button>
                    </div>
                  ) : activeEmail.draftReply.status === 'delivered' ? (
                    <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-3 text-xs text-emerald-200 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Delivered successfully at {activeEmail.draftReply.sentAt}
                      </span>
                    </div>
                  ) : activeEmail.draftReply.status === 'failed' ? (
                    <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-3 text-xs text-red-200 flex items-center justify-between">
                      <span>Delivery failed: {activeEmail.draftReply.error || 'Gateway timeout'}</span>
                      <button
                        onClick={() => retryEmailDelivery(activeEmail.id)}
                        className="bg-red-800 text-white px-3 py-1 rounded flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Retry
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                      <button
                        data-testid="approve-email-send-btn"
                        onClick={() => sendEmailReply(activeEmail.id)}
                        disabled={isKillSwitchActive}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow"
                      >
                        <Send className="w-4 h-4" /> Approve & Send with Undo Delay
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-500">
              Select an email from the inbox list to inspect intelligence details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
