import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import {
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldAlert,
  Sliders,
  Filter,
  Eye,
  Power,
} from 'lucide-react';

export const MonitorPage: React.FC = () => {
  const { aiToolExecutions, activeToolsState, toggleToolState } = useSystem();

  const [providerFilter, setProviderFilter] = useState<'all' | 'Claude' | 'GPT' | 'Antigravity'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'running' | 'failed' | 'blocked'>('all');

  const filteredExecutions = aiToolExecutions.filter((item) => {
    if (providerFilter !== 'all' && item.provider !== providerFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const registeredTools = [
    { provider: 'Claude', name: 'Email Tone Synthesizer', desc: 'Drafts responses matching user communication style' },
    { provider: 'GPT', name: 'Schedule Overlap Resolver', desc: 'Analyzes timeline conflicts and suggests shifts' },
    { provider: 'Antigravity', name: 'Codebase Conflict Auditor', desc: 'Scans monorepo packages for route and type collisions' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-950 border border-cyan-500/40 rounded-2xl text-cyan-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">AI Tool Execution Monitor</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Read-only multi-agent activity stream for Claude, GPT, and Antigravity.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700/80 px-3.5 py-1.5 rounded-xl text-xs text-slate-300 flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>Strictly Read-Only Monitor</span>
        </div>
      </div>

      {/* Tool Governance Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="font-bold text-slate-100 text-sm mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" /> Connected AI Tool Governance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {registeredTools.map((tool) => {
            const key = `${tool.provider}:${tool.name}`;
            const isEnabled = activeToolsState[key] !== false;

            return (
              <div
                key={key}
                data-testid="tool-governance-card"
                className={`border rounded-2xl p-4 transition-all ${
                  isEnabled
                    ? 'bg-slate-950/70 border-slate-700/80'
                    : 'bg-slate-950/30 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase bg-slate-800 text-cyan-300 px-2 py-0.5 rounded">
                      {tool.provider}
                    </span>
                    <h4 className="font-bold text-slate-100 text-xs mt-1.5">{tool.name}</h4>
                  </div>

                  <button
                    data-testid={`toggle-tool-${tool.provider}`}
                    onClick={() => toggleToolState(tool.provider, tool.name)}
                    className={`p-1.5 rounded-xl border transition-colors ${
                      isEnabled
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                    title={isEnabled ? 'Disable Tool' : 'Enable Tool'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">{tool.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Feed Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Stream:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Provider Filter */}
          <select
            data-testid="filter-provider"
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Models</option>
            <option value="Claude">Claude 3.7</option>
            <option value="GPT">GPT-4o</option>
            <option value="Antigravity">Antigravity</option>
          </select>

          {/* Status Filter */}
          <select
            data-testid="filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="blocked">Blocked</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Execution Stream Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Provider</th>
                <th className="py-3.5 px-4">Tool</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Summary</th>
                <th className="py-3.5 px-4">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {filteredExecutions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No tool executions found matching active filters.
                  </td>
                </tr>
              ) : (
                filteredExecutions.map((exec) => (
                  <tr key={exec.id} data-testid="monitor-row" className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {new Date(exec.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100">{exec.provider}</td>
                    <td className="py-3 px-4 font-mono text-cyan-300">{exec.toolName}</td>
                    <td className="py-3 px-4">
                      {exec.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> completed
                        </span>
                      )}
                      {exec.status === 'running' && (
                        <span className="inline-flex items-center gap-1 bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                          <Clock className="w-3 h-3 animate-spin" /> running
                        </span>
                      )}
                      {exec.status === 'blocked' && (
                        <span className="inline-flex items-center gap-1 bg-red-950 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                          <ShieldAlert className="w-3 h-3" /> blocked
                        </span>
                      )}
                      {exec.status === 'failed' && (
                        <span className="inline-flex items-center gap-1 bg-red-950 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                          <XCircle className="w-3 h-3" /> failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{exec.resultSummary}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{exec.durationMs}ms</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
