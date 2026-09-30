import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import {
  Receipt,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Plus,
  Bell,
  ArrowRight,
} from 'lucide-react';

export const BillsPage: React.FC = () => {
  const { bills, addBill, updateBillDueDate } = useSystem();

  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [source, setSource] = useState<'mail' | 'sms' | 'manual'>('manual');
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError('Please enter a valid amount.');
      return;
    }
    const result = addBill(payee, numAmount, dueDate, source);
    if (!result.success) {
      setFormError(result.error || 'Failed to add bill.');
    } else {
      setPayee('');
      setAmount('');
      setDueDate('');
    }
  };

  // Sort bills by due date ascending
  const sortedBills = [...bills].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header & Policy Notice */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-950 border border-cyan-500/40 rounded-2xl text-cyan-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Bills & Deadline Escalations</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated reminders, duplicate detection, and escalation cadence.
            </p>
          </div>
        </div>

        {/* Strict Zero-Automated-Payment Policy Badge */}
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl px-4 py-2 text-xs text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Policy: Payments are strictly manual. Dwirro will never auto-debit funds.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bills List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-base">Tracked Invoices & Recharges</h3>
            <span className="text-xs text-slate-400">{bills.length} Total</span>
          </div>

          <div className="space-y-3">
            {sortedBills.map((bill) => {
              const isOverdue = bill.status === 'overdue';
              const isDueToday = bill.status === 'due_today';

              return (
                <div
                  key={bill.id}
                  data-testid="bill-item-card"
                  className={`bg-slate-900/90 border rounded-2xl p-5 shadow transition-all ${
                    bill.hasConflict
                      ? 'border-red-500/60 bg-red-950/20'
                      : isOverdue
                      ? 'border-red-500/40 bg-red-950/10'
                      : isDueToday
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-100 text-base">{bill.payee}</h4>
                        {bill.hasConflict && (
                          <span
                            data-testid="bill-conflict-badge"
                            className="text-[10px] font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3 h-3" /> CONFLICT: DUPLICATE
                          </span>
                        )}
                        {isOverdue && (
                          <span className="text-[10px] font-bold uppercase bg-red-950 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full">
                            OVERDUE
                          </span>
                        )}
                        {isDueToday && (
                          <span className="text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                            DUE TODAY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        Account: <span className="text-slate-300">{bill.maskedAccount}</span> • Source: {bill.source}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-slate-100 block">
                        ${bill.amount.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Due: {bill.dueDate}</span>
                    </div>
                  </div>

                  {/* Reminder Cadence & Escalation Chain */}
                  <div className="bg-slate-950/80 rounded-xl p-3 my-3 text-xs grid grid-cols-2 gap-2 border border-slate-800/80">
                    <div>
                      <span className="text-slate-400 block mb-1 font-medium">Cadence Schedule:</span>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                        <span className={bill.reminderSchedule.threeDay ? 'opacity-100' : 'opacity-40 line-through'}>
                          [3d]
                        </span>
                        <span>→</span>
                        <span className={bill.reminderSchedule.oneDay ? 'opacity-100' : 'opacity-40 line-through'}>
                          [1d]
                        </span>
                        <span>→</span>
                        <span className={bill.reminderSchedule.dayOf ? 'opacity-100' : 'opacity-40 line-through'}>
                          [Day-Of]
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1 font-medium">Active Escalation Tier:</span>
                      <span className="uppercase font-bold text-amber-400 font-mono text-[11px]">
                        Tier: {bill.escalationStep}
                      </span>
                    </div>
                  </div>

                  {/* External Pay Yourself Link */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-500 text-[11px]">Autonomous payments disabled</span>
                    <a
                      href="https://example.com/payment-portal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                    >
                      <span>Pay Yourself (Portal Link)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Add Bill Form & Escalation Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-slate-100 text-base mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" /> Add Tracked Bill / Recharge
            </h3>

            {formError && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 rounded-xl p-2.5 mb-4">
                {formError}
              </p>
            )}

            <form onSubmit={handleAddBill} className="space-y-4">
              <div>
                <label htmlFor="payeeInput" className="block text-xs font-semibold text-slate-300 mb-1">Payee / Vendor Name</label>
                <input
                  id="payeeInput"
                  data-testid="bill-payee-input"
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud Services"
                  value={payee}
                  onChange={(e) => setPayee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="amountInput" className="block text-xs font-semibold text-slate-300 mb-1">Amount ($ USD)</label>
                  <input
                    id="amountInput"
                    data-testid="bill-amount-input"
                    type="number"
                    step="0.01"
                    required
                    placeholder="240.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="dueDateInput" className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    id="dueDateInput"
                    data-testid="bill-due-date-input"
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sourceInput" className="block text-xs font-semibold text-slate-300 mb-1">Source</label>
                <select
                  id="sourceInput"
                  data-testid="bill-source-select"
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="manual">Manual Entry</option>
                  <option value="mail">Extracted from Email</option>
                  <option value="sms">Extracted from SMS</option>
                </select>
              </div>

              <button
                data-testid="submit-bill-btn"
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs shadow transition-all"
              >
                Track Bill & Schedule Escalations
              </button>
            </form>
          </div>

          {/* Escalation Protocol Explanation */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 text-xs space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <Bell className="w-4 h-4 text-amber-400" /> Multi-Tier Escalation Protocol
            </h4>
            <p className="text-slate-400 leading-relaxed">
              If an invoice remains unpaid past the 3-day reminder, the system escalates communication across three discrete tiers:
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                  1
                </span>
                <span><strong>Push Notification:</strong> Gentle morning alert (3 days before due).</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-500/50 flex items-center justify-center text-[10px] font-bold text-amber-400">
                  2
                </span>
                <span><strong>SMS Dispatch:</strong> High-priority text (1 day before due).</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-500/50 flex items-center justify-center text-[10px] font-bold text-red-400">
                  3
                </span>
                <span><strong>Voice Call Screening:</strong> Automated voice briefing on due date.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
