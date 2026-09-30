import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { ActionLevel, ActionDefinition } from '@aip/shared-types';
import { maskSensitiveData } from '@aip/security';
import {
  Settings,
  Shield,
  Eye,
  Trash2,
  DollarSign,
  Activity,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    policyEngine,
    settings,
    updateSettings,
    deleteEverything,
    addAuditLog,
  } = useSystem();

  const [actionsList, setActionsList] = useState<ActionDefinition[]>(() =>
    policyEngine.getAllActions()
  );
  const [retentionDays, setRetentionDays] = useState<number>(settings.dataRetentionDays);
  const [costCap, setCostCap] = useState<number>(settings.monthlyCostCapUsd);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Redaction Live Studio State
  const [sampleUnredactedText, setSampleUnredactedText] = useState('');

  const handleLevelChange = (actionId: string, newLevel: ActionLevel) => {
    const result = policyEngine.updateActionLevel(actionId, newLevel);
    if (result.success) {
      setActionsList(policyEngine.getAllActions());
      addAuditLog(
        `Action Policy Level Updated: ${actionId}`,
        'L3',
        'user',
        'allowed',
        `New tier assigned: ${newLevel}`
      );
    }
  };

  const handleToggleIntegration = (key: 'gmail' | 'googleCalendar' | 'telephony') => {
    const isCurrentlyConnected = settings.integrations[key].connected;
    updateSettings({
      integrations: {
        ...settings.integrations,
        [key]: {
          connected: !isCurrentlyConnected,
          lastSync: !isCurrentlyConnected ? new Date().toISOString() : undefined,
        },
      },
    });
    addAuditLog(
      !isCurrentlyConnected ? `Integration Connected: ${key}` : `Integration Revoked: ${key}`,
      'L2',
      'user',
      'allowed',
      `Service: ${key}`
    );
  };

  const handleDeleteEverything = (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);
    const success = deleteEverything(deleteConfirmText);
    if (success) {
      setDeleteSuccess(true);
      setDeleteConfirmText('');
    } else {
      setDeleteError('Confirmation phrase does not match. Action aborted.');
    }
  };

  const isOverCostBudget = settings.currentMonthSpendUsd > costCap;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-950 border border-cyan-500/40 rounded-2xl text-cyan-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Settings, Policy & Privacy Controls</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Granular L0-L4 permission governance, pre-flight data redaction, and cost limits.
            </p>
          </div>
        </div>

        {isOverCostBudget && (
          <div
            data-testid="cost-warning-badge"
            className="bg-red-950 border border-red-500 text-red-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Warning: Monthly Spend (${settings.currentMonthSpendUsd}) exceeds Cap (${costCap})!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Action Permissions Matrix (L0-L4) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" /> Policy & Action Governance Matrix
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">L4 is permanently locked</span>
          </div>

          <div className="space-y-3">
            {actionsList.map((action) => {
              const isLockedL4 = action.defaultLevel === 'L4';

              return (
                <div
                  key={action.id}
                  data-testid="policy-action-row"
                  className={`bg-slate-900/90 border rounded-2xl p-4 shadow transition-all ${
                    isLockedL4 ? 'border-red-500/40 bg-red-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{action.title}</h4>
                      <p className="text-xs text-slate-400">{action.description}</p>
                    </div>

                    {isLockedL4 ? (
                      <span
                        data-testid="l4-locked-badge"
                        className="flex items-center gap-1 text-[10px] font-bold uppercase bg-red-950 text-red-300 border border-red-500/50 px-2 py-0.5 rounded-full font-mono"
                      >
                        <Lock className="w-3 h-3" /> L4 (Locked)
                      </span>
                    ) : (
                      <select
                        data-testid={`select-level-${action.id}`}
                        value={action.currentLevel}
                        onChange={(e) => handleLevelChange(action.id, e.target.value as ActionLevel)}
                        className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs font-mono font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="L0">L0 (Auto)</option>
                        <option value="L1">L1 (Notify)</option>
                        <option value="L2">L2 (Review)</option>
                        <option value="L3">L3 (High Risk)</option>
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pre-Flight Redaction & Integrations */}
        <div className="space-y-6">
          {/* Pre-Flight Redaction Studio */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" /> Pre-Flight Redaction Preview
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All credit card numbers, passwords, and verification OTPs are masked locally on your device before text is ever dispatched to AI language models.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Raw User Input (Simulated):</label>
              <textarea
                rows={2}
                data-testid="redaction-input"
                placeholder="Type sample text with account numbers or codes to preview instant local masking..."
                value={sampleUnredactedText}
                onChange={(e) => setSampleUnredactedText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">
                Masked Payload Sent to AI Model:
              </label>
              <div
                data-testid="redacted-preview-output"
                className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-300 font-mono whitespace-pre-wrap"
              >
                {maskSensitiveData(sampleUnredactedText)}
              </div>
            </div>
          </div>

          {/* Integrations Hub */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-100 text-base">Connected Integrations & OAuth</h3>

            <div className="space-y-3">
              {(['gmail', 'googleCalendar', 'telephony'] as const).map((service) => {
                const info = settings.integrations[service];
                return (
                  <div
                    key={service}
                    className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-200 text-xs capitalize block">
                        {service === 'googleCalendar' ? 'Google Calendar' : service}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {info.connected ? `Connected • Sync: ${info.lastSync ? new Date(info.lastSync).toLocaleTimeString() : 'Active'}` : 'Revoked / Inactive'}
                      </span>
                    </div>

                    <button
                      data-testid={`toggle-integration-${service}`}
                      onClick={() => handleToggleIntegration(service)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-colors ${
                        info.connected
                          ? 'bg-red-950 text-red-300 border-red-500/40 hover:bg-red-900'
                          : 'bg-cyan-600 text-white hover:bg-cyan-500'
                      }`}
                    >
                      {info.connected ? 'Revoke Access' : 'Connect Service'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cost Caps, Data Retention, & Permanent Deletion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cost Budget */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow space-y-3">
          <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Monthly API Spend Cap
          </h4>
          <p className="text-xs text-slate-400">Current Spend: <strong className="text-slate-100">${settings.currentMonthSpendUsd.toFixed(2)}</strong></p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={costCap}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setCostCap(val);
                updateSettings({ monthlyCostCapUsd: val });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-xs text-slate-400 font-mono">USD</span>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow space-y-3">
          <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-400" /> Retention Schedule
          </h4>
          <p className="text-xs text-slate-400">Purge audit logs older than:</p>
          <select
            data-testid="retention-select"
            value={retentionDays}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setRetentionDays(val);
              updateSettings({ dataRetentionDays: val });
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
            <option value={365}>1 Year</option>
          </select>
        </div>

        {/* Delete Everything */}
        <div className="bg-red-950/20 border border-red-500/40 rounded-3xl p-6 shadow space-y-3">
          <h4 className="font-bold text-red-300 text-sm flex items-center gap-1.5">
            <Trash2 className="w-4 h-4 text-red-400" /> Delete Everything
          </h4>
          <p className="text-[11px] text-slate-400">
            Type <strong className="text-red-300 font-mono">DELETE EVERYTHING PERMANENTLY</strong> to wipe all data:
          </p>
          {deleteSuccess ? (
            <p className="text-xs text-emerald-400 font-semibold">Data successfully wiped.</p>
          ) : (
            <form onSubmit={handleDeleteEverything} className="space-y-2">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE EVERYTHING PERMANENTLY"
                className="w-full bg-slate-950 border border-red-500/40 rounded-xl px-3 py-1.5 text-[11px] text-red-200 focus:outline-none focus:border-red-500"
              />
              {deleteError && <p className="text-[10px] text-red-400">{deleteError}</p>}
              <button
                type="submit"
                disabled={deleteConfirmText !== 'DELETE EVERYTHING PERMANENTLY'}
                className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold py-1.5 rounded-xl text-xs transition-colors"
              >
                Permanently Wipe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
