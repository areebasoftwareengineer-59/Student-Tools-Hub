import { useState, useEffect } from 'react';
import { X, Plus, Trash2, RotateCcw, Copy, Check, Target, Layers } from 'lucide-react';
import { SemesterRow } from '../../types';
import { calculateCGPAQuick, calculateCGPASemesters, calculateRequiredGPA } from '../../utils/calculators';
import {
  getRecentCalculations,
  saveRecentCalculation,
  clearRecentCalculations,
  RecentCalculation,
} from '../../utils/recentCalculations';
import { RecentCalculationsPanel } from './RecentCalculationsPanel';

interface CGPACalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CGPAHistoryData {
  activeTab: 'semesters' | 'quick' | 'predictor';
  semesters?: SemesterRow[];
  currentCGPA?: number;
  currentCredits?: number;
  newGPA?: number;
  newCredits?: number;
  targetCGPA?: number;
  predictorUpcomingCredits?: number;
}

export function CGPACalculatorModal({ isOpen, onClose }: CGPACalculatorModalProps) {
  const [activeTab, setActiveTab] = useState<'semesters' | 'quick' | 'predictor'>('semesters');

  // Semester Mode State
  const [semesters, setSemesters] = useState<SemesterRow[]>([
    { id: '1', semesterName: 'Semester 1', gpa: 3.65, credits: 16 },
    { id: '2', semesterName: 'Semester 2', gpa: 3.8, credits: 17 },
    { id: '3', semesterName: 'Semester 3', gpa: 3.5, credits: 15 },
    { id: '4', semesterName: 'Semester 4', gpa: 3.9, credits: 18 },
  ]);

  // Quick Mode State
  const [currentCGPA, setCurrentCGPA] = useState<number>(3.6);
  const [currentCredits, setCurrentCredits] = useState<number>(45);
  const [newGPA, setNewGPA] = useState<number>(3.85);
  const [newCredits, setNewCredits] = useState<number>(15);

  // Target Predictor State
  const [targetCGPA, setTargetCGPA] = useState<number>(3.75);
  const [predictorUpcomingCredits, setPredictorUpcomingCredits] = useState<number>(15);

  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<RecentCalculation<CGPAHistoryData>[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getRecentCalculations<CGPAHistoryData>('cgpa'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const semesterResult = calculateCGPASemesters(semesters);
  const quickResult = calculateCGPAQuick(currentCGPA, currentCredits, newGPA, newCredits);

  // Use the semester result or quick result base for target prediction
  const activeBaseCGPA = activeTab === 'semesters' ? semesterResult.cgpa : currentCGPA;
  const activeBaseCredits = activeTab === 'semesters' ? semesterResult.totalCredits : currentCredits;
  const predictorResult = calculateRequiredGPA(
    targetCGPA,
    activeBaseCGPA,
    activeBaseCredits,
    predictorUpcomingCredits,
    4.0
  );

  const handleSaveToHistory = () => {
    let summary = '';
    let badge = '';

    if (activeTab === 'semesters') {
      summary = `CGPA ${semesterResult.cgpa.toFixed(2)} (${semesterResult.totalCredits} cr)`;
      badge = `${semesters.length} Semesters`;
    } else if (activeTab === 'quick') {
      summary = `Updated CGPA ${quickResult.cgpa.toFixed(2)}`;
      badge = `Quick Update`;
    } else {
      summary = `Target ${targetCGPA.toFixed(2)} → Need ${predictorResult.requiredGPA.toFixed(2)}`;
      badge = `Target Predictor`;
    }

    const updated = saveRecentCalculation<CGPAHistoryData>('cgpa', summary, badge, {
      activeTab,
      semesters,
      currentCGPA,
      currentCredits,
      newGPA,
      newCredits,
      targetCGPA,
      predictorUpcomingCredits,
    });
    setHistory(updated);
  };

  const handleRestoreFromHistory = (data: CGPAHistoryData) => {
    if (data.activeTab) setActiveTab(data.activeTab);
    if (Array.isArray(data.semesters) && data.semesters.length > 0) setSemesters(data.semesters);
    if (typeof data.currentCGPA === 'number') setCurrentCGPA(data.currentCGPA);
    if (typeof data.currentCredits === 'number') setCurrentCredits(data.currentCredits);
    if (typeof data.newGPA === 'number') setNewGPA(data.newGPA);
    if (typeof data.newCredits === 'number') setNewCredits(data.newCredits);
    if (typeof data.targetCGPA === 'number') setTargetCGPA(data.targetCGPA);
    if (typeof data.predictorUpcomingCredits === 'number') setPredictorUpcomingCredits(data.predictorUpcomingCredits);
  };

  const handleClearHistory = () => {
    clearRecentCalculations('cgpa');
    setHistory([]);
  };

  const handleAddSemester = () => {
    const nextNum = semesters.length + 1;
    setSemesters([
      ...semesters,
      { id: Date.now().toString(), semesterName: `Semester ${nextNum}`, gpa: 3.5, credits: 15 },
    ]);
  };

  const handleRemoveSemester = (id: string) => {
    if (semesters.length <= 1) return;
    setSemesters(semesters.filter((s) => s.id !== id));
  };

  const handleSemesterChange = (id: string, field: 'gpa' | 'credits' | 'semesterName', value: string | number) => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleCopySummary = () => {
    let summary = '';
    if (activeTab === 'semesters') {
      summary = `Cumulative GPA (CGPA) Breakdown\nSemesters Count: ${semesters.length}\nTotal Completed Credits: ${semesterResult.totalCredits}\nCalculated CGPA: ${semesterResult.cgpa.toFixed(2)}\nCalculated via Student Tools Hub`;
    } else {
      summary = `Quick CGPA Update\nPrevious CGPA: ${currentCGPA} (${currentCredits} credits)\nNew Semester: ${newGPA} (${newCredits} credits)\nUpdated Overall CGPA: ${quickResult.cgpa.toFixed(2)}\nTotal Credits: ${quickResult.totalCredits}`;
    }
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cgpa-modal-title"
    >
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-400 font-mono tracking-wider">CALCULATOR</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Cumulative Grade Point Average</span>
            </div>
            <h2 id="cgpa-modal-title" className="text-2xl font-bold text-white font-display mt-0.5">
              CGPA Calculator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="pt-4 flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('semesters')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'semesters'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semester-by-Semester</span>
          </button>

          <button
            onClick={() => setActiveTab('quick')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'quick'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Quick Update</span>
          </button>

          <button
            onClick={() => setActiveTab('predictor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'predictor'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Target CGPA Predictor</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          {activeTab === 'semesters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Enter each semester's GPA and credit hours:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setSemesters([
                        { id: '1', semesterName: 'Semester 1', gpa: 3.5, credits: 15 },
                        { id: '2', semesterName: 'Semester 2', gpa: 3.7, credits: 16 },
                      ])
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-white/5 rounded-lg"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleAddSemester}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-900 bg-indigo-400 hover:bg-indigo-300 rounded-lg shadow-sm"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Semester</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-slate-400 px-3 pb-1">
                  <div className="col-span-5">Semester Label</div>
                  <div className="col-span-4">Semester GPA (0.0 - 4.0)</div>
                  <div className="col-span-2">Credit Hours</div>
                  <div className="col-span-1 text-right">Del</div>
                </div>

                {semesters.map((sem, idx) => (
                  <div
                    key={sem.id}
                    className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
                  >
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={sem.semesterName}
                        onChange={(e) => handleSemesterChange(sem.id, 'semesterName', e.target.value)}
                        placeholder={`Semester ${idx + 1}`}
                        className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-400 transition-colors"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        min="0"
                        max="4.33"
                        step="0.01"
                        value={sem.gpa}
                        onChange={(e) => handleSemesterChange(sem.id, 'gpa', parseFloat(e.target.value) || 0)}
                        aria-label={`GPA for ${sem.semesterName}`}
                        className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white font-mono tabular-nums focus:outline-none focus:border-indigo-400 transition-colors"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        step="1"
                        value={sem.credits}
                        onChange={(e) => handleSemesterChange(sem.id, 'credits', parseFloat(e.target.value) || 0)}
                        aria-label={`Credits for ${sem.semesterName}`}
                        className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white font-mono tabular-nums text-center focus:outline-none focus:border-indigo-400 transition-colors"
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => handleRemoveSemester(sem.id)}
                        disabled={semesters.length <= 1}
                        className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30 rounded-lg transition-colors"
                        aria-label="Remove semester"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Semester CGPA Result Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-indigo-950/30 border border-indigo-500/30 shadow-xl flex flex-wrap items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Overall Cumulative GPA</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl font-extrabold text-white font-mono tabular-nums">
                      {semesterResult.cgpa.toFixed(2)}
                    </span>
                    <span className="text-slate-400 text-sm font-mono">/ 4.00</span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-xs text-slate-400">Total Credits</div>
                    <div className="text-2xl font-bold text-white font-mono tabular-nums">{semesterResult.totalCredits}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Total Quality Points</div>
                    <div className="text-2xl font-bold text-white font-mono tabular-nums">{semesterResult.totalQualityPoints.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quick' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Current Standing</span>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Current Cumulative CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      value={currentCGPA}
                      onChange={(e) => setCurrentCGPA(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Completed Credit Hours</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={currentCredits}
                      onChange={(e) => setCurrentCredits(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">New Semester</span>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Expected Semester GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      value={newGPA}
                      onChange={(e) => setNewGPA(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">New Semester Credit Hours</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={newCredits}
                      onChange={(e) => setNewCredits(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Result Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-indigo-950/30 border border-indigo-500/30 shadow-xl flex flex-wrap items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Updated Cumulative CGPA</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl font-extrabold text-white font-mono tabular-nums">
                      {quickResult.cgpa.toFixed(2)}
                    </span>
                    <span className="text-slate-400 text-sm font-mono">/ 4.00</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Change from {currentCGPA.toFixed(2)}: {' '}
                    <span className={quickResult.cgpa >= currentCGPA ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>
                      {quickResult.cgpa >= currentCGPA ? '+' : ''}{(quickResult.cgpa - currentCGPA).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400">Total Credits After Semester</div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">{quickResult.totalCredits}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictor' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <div className="text-xs text-slate-300 leading-relaxed">
                  Based on your current CGPA of <strong className="text-indigo-400 font-mono">{activeBaseCGPA.toFixed(2)}</strong> across <strong className="text-white font-mono">{activeBaseCredits}</strong> credits:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Target Desired CGPA</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="4.0"
                      value={targetCGPA}
                      onChange={(e) => setTargetCGPA(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Upcoming Semester Credit Hours</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max="30"
                      value={predictorUpcomingCredits}
                      onChange={(e) => setPredictorUpcomingCredits(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Predictor Result */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-indigo-950/30 border border-indigo-500/30 shadow-xl space-y-3">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Required Upcoming Semester GPA</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-extrabold font-mono tabular-nums ${predictorResult.isPossible ? 'text-white' : 'text-rose-400'}`}>
                    {predictorResult.requiredGPA.toFixed(2)}
                  </span>
                  <span className="text-slate-400 text-sm font-mono">/ 4.00</span>
                </div>

                <p className={`text-sm ${predictorResult.isPossible ? 'text-indigo-200' : 'text-rose-300'}`}>
                  {predictorResult.statusMessage}
                </p>
              </div>
            </div>
          )}

          {/* Recent Calculations Section (Last 5) */}
          <RecentCalculationsPanel<CGPAHistoryData>
            items={history}
            onRestore={handleRestoreFromHistory}
            onClear={handleClearHistory}
            onSaveCurrent={handleSaveToHistory}
            accentColor="text-indigo-400"
          />
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-indigo-400 hover:bg-indigo-300 rounded-lg transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
