import React from 'react';
import { useSystem } from '../context/SystemContext';
import { ApprovalCard } from './ApprovalCard';
import { X, Bell, CheckCheck } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { approvalActions, markApprovalRead } = useSystem();

  if (!isOpen) return null;

  const pendingApprovals = approvalActions.filter((a) => a.status === 'pending' || a.status === 'approving');
  const groupedByChannel = {
    push: pendingApprovals.filter((a) => a.channel === 'push'),
    call: pendingApprovals.filter((a) => a.channel === 'call'),
    sms: pendingApprovals.filter((a) => a.channel === 'sms'),
    inApp: pendingApprovals.filter((a) => a.channel === 'in-app'),
  };

  const markAllRead = () => {
    pendingApprovals.forEach((a) => markApprovalRead(a.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 border-l border-slate-700 w-full max-w-md h-full flex flex-col p-6 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-lg">Notification Center</h3>
            <span className="text-xs bg-cyan-900/60 text-cyan-300 font-semibold px-2 py-0.5 rounded-full">
              {pendingApprovals.length} pending
            </span>
          </div>
          <div className="flex items-center gap-2">
            {pendingApprovals.length > 0 && (
              <button
                onClick={markAllRead}
                title="Mark all as read"
                className="text-xs text-slate-400 hover:text-slate-200 p-1 flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs mt-1 text-slate-600">No pending approvals or unread alerts.</p>
            </div>
          ) : (
            <>
              {groupedByChannel.push.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                    📱 Push Channel ({groupedByChannel.push.length})
                  </h4>
                  {groupedByChannel.push.map((action) => (
                    <ApprovalCard key={action.id} action={action} />
                  ))}
                </div>
              )}

              {groupedByChannel.call.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                    📞 Voice Call Channel ({groupedByChannel.call.length})
                  </h4>
                  {groupedByChannel.call.map((action) => (
                    <ApprovalCard key={action.id} action={action} />
                  ))}
                </div>
              )}

              {groupedByChannel.sms.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    💬 SMS Channel ({groupedByChannel.sms.length})
                  </h4>
                  {groupedByChannel.sms.map((action) => (
                    <ApprovalCard key={action.id} action={action} />
                  ))}
                </div>
              )}

              {groupedByChannel.inApp.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                    💻 In-App Queue ({groupedByChannel.inApp.length})
                  </h4>
                  {groupedByChannel.inApp.map((action) => (
                    <ApprovalCard key={action.id} action={action} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
