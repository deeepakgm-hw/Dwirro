import React from 'react';
import { AlertOctagon, X } from 'lucide-react';

interface KillSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isCurrentlyActive: boolean;
}

export const KillSwitchModal: React.FC<KillSwitchModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isCurrentlyActive,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="bg-slate-900 border border-red-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-950/80 border border-red-500/50 rounded-xl">
              <AlertOctagon className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {isCurrentlyActive ? 'Resume Assistant Operations' : 'Activate Emergency Kill Switch'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {isCurrentlyActive
            ? 'Resuming operations will re-enable autonomous actions, approval buttons, and scheduled automated tasks across all modules.'
            : 'Activating the Kill Switch will immediately FREEZE all assistant actions app-wide, disable every Approve button, and prevent background tool executions.'}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-xl font-medium"
          >
            Cancel
          </button>
          <button
            data-testid="confirm-kill-switch-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2 text-sm font-semibold rounded-xl text-white shadow transition-colors ${
              isCurrentlyActive
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            {isCurrentlyActive ? 'Confirm Resume' : 'Confirm Freeze All Actions'}
          </button>
        </div>
      </div>
    </div>
  );
};
