import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { exportToSafeCsv } from '@aip/security';
import {
  FileText,
  Volume2,
  VolumeX,
  Download,
  Search,
  Filter,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Mail,
  PhoneCall,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    auditLogs,
    approvalActions,
    emails,
    callLogs,
    reminders,
    dailyPlan,
  } = useSystem();

  const [isPlayingReport, setIsPlayingReport] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [resultFilter, setResultFilter] = useState<string>('all');

  // Compute 8 Report Sections metrics
  const completedActions = auditLogs.filter((a) => a.result === 'executed' || a.result === 'approved');
  const pendingApprovals = approvalActions.filter((a) => a.status === 'pending' || a.status === 'approving');
  const sentEmails = emails.filter((e) => e.draftReply?.status === 'delivered' || e.draftReply?.status === 'sent');
  const handledCalls = callLogs.filter((c) => c.status === 'screened' || c.status === 'missed');
  const firedReminders = reminders;
  const blockedActions = auditLogs.filter((a) => a.result === 'blocked' || a.result === 'failed' || a.result === 'rejected');
  const suspiciousItems = emails.filter((e) => e.label === 'Suspicious');
  const tomorrowPlanItems = dailyPlan;

  const handleToggleReportAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingReport) {
      window.speechSynthesis.cancel();
      setIsPlayingReport(false);
      return;
    }

    const reportScript = `Nightly Platform Executive Report. ${completedActions.length} completed actions recorded. ${pendingApprovals.length} items awaiting your review. ${sentEmails.length} outbound communications delivered. ${blockedActions.length} security events handled. Tomorrow's draft plan contains ${tomorrowPlanItems.length} schedule milestones.`;

    const utterance = new SpeechSynthesisUtterance(reportScript);
    utterance.onend = () => setIsPlayingReport(false);
    utterance.onerror = () => setIsPlayingReport(false);
    setIsPlayingReport(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleExportCsv = () => {
    const headers = [
      { key: 'timestamp' as const, label: 'Timestamp' },
      { key: 'action' as const, label: 'Action Title' },
      { key: 'level' as const, label: 'Policy Level' },
      { key: 'actor' as const, label: 'Actor / System' },
      { key: 'result' as const, label: 'Result Status' },
      { key: 'details' as const, label: 'Details' },
    ];

    const csvContent = exportToSafeCsv(auditLogs as any, headers);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dwirro_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (levelFilter !== 'all' && log.level !== levelFilter) return false;
    if (resultFilter !== 'all' && log.result !== resultFilter) return false;
    if (
      searchQuery &&
      !log.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(log.details || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header & Nightly Report Audio Trigger */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-950 border border-cyan-500/40 rounded-2xl text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Executive Report & Audit Trail</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive 8-section daily synthesis and immutable append-only audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            data-testid="play-report-btn"
            onClick={handleToggleReportAudio}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition-colors"
          >
            {isPlayingReport ? (
              <>
                <VolumeX className="w-4 h-4" /> Stop Voice Report
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" /> Play Nightly Report
              </>
            )}
          </button>

          <button
            data-testid="export-csv-btn"
            onClick={handleExportCsv}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl shadow transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" /> Export Safe CSV
          </button>
        </div>
      </div>

      {/* 8-Section Nightly Report Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-100 text-base">End-of-Day 8-Section Executive Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Section 1 */}
          <div data-testid="report-section-completed" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>1. COMPLETED ACTIONS</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-slate-100">{completedActions.length}</span>
            <p className="text-[11px] text-slate-400 mt-1">Autonomous & approved tasks finished</p>
          </div>

          {/* Section 2 */}
          <div data-testid="report-section-pending" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>2. PENDING APPROVALS</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-black text-slate-100">{pendingApprovals.length}</span>
            <p className="text-[11px] text-slate-400 mt-1">Queued actions awaiting human review</p>
          </div>

          {/* Section 3 */}
          <div data-testid="report-section-mails" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>3. MAILS SENT</span>
              <Mail className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-2xl font-black text-slate-100">{sentEmails.length}</span>
            <p className="text-[11px] text-slate-400 mt-1">Dispatched replies with verified delivery</p>
          </div>

          {/* Section 4 */}
          <div data-testid="report-section-calls" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>4. CALLS HANDLED</span>
              <PhoneCall className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-2xl font-black text-slate-100">{handledCalls.length}</span>
            <p className="text-[11px] text-slate-400 mt-1">Inbound calls screened and summarized</p>
          </div>

          {/* Section 5 */}
          <div data-testid="report-section-reminders" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>5. REMINDERS FIRED</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-slate-100">{firedReminders.length}</span>
            <p className="text-[11px] text-slate-400 mt-1">Schedule & medication prompts triggered</p>
          </div>

          {/* Section 6 */}
          <div data-testid="report-section-blocked" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>6. BLOCKED / ERRORS</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-2xl font-black text-red-400">{blockedActions.length}</span>
            <p className="text-[11px] text-slate-400 mt-1">Policy blocks & rejected actions</p>
          </div>

          {/* Section 7 */}
          <div data-testid="report-section-suspicious" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>7. SUSPICIOUS ITEMS</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-2xl font-black text-red-400">{suspiciousItems.length}</span>
            <p className="text-[11px] text-slate-400 mt-1">Neutralized phishing or spoofed emails</p>
          </div>

          {/* Section 8 */}
          <div data-testid="report-section-plan" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>8. TOMORROW PLAN</span>
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-2xl font-black text-slate-100">{tomorrowPlanItems.length}</span>
            <p className="text-[11px] text-slate-400 mt-1">Accepted & proposed daily milestones</p>
          </div>
        </div>
      </div>

      {/* Append-Only Audit Trail Table */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-100 text-base">Append-Only Immutable Audit Trail</h3>
            <p className="text-xs text-slate-400">Read-only event ledger. Modification and deletion disabled by system policy.</p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Levels</option>
              <option value="L0">L0 (Auto)</option>
              <option value="L1">L1 (Notify)</option>
              <option value="L2">L2 (Review)</option>
              <option value="L3">L3 (High Risk)</option>
              <option value="L4">L4 (Manual)</option>
            </select>

            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Results</option>
              <option value="allowed">Allowed</option>
              <option value="executed">Executed</option>
              <option value="approved">Approved</option>
              <option value="blocked">Blocked</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      No audit events matched your search filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const isBlocked = log.result === 'blocked' || log.result === 'rejected' || log.result === 'failed';
                    return (
                      <tr
                        key={log.id}
                        data-testid="audit-row"
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isBlocked ? 'bg-red-950/10' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-100">{log.action}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                            {log.level}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 capitalize">{log.actor}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase ${
                              isBlocked
                                ? 'bg-red-950 text-red-300 border border-red-500/40'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {log.result}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{log.details || '—'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
