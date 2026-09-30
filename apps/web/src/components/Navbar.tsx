import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSystem } from '../context/SystemContext';
import { KillSwitchModal } from './KillSwitchModal';
import { NotificationDrawer } from './NotificationDrawer';
import {
  ShieldAlert,
  Bell,
  Moon,
  Sun,
  Lock,
  LogOut,
  MessageSquare,
  Calendar,
  Mail,
  Receipt,
  PhoneCall,
  Activity,
  FileText,
  Settings,
  AlertTriangle,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { session, lockSession, logout } = useAuth();
  const {
    isKillSwitchActive,
    setKillSwitch,
    doNotDisturb,
    setDoNotDisturb,
    approvalActions,
  } = useSystem();

  const [isKillModalOpen, setIsKillModalOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  const pendingApprovalsCount = approvalActions.filter(
    (a) => a.status === 'pending' || a.status === 'approving'
  ).length;

  const navLinks = [
    { id: 'chat', label: 'Chat & Voice', icon: MessageSquare },
    { id: 'today', label: 'Today & Plan', icon: Calendar },
    { id: 'email', label: 'Email Intel', icon: Mail },
    { id: 'bills', label: 'Bills & Due', icon: Receipt },
    { id: 'calls', label: 'Calls & Comms', icon: PhoneCall },
    { id: 'monitor', label: 'AI Monitor', icon: Activity },
    { id: 'reports', label: 'Reports & Audit', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Global PAUSED Banner */}
      {isKillSwitchActive && (
        <div
          data-testid="paused-banner"
          className="bg-red-600 text-white px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-2 sticky top-0 z-40 shadow-md animate-pulse"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-300" />
          <span>EMERGENCY KILL SWITCH ACTIVE: ALL ASSISTANT ACTIONS ARE CURRENTLY PAUSED</span>
          <button
            onClick={() => setIsKillModalOpen(true)}
            className="ml-3 bg-red-800 hover:bg-red-900 text-white text-xs px-2.5 py-1 rounded border border-red-400"
          >
            Resume Actions
          </button>
        </div>
      )}

      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                D
              </div>
              <div>
                <span className="font-black tracking-tight text-lg text-slate-100 block">Dwirro</span>
                <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase block -mt-1">
                  AI Personal Platform
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    data-testid={`nav-tab-${tab.id}`}
                    onClick={() => onSelectTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Safety & Action Controls */}
            <div className="flex items-center gap-2">
              {/* Kill Switch Button */}
              <button
                data-testid="kill-switch-btn"
                onClick={() => setIsKillModalOpen(true)}
                title={isKillSwitchActive ? 'Resume Assistant' : 'Emergency Kill Switch'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow ${
                  isKillSwitchActive
                    ? 'bg-red-600 text-white animate-bounce'
                    : 'bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/40'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isKillSwitchActive ? 'PAUSED' : 'Kill Switch'}
                </span>
              </button>

              {/* DND Toggle */}
              <button
                data-testid="dnd-toggle-btn"
                onClick={() => setDoNotDisturb(!doNotDisturb)}
                title={doNotDisturb ? 'Do Not Disturb: ON' : 'Do Not Disturb: OFF'}
                className={`p-2 rounded-lg text-xs transition-colors border ${
                  doNotDisturb
                    ? 'bg-amber-950/70 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {doNotDisturb ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* Notification Center Bell */}
              <button
                data-testid="notification-bell-btn"
                onClick={() => setIsNotifDrawerOpen(true)}
                className="relative p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                title="Pending Approvals & Notifications"
              >
                <Bell className="w-4 h-4" />
                {pendingApprovalsCount > 0 && (
                  <span
                    data-testid="notif-badge"
                    className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow"
                  >
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>

              {/* Lock Session */}
              <button
                data-testid="lock-session-btn"
                onClick={lockSession}
                className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Lock Session Immediately"
              >
                <Lock className="w-4 h-4" />
              </button>

              {/* Logout */}
              <button
                data-testid="logout-btn"
                onClick={logout}
                className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                title={`Logout (${session.email})`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile navigation tab scrollbar */}
          <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/80 no-scrollbar">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-semibold ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Modals & Drawers */}
      <KillSwitchModal
        isOpen={isKillModalOpen}
        onClose={() => setIsKillModalOpen(false)}
        onConfirm={() => setKillSwitch(!isKillSwitchActive)}
        isCurrentlyActive={isKillSwitchActive}
      />

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />
    </>
  );
};
