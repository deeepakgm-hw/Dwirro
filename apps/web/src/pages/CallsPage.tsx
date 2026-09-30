import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  Volume2,
  ShieldCheck,
  MessageSquare,
  Radio,
  Check,
} from 'lucide-react';

export const CallsPage: React.FC = () => {
  const { callLogs, notificationMessages, toggleRecordingConsent } = useSystem();

  const [liveStreamStatus, setLiveStreamStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'reconnecting'
  >('disconnected');
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);

  const handleToggleLiveStream = () => {
    if (liveStreamStatus === 'disconnected') {
      setLiveStreamStatus('connecting');
      setTimeout(() => setLiveStreamStatus('connected'), 1200);
    } else if (liveStreamStatus === 'connected') {
      setLiveStreamStatus('disconnected');
    }
  };

  const handleSimulateDrop = () => {
    setLiveStreamStatus('reconnecting');
    setTimeout(() => setLiveStreamStatus('connected'), 1500);
  };

  const handleCopyDraft = (id: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedDraftId(id);
    setTimeout(() => setCopiedDraftId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-950 border border-indigo-500/40 rounded-2xl text-indigo-400">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Calls & Messaging Intelligence</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              AI call screening, recording consent disclosures, and draft-only message replies.
            </p>
          </div>
        </div>

        {/* Live Call Simulator Toggle */}
        <div className="flex items-center gap-2">
          {liveStreamStatus === 'connected' && (
            <button
              onClick={handleSimulateDrop}
              className="bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs px-3 py-2 rounded-xl font-medium"
            >
              Simulate Network Glitch
            </button>
          )}
          <button
            data-testid="live-voice-toggle-btn"
            onClick={handleToggleLiveStream}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all ${
              liveStreamStatus === 'connected'
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white'
            }`}
          >
            {liveStreamStatus === 'connected' ? (
              <>
                <PhoneOff className="w-4 h-4" /> End Live Stream
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" /> Start Live Voice Stream
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Stream Panel (Active State) */}
      {liveStreamStatus !== 'disconnected' && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    liveStreamStatus === 'connected'
                      ? 'bg-emerald-400'
                      : liveStreamStatus === 'reconnecting'
                      ? 'bg-amber-400'
                      : 'bg-cyan-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    liveStreamStatus === 'connected'
                      ? 'bg-emerald-500'
                      : liveStreamStatus === 'reconnecting'
                      ? 'bg-amber-500'
                      : 'bg-cyan-500'
                  }`}
                />
              </span>
              <h3 className="font-bold text-slate-100 text-sm capitalize">
                Live Voice Stream: <span className="font-mono text-cyan-400">{liveStreamStatus}</span>
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Codec: Opus 48kHz • End-to-End Encrypted</span>
          </div>

          <div className="bg-slate-950 rounded-2xl p-4 text-xs text-slate-300 font-mono space-y-1.5 border border-slate-800">
            <p className="text-cyan-400">[00:01] Dwirro Voice Engine Initialized</p>
            <p className="text-emerald-400">
              [00:02] Audio Stream Connected with Assistant Identity Disclosure
            </p>
            {liveStreamStatus === 'reconnecting' && (
              <p className="text-amber-400 animate-pulse">[00:04] Reconnecting audio websocket packet stream...</p>
            )}
            {liveStreamStatus === 'connected' && (
              <p className="text-slate-400">[00:05] Audio packets streaming smoothly (Latency 42ms)</p>
            )}
          </div>
        </div>
      )}

      {/* Grid: Call Logs & Message Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Call Screening Logs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <PhoneIncoming className="w-4 h-4 text-cyan-400" /> AI Screened Calls
            </h3>
            <span className="text-xs text-slate-400">{callLogs.length} calls</span>
          </div>

          <div className="space-y-3">
            {callLogs.map((call) => (
              <div
                key={call.id}
                data-testid="call-log-card"
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">
                      {call.callerName || call.callerNumber}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">{call.callerNumber}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(call.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Assistant Announced Itself Indicator */}
                {call.assistantAnnouncedItself && (
                  <div
                    data-testid="assistant-announced-indicator"
                    className="inline-flex items-center gap-1.5 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Assistant announced itself as AI</span>
                  </div>
                )}

                {/* AI Summary */}
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 block mb-0.5">AI Triage Summary:</span>
                  <p>{call.aiSummary}</p>
                </div>

                {/* Recording Consent & Audio Player */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRecordingConsent(call.id)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                        call.recordingConsentGranted
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Consent: {call.recordingConsentGranted ? 'Granted' : 'Missing'}
                    </button>
                  </div>

                  {call.recordingConsentGranted ? (
                    <div
                      data-testid="recording-player"
                      className="flex items-center gap-1.5 text-cyan-400 font-medium cursor-pointer hover:text-cyan-300"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Play Recording (0:34)</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic text-[11px]">
                      Recording hidden (No recording consent)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Messaging Hub (Draft Only) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Notifications & Draft-Only Replies
            </h3>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Draft-Only Mode
            </span>
          </div>

          <div className="space-y-3">
            {notificationMessages.map((msg) => (
              <div
                key={msg.id}
                data-testid="notification-message-card"
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{msg.sender}</span>
                  <span className="text-[10px] uppercase font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    {msg.app}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{msg.summary}</p>

                {msg.draftOnlyReply && (
                  <div className="bg-slate-950 rounded-xl p-3 border border-emerald-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                        Suggested Draft (You Send Personally)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">No auto-dispatch</span>
                    </div>
                    <p className="text-slate-200 italic">"{msg.draftOnlyReply}"</p>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleCopyDraft(msg.id, msg.draftOnlyReply)}
                        className="flex items-center gap-1 text-[11px] bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg font-semibold transition-colors"
                      >
                        {copiedDraftId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied to Clipboard
                          </>
                        ) : (
                          'Copy Draft to Send'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
