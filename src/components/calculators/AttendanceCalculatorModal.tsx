import { useState, useEffect } from 'react';
import { X, CalendarCheck, AlertTriangle, CheckCircle, Copy, Check, Plus, Minus } from 'lucide-react';
import { calculateAttendance } from '../../utils/calculators';
import {
  getRecentCalculations,
  saveRecentCalculation,
  clearRecentCalculations,
  RecentCalculation,
} from '../../utils/recentCalculations';
import { RecentCalculationsPanel } from './RecentCalculationsPanel';

interface AttendanceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AttendanceHistoryData {
  attended: number;
  total: number;
  targetPercent: number;
}

export function AttendanceCalculatorModal({ isOpen, onClose }: AttendanceCalculatorModalProps) {
  const [attended, setAttended] = useState<number>(34);
  const [total, setTotal] = useState<number>(40);
  const [targetPercent, setTargetPercent] = useState<number>(75);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<RecentCalculation<AttendanceHistoryData>[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getRecentCalculations<AttendanceHistoryData>('attendance'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const result = calculateAttendance(attended, total, targetPercent);

  const handleSaveToHistory = () => {
    const summary = `${attended}/${total} classes (${result.currentPercentage}%)`;
    const badge = `Req: ${targetPercent}%`;
    const updated = saveRecentCalculation<AttendanceHistoryData>('attendance', summary, badge, {
      attended,
      total,
      targetPercent,
    });
    setHistory(updated);
  };

  const handleRestoreFromHistory = (data: AttendanceHistoryData) => {
    if (typeof data.attended === 'number') setAttended(data.attended);
    if (typeof data.total === 'number') setTotal(data.total);
    if (typeof data.targetPercent === 'number') setTargetPercent(data.targetPercent);
  };

  const handleClearHistory = () => {
    clearRecentCalculations('attendance');
    setHistory([]);
  };

  const handleCopySummary = () => {
    const summary = `Attendance Report\nAttended: ${attended} / ${total} classes\nCurrent Attendance: ${result.currentPercentage}%\nTarget Requirement: ${targetPercent}%\nStatus: ${result.actionMessage}\nCalculated via Student Tools Hub`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateAttend = () => {
    setAttended((prev) => prev + 1);
    setTotal((prev) => prev + 1);
  };

  const handleSimulateMiss = () => {
    setTotal((prev) => prev + 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="attendance-modal-title"
    >
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-teal-400 font-mono tracking-wider">CALCULATOR</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Class Attendance & Safe Bunk Planner</span>
            </div>
            <h2 id="attendance-modal-title" className="text-2xl font-bold text-white font-display mt-0.5">
              Attendance Calculator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <label className="text-xs text-slate-400 block font-medium">Classes Attended</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAttended(Math.max(0, attended - 1))}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900/60 rounded-lg border border-white/10"
                  aria-label="Decrease attended classes"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  max={total}
                  value={attended}
                  onChange={(e) => setAttended(Math.min(total, Math.max(0, parseInt(e.target.value) || 0)))}
                  aria-label="Number of classes attended"
                  className="w-full px-2 py-2 text-lg font-mono font-bold text-center bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-400"
                />
                <button
                  onClick={() => setAttended(Math.min(total, attended + 1))}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900/60 rounded-lg border border-white/10"
                  aria-label="Increase attended classes"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <label className="text-xs text-slate-400 block font-medium">Total Classes Held</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTotal(Math.max(attended, total - 1))}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900/60 rounded-lg border border-white/10"
                  aria-label="Decrease total classes"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={total}
                  onChange={(e) => setTotal(Math.max(1, parseInt(e.target.value) || 1))}
                  aria-label="Total number of classes held"
                  className="w-full px-2 py-2 text-lg font-mono font-bold text-center bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-400"
                />
                <button
                  onClick={() => setTotal(total + 1)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900/60 rounded-lg border border-white/10"
                  aria-label="Increase total classes"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <label className="text-xs text-slate-400 block font-medium">Target Attendance %</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={targetPercent}
                  onChange={(e) => setTargetPercent(Math.min(100, Math.max(1, parseInt(e.target.value) || 75)))}
                  aria-label="Target attendance percentage"
                  className="w-full px-3 py-2 text-lg font-mono font-bold text-center bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-400"
                />
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setTargetPercent(75)}
                    className={`px-2 py-0.5 text-[10px] rounded ${targetPercent === 75 ? 'bg-teal-400 text-slate-900 font-bold' : 'bg-white/5 text-slate-400'}`}
                  >
                    75%
                  </button>
                  <button
                    onClick={() => setTargetPercent(80)}
                    className={`px-2 py-0.5 text-[10px] rounded ${targetPercent === 80 ? 'bg-teal-400 text-slate-900 font-bold' : 'bg-white/5 text-slate-400'}`}
                  >
                    80%
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Simulation Bar */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">Quick Simulation (What if...):</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateAttend}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
              >
                +1 Class Attended
              </button>
              <button
                onClick={handleSimulateMiss}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
              >
                +1 Class Missed
              </button>
              <button
                onClick={() => {
                  setAttended(34);
                  setTotal(40);
                }}
                className="px-2.5 py-1.5 text-slate-400 hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Main Attendance Display Card */}
          <div
            className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden transition-colors ${
              result.isMeetingTarget
                ? 'bg-gradient-to-br from-slate-900/90 to-teal-950/30 border-teal-500/30'
                : 'bg-gradient-to-br from-slate-900/90 to-rose-950/30 border-rose-500/30'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-5 text-center sm:text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Attendance</span>
                <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-1">
                  <span
                    className={`text-5xl font-extrabold font-mono tabular-nums tracking-tight ${
                      result.isMeetingTarget ? 'text-white' : 'text-rose-400'
                    }`}
                  >
                    {result.currentPercentage}%
                  </span>
                  <span className="text-slate-400 text-sm">/ target {targetPercent}%</span>
                </div>

                <div className="mt-3 flex items-center justify-center sm:justify-start gap-1.5">
                  {result.isMeetingTarget ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${result.isMeetingTarget ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {result.isMeetingTarget ? 'Safe Zone' : 'Shortage / Below Requirement'}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-7 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6 text-left space-y-3">
                <div className="text-sm font-medium text-white leading-relaxed">
                  {result.actionMessage}
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>0%</span>
                    <span className="text-teal-400 font-semibold">{targetPercent}% Target</span>
                    <span>100%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                    {/* Target marker line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-sm"
                      style={{ left: `${targetPercent}%` }}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        result.isMeetingTarget
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                          : 'bg-gradient-to-r from-rose-500 to-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, result.currentPercentage)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Classes Attended: <strong className="text-white font-mono">{attended}</strong></span>
                  <span>Classes Missed: <strong className="text-white font-mono">{total - attended}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Calculations Section (Last 5) */}
          <RecentCalculationsPanel<AttendanceHistoryData>
            items={history}
            onRestore={handleRestoreFromHistory}
            onClear={handleClearHistory}
            onSaveCurrent={handleSaveToHistory}
            accentColor="text-teal-400"
          />
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Report'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
