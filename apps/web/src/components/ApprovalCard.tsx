import React, { useState, useEffect } from 'react';
import { ApprovalAction } from '@aip/shared-types';
import { ACTION_LEVEL_DESCRIPTIONS } from '@aip/policy-engine';
import { useSystem } from '../context/SystemContext';
import { CheckCircle2, Clock, XCircle, RotateCcw, ShieldAlert, Check } from 'lucide-react';

interface ApprovalCardProps {
  action: ApprovalAction;
  onClose?: () => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ action, onClose }) => {
  const { isKillSwitchActive, approveAction, undoApproval, finalizeApproval, rejectAction } = useSystem();
  const [countdown, setCountdown] = useState<number>(action.undoCountdownSeconds || 5);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(action.description);

  const levelInfo = ACTION_LEVEL_DESCRIPTIONS[action.level] || ACTION_LEVEL_DESCRIPTIONS.L2;
  const isL4 = action.level === 'L4';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (action.status === 'approving') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            finalizeApproval(action.id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [action.status, action.id, finalizeApproval]);

  if (action.status === 'executed') {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 my-2 text-emerald-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-semibold text-sm">{action.title}</span>
            <p className="text-xs text-emerald-300/80">Action confirmed and executed successfully.</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 px-2.5 py-1 rounded"
          >
            Dismiss
          </button>
        )}
      </div>
    );
  }

  if (action.status === 'rejected') {
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 my-2 text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-slate-400 shrink-0" />
          <span className="text-sm font-medium">{action.title} - Rejected & Dismissed</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="approval-card"
      className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg my-3 transition-all"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <span
            data-testid={`level-badge-${action.level}`}
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${levelInfo.badgeColor}`}
          >
            {action.level}
          </span>
          <h4 className="font-semibold text-slate-100 text-base">{action.title}</h4>
        </div>
        <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
          Via {action.channel}
        </span>
      </div>

      {isEditing ? (
        <div className="mb-4">
          <textarea
            aria-label="Edit Action Description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            rows={2}
          />
          <button
            onClick={() => setIsEditing(false)}
            className="mt-1 text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-2.5 py-1 rounded"
          >
            Save Edit
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-300 mb-3">{editedDescription}</p>
      )}

      <div className="bg-slate-900/70 border border-slate-700/60 rounded-lg p-3 mb-4 text-xs text-slate-300">
        <span className="font-semibold text-slate-200 block mb-1">What will happen:</span>
        <p>{action.whatWillHappen}</p>
      </div>

      {isL4 ? (
        <div className="bg-red-950/40 border border-red-500/40 rounded-lg p-3 text-red-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold block">Level 4: Strictly Manual Action</span>
            <p className="mt-0.5">
              Automated assistant execution is permanently prohibited for this tier. Please perform this action directly in the respective official application.
            </p>
          </div>
        </div>
      ) : action.status === 'approving' ? (
        <div className="bg-amber-950/40 border border-amber-500/50 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300 text-xs">
            <Clock className="w-4 h-4 animate-spin text-amber-400" />
            <span>
              Executing in <strong>{countdown}s</strong>...
            </span>
          </div>
          <button
            data-testid="undo-button"
            onClick={() => undoApproval(action.id)}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-amber-500/50 text-amber-200 px-3 py-1.5 rounded-lg font-medium shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Undo
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-700/60">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            disabled={isKillSwitchActive}
            className="text-xs text-slate-400 hover:text-slate-200 underline font-medium disabled:opacity-50"
          >
            {isEditing ? 'Cancel' : 'Edit details'}
          </button>

          <div className="flex items-center gap-2">
            <button
              data-testid="reject-button"
              onClick={() => rejectAction(action.id)}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Reject
            </button>
            <button
              data-testid="approve-button"
              onClick={() => approveAction(action.id)}
              disabled={isKillSwitchActive}
              title={isKillSwitchActive ? 'Disabled while Kill Switch is active' : 'Approve Action'}
              className="flex items-center gap-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold px-4 py-1.5 rounded-lg shadow transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Approve
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
