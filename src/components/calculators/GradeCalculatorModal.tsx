import { useState, useId, useEffect } from 'react';
import { X, Plus, Trash2, RotateCcw, Copy, Check, Target, AlertCircle } from 'lucide-react';
import { GradeComponentRow } from '../../types';
import { calculateGradeTargets } from '../../utils/calculators';
import {
  getRecentCalculations,
  saveRecentCalculation,
  clearRecentCalculations,
  RecentCalculation,
} from '../../utils/recentCalculations';
import { RecentCalculationsPanel } from './RecentCalculationsPanel';

interface GradeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GradeHistoryData {
  components: GradeComponentRow[];
  finalExamWeight: number;
}

const DEFAULT_COMPONENTS: GradeComponentRow[] = [
  { id: '1', name: 'Assignments / Problem Sets', score: 92, weight: 20 },
  { id: '2', name: 'Midterm Exam 1', score: 85, weight: 20 },
  { id: '3', name: 'Midterm Exam 2', score: 88, weight: 20 },
  { id: '4', name: 'Quizzes & Lab Work', score: 95, weight: 10 },
];

export function GradeCalculatorModal({ isOpen, onClose }: GradeCalculatorModalProps) {
  const [components, setComponents] = useState<GradeComponentRow[]>(DEFAULT_COMPONENTS);
  const [finalExamWeight, setFinalExamWeight] = useState<number>(30);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<RecentCalculation<GradeHistoryData>[]>([]);
  const baseId = useId();

  useEffect(() => {
    if (isOpen) {
      setHistory(getRecentCalculations<GradeHistoryData>('grade'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCourseWeight = components.reduce((acc, c) => acc + c.weight, 0) + finalExamWeight;
  const result = calculateGradeTargets(components, finalExamWeight);

  const handleSaveToHistory = () => {
    const summary = `${result.currentWeightedScore}% (${result.currentLetter}) · Final ${finalExamWeight}%`;
    const badge = `${components.length} Items`;
    const updated = saveRecentCalculation<GradeHistoryData>('grade', summary, badge, {
      components,
      finalExamWeight,
    });
    setHistory(updated);
  };

  const handleRestoreFromHistory = (data: GradeHistoryData) => {
    if (Array.isArray(data.components) && data.components.length > 0) {
      setComponents(data.components);
    }
    if (typeof data.finalExamWeight === 'number') {
      setFinalExamWeight(data.finalExamWeight);
    }
  };

  const handleClearHistory = () => {
    clearRecentCalculations('grade');
    setHistory([]);
  };

  const handleComponentChange = (id: string, field: 'name' | 'score' | 'weight', value: string | number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleAddComponent = () => {
    const newComponent: GradeComponentRow = {
      id: `${baseId}-${Date.now()}`,
      name: `Assessment ${components.length + 1}`,
      score: 85,
      weight: 10,
    };
    setComponents([...components, newComponent]);
  };

  const handleRemoveComponent = (id: string) => {
    if (components.length <= 1) return;
    setComponents(components.filter((c) => c.id !== id));
  };

  const handleReset = () => {
    setComponents([
      { id: '1', name: 'Assignments', score: 90, weight: 25 },
      { id: '2', name: 'Midterm Exam', score: 82, weight: 35 },
    ]);
    setFinalExamWeight(40);
  };

  const handleCopySummary = () => {
    const summary = `Grade Assessment Analysis\nCurrent Completed Grade: ${result.currentWeightedScore}% (${result.currentLetter})\nFinal Exam Weight: ${finalExamWeight}%\nRequired Final Score for A (93%): ${result.finalTargetResults[0]?.requiredScore}%\nRequired Final Score for B (83%): ${result.finalTargetResults[3]?.requiredScore}%\nCalculated via Student Tools Hub`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grade-modal-title"
    >
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-400 font-mono tracking-wider">CALCULATOR</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Weighted Assessment & Final Exam Target</span>
            </div>
            <h2 id="grade-modal-title" className="text-2xl font-bold text-white font-display mt-0.5">
              Grade Calculator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          {/* Header warning if weights != 100 */}
          {Math.abs(totalCourseWeight - 100) > 0.1 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                Total course weights sum to <strong>{totalCourseWeight}%</strong> (including {finalExamWeight}% final). Standard syllabus total is usually 100%.
              </span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xs text-slate-400">Completed Coursework Components:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-white/5 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleAddComponent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Component</span>
              </button>
            </div>
          </div>

          {/* Components List */}
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-slate-400 px-3 pb-1">
              <div className="col-span-6 sm:col-span-6">Component Name</div>
              <div className="col-span-3 sm:col-span-3">Your Score (%)</div>
              <div className="col-span-2 sm:col-span-2">Weight (%)</div>
              <div className="col-span-1 text-right">Del</div>
            </div>

            {components.map((comp) => (
              <div
                key={comp.id}
                className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
              >
                <div className="col-span-6 sm:col-span-6">
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) => handleComponentChange(comp.id, 'name', e.target.value)}
                    placeholder="e.g. Midterm 1"
                    className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="col-span-3 sm:col-span-3">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="150"
                      step="0.5"
                      value={comp.score}
                      onChange={(e) => handleComponentChange(comp.id, 'score', parseFloat(e.target.value) || 0)}
                      aria-label={`Score for ${comp.name}`}
                      className="w-full px-3 py-2 pr-7 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white font-mono text-center focus:outline-none focus:border-amber-400"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400">%</span>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-2">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={comp.weight}
                      onChange={(e) => handleComponentChange(comp.id, 'weight', parseFloat(e.target.value) || 0)}
                      aria-label={`Weight for ${comp.name}`}
                      className="w-full px-3 py-2 pr-7 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white font-mono text-center focus:outline-none focus:border-amber-400"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400">%</span>
                  </div>
                </div>

                <div className="col-span-1 text-right">
                  <button
                    onClick={() => handleRemoveComponent(comp.id)}
                    disabled={components.length <= 1}
                    className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30 rounded-lg transition-colors"
                    aria-label="Remove component"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Final Exam Weight Configuration */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white">Upcoming Final Exam Weight</div>
              <div className="text-xs text-slate-400">Percentage of overall course grade determined by the final exam</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                step="5"
                value={finalExamWeight}
                onChange={(e) => setFinalExamWeight(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                aria-label="Final exam weight"
                className="w-24 px-3 py-2 text-base font-mono font-bold text-center bg-slate-900/60 border border-white/10 rounded-lg text-amber-300 focus:outline-none focus:border-amber-400"
              />
              <span className="text-slate-400 font-mono text-sm">%</span>
            </div>
          </div>

          {/* Current Grade & Target Score Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Current Grade Box */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-amber-950/20 border border-amber-500/30 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Current Standing</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-extrabold text-white font-mono tabular-nums">
                    {result.currentWeightedScore}%
                  </span>
                  <span className="text-amber-300 text-2xl font-bold font-mono">({result.currentLetter})</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-300 space-y-1">
                <div>Completed coursework weight: <strong className="text-white font-mono">{result.currentCompletedWeight}%</strong></div>
                <div>Remaining final exam weight: <strong className="text-amber-300 font-mono">{finalExamWeight}%</strong></div>
              </div>
            </div>

            {/* Target Breakdown Grid */}
            <div className="md:col-span-7 p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Target Final Exam Scores Needed
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {result.finalTargetResults.map((target) => (
                  <div
                    key={target.targetName}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
                  >
                    <span className="text-slate-200 font-medium">{target.targetName}</span>
                    <div>
                      {target.status === 'secured' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold font-mono">
                          Already Secured ✓
                        </span>
                      ) : target.status === 'impossible' ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold font-mono">
                          Need &gt;100% (Not possible)
                        </span>
                      ) : (
                        <span className="font-mono font-bold text-amber-300 text-sm">
                          Need {target.requiredScore}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Calculations Section (Last 5) */}
          <RecentCalculationsPanel<GradeHistoryData>
            items={history}
            onRestore={handleRestoreFromHistory}
            onClear={handleClearHistory}
            onSaveCurrent={handleSaveToHistory}
            accentColor="text-amber-400"
          />
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Breakdown'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
