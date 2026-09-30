import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { formatTimeLocal } from '@aip/shared-utils';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  Plus,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Edit2,
  Trash2,
  ArrowRight,
} from 'lucide-react';

export const TodayPage: React.FC = () => {
  const {
    scheduleEvents,
    tasks,
    reminders,
    dailyPlan,
    dailyBriefing,
    toggleTask,
    addTask,
    addReminder,
    updateDailyPlanItemStatus,
    approveEntireDailyPlan,
  } = useSystem();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [reminderError, setReminderError] = useState<string | null>(null);

  const [isPlayingBriefing, setIsPlayingBriefing] = useState(false);
  const [showEveningModal, setShowEveningModal] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle, new Date().toISOString().split('T')[0], newTaskPriority);
    setNewTaskTitle('');
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    setReminderError(null);
    if (!newReminderTitle.trim() || !newReminderTime) return;

    const result = addReminder(newReminderTitle, new Date(newReminderTime).toISOString());
    if (!result.success) {
      setReminderError(result.error || 'Failed to add reminder.');
    } else {
      setNewReminderTitle('');
      setNewReminderTime('');
    }
  };

  const handleToggleBriefingAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingBriefing) {
      window.speechSynthesis.cancel();
      setIsPlayingBriefing(false);
      return;
    }

    const briefingText = `${dailyBriefing.summary}. Priorities include: ${dailyBriefing.topPriorities.join(
      ', '
    )}. World updates: ${dailyBriefing.worldNews.join(' ')}`;

    const utterance = new SpeechSynthesisUtterance(briefingText);
    utterance.onend = () => setIsPlayingBriefing(false);
    utterance.onerror = () => setIsPlayingBriefing(false);
    setIsPlayingBriefing(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Morning Briefing Card */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-950 border border-indigo-500/50 rounded-2xl text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
                Executive Morning Briefing
              </span>
              <h2 className="text-xl font-extrabold text-slate-100">{dailyBriefing.date}</h2>
            </div>
          </div>

          <button
            data-testid="play-briefing-btn"
            onClick={handleToggleBriefingAudio}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-colors"
          >
            {isPlayingBriefing ? (
              <>
                <VolumeX className="w-4 h-4" /> Stop Audio Briefing
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" /> Play Audio Briefing
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-slate-300 mb-4 leading-relaxed">{dailyBriefing.summary}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              🎯 Top Priorities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {dailyBriefing.topPriorities.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              🌍 World & Industry Updates
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {dailyBriefing.worldNews.map((news: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{news}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Main Grid: Schedule Timeline & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1 & 2: Schedule Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-slate-100 text-lg">Today's Timeline</h3>
            </div>
            <button
              data-testid="open-evening-plan-btn"
              onClick={() => setShowEveningModal(true)}
              className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Tomorrow's Plan (~9 PM)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {scheduleEvents.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-500 text-sm">
                No events scheduled for today.
              </div>
            ) : (
              scheduleEvents.map((evt) => (
                <div
                  key={evt.id}
                  data-testid="schedule-event-card"
                  className={`bg-slate-900/90 border rounded-2xl p-4 shadow transition-all ${
                    evt.hasConflict
                      ? 'border-red-500/60 bg-red-950/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-800 rounded-xl text-slate-300 mt-0.5">
                        <Clock className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-100 text-sm">{evt.title}</h4>
                          {evt.hasConflict && (
                            <span
                              data-testid="conflict-badge"
                              className="text-[10px] font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1"
                            >
                              <AlertTriangle className="w-3 h-3" /> CONFLICT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatTimeLocal(evt.startTime)} – {formatTimeLocal(evt.endTime)}
                          {evt.location && ` • ${evt.location}`}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-md">
                      {evt.category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reminders Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Active Reminders
            </h4>

            {reminderError && (
              <p
                data-testid="reminder-error"
                className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 rounded-xl p-2.5 mb-3"
              >
                {reminderError}
              </p>
            )}

            <form onSubmit={handleCreateReminder} className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                data-testid="reminder-title-input"
                type="text"
                placeholder="Add reminder description..."
                value={newReminderTitle}
                onChange={(e) => setNewReminderTitle(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <input
                data-testid="reminder-time-input"
                type="datetime-local"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              />
              <button
                data-testid="set-reminder-btn"
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                Set Reminder
              </button>
            </form>

            <div className="space-y-2">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="flex items-center justify-between bg-slate-950/60 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs"
                >
                  <span className="text-slate-200 font-medium">{rem.title}</span>
                  <span className="text-amber-400/90 font-mono">
                    {new Date(rem.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Task Checklist */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-lg">Action Tasks</h3>
            <span className="text-xs text-slate-400">
              {tasks.filter((t) => t.completed).length}/{tasks.length} Done
            </span>
          </div>

          <form onSubmit={handleCreateTask} className="space-y-2">
            <input
              type="text"
              placeholder="Add new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex items-center gap-2">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
                className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 flex-1"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </form>

          <div className="space-y-2.5">
            {tasks.length === 0 ? (
              <div className="text-center py-8 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                No active tasks.
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`cursor-pointer bg-slate-900/90 border rounded-2xl p-3.5 shadow transition-all ${
                    task.completed
                      ? 'border-slate-800/60 opacity-60'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="mt-0.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-xs font-medium block truncate ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.proposedNextStep && (
                        <p className="text-[11px] text-cyan-400/80 mt-1">
                          ↳ Next step: {task.proposedNextStep}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Evening Plan Modal (~9 PM) */}
      {showEveningModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
                  Evening Synthesis (~9:00 PM)
                </span>
                <h3 className="text-lg font-extrabold text-slate-100">Tomorrow's Proposed Plan</h3>
              </div>
              <button
                onClick={() => setShowEveningModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1"
              >
                Close
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-96 overflow-y-auto">
              {dailyPlan.map((item) => (
                <div
                  key={item.id}
                  className={`bg-slate-950/70 border rounded-2xl p-3.5 flex items-center justify-between gap-3 ${
                    item.status === 'dropped'
                      ? 'border-red-950/50 opacity-40'
                      : item.status === 'accepted'
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">{item.title}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      Category: {item.category} • Status: {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateDailyPlanItemStatus(item.id, 'accepted')}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        item.status === 'accepted'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-emerald-300'
                      }`}
                      title="Accept Item"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateDailyPlanItemStatus(item.id, 'edited')}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        item.status === 'edited'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-cyan-300'
                      }`}
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateDailyPlanItemStatus(item.id, 'dropped')}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        item.status === 'dropped'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-red-300'
                      }`}
                      title="Drop Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {dailyPlan.filter((i) => i.status === 'accepted').length} accepted,{' '}
                {dailyPlan.filter((i) => i.status === 'dropped').length} dropped
              </span>
              <button
                data-testid="approve-plan-master-btn"
                onClick={() => {
                  approveEntireDailyPlan();
                  setShowEveningModal(false);
                }}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition-all"
              >
                Approve Plan & Lock In Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
