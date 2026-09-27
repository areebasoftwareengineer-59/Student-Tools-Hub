import { useState, useEffect } from 'react';
import { X, Percent, ArrowRightLeft, Copy, Check, TrendingUp } from 'lucide-react';
import { calculateMarksPercentage, convertGPAToPercentage } from '../../utils/calculators';
import {
  getRecentCalculations,
  saveRecentCalculation,
  clearRecentCalculations,
  RecentCalculation,
} from '../../utils/recentCalculations';
import { RecentCalculationsPanel } from './RecentCalculationsPanel';

interface PercentageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PercentageHistoryData {
  activeTab: 'marks' | 'gpaToPercent' | 'growth';
  obtained?: number;
  total?: number;
  inputGPA?: number;
  gpaScale?: '4.0' | '10.0';
  gpaFormula?: 'us_standard' | 'cbse_9_5';
  term1Marks?: number;
  term2Marks?: number;
}

export function PercentageCalculatorModal({ isOpen, onClose }: PercentageCalculatorModalProps) {
  const [activeTab, setActiveTab] = useState<'marks' | 'gpaToPercent' | 'growth'>('marks');

  // Mode 1: Marks to Percentage
  const [obtained, setObtained] = useState<number>(442);
  const [total, setTotal] = useState<number>(500);

  // Mode 2: GPA to Percentage
  const [inputGPA, setInputGPA] = useState<number>(3.8);
  const [gpaScale, setGpaScale] = useState<'4.0' | '10.0'>('4.0');
  const [gpaFormula, setGpaFormula] = useState<'us_standard' | 'cbse_9_5'>('us_standard');

  // Mode 3: Exam Term Growth
  const [term1Marks, setTerm1Marks] = useState<number>(78);
  const [term2Marks, setTerm2Marks] = useState<number>(89);

  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<RecentCalculation<PercentageHistoryData>[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getRecentCalculations<PercentageHistoryData>('percentage'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const marksResult = calculateMarksPercentage(obtained, total);
  const gpaToPercentResult = convertGPAToPercentage(
    inputGPA,
    gpaScale,
    gpaScale === '10.0' ? 'cbse_9_5' : gpaFormula
  );

  const growthPct = term1Marks > 0 ? ((term2Marks - term1Marks) / term1Marks) * 100 : 0;

  const handleSaveToHistory = () => {
    let summary = '';
    let badge = '';

    if (activeTab === 'marks') {
      summary = `${obtained}/${total} = ${marksResult.percentage.toFixed(2)}%`;
      badge = `Grade ${marksResult.letterGrade}`;
    } else if (activeTab === 'gpaToPercent') {
      summary = `GPA ${inputGPA} → ${gpaToPercentResult.toFixed(2)}%`;
      badge = `${gpaScale} Scale`;
    } else {
      summary = `Term: ${term1Marks}% → ${term2Marks}% (${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(1)}%)`;
      badge = `Growth`;
    }

    const updated = saveRecentCalculation<PercentageHistoryData>('percentage', summary, badge, {
      activeTab,
      obtained,
      total,
      inputGPA,
      gpaScale,
      gpaFormula,
      term1Marks,
      term2Marks,
    });
    setHistory(updated);
  };

  const handleRestoreFromHistory = (data: PercentageHistoryData) => {
    if (data.activeTab) setActiveTab(data.activeTab);
    if (typeof data.obtained === 'number') setObtained(data.obtained);
    if (typeof data.total === 'number') setTotal(data.total);
    if (typeof data.inputGPA === 'number') setInputGPA(data.inputGPA);
    if (data.gpaScale) setGpaScale(data.gpaScale);
    if (data.gpaFormula) setGpaFormula(data.gpaFormula);
    if (typeof data.term1Marks === 'number') setTerm1Marks(data.term1Marks);
    if (typeof data.term2Marks === 'number') setTerm2Marks(data.term2Marks);
  };

  const handleClearHistory = () => {
    clearRecentCalculations('percentage');
    setHistory([]);
  };

  const handleCopySummary = () => {
    let summary = '';
    if (activeTab === 'marks') {
      summary = `Marks Percentage Result\nMarks: ${obtained} / ${total}\nPercentage: ${marksResult.percentage.toFixed(2)}%\nGrade Equivalent: ${marksResult.letterGrade}\nEstimated 4.0 GPA: ${marksResult.equivalentGPA4.toFixed(2)}\nCalculated via Student Tools Hub`;
    } else if (activeTab === 'gpaToPercent') {
      summary = `GPA to Percentage Conversion\nInput GPA: ${inputGPA} (${gpaScale} scale)\nConverted Percentage: ${gpaToPercentResult.toFixed(2)}%`;
    } else {
      summary = `Term Comparison\nTerm 1: ${term1Marks}%\nTerm 2: ${term2Marks}%\nGrowth: ${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(2)}%`;
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
      aria-labelledby="percentage-modal-title"
    >
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 font-mono tracking-wider">CALCULATOR</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Instant Academic Percentage & Conversions</span>
            </div>
            <h2 id="percentage-modal-title" className="text-2xl font-bold text-white font-display mt-0.5">
              Percentage Calculator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="pt-4 flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('marks')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'marks'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Marks Percentage</span>
          </button>

          <button
            onClick={() => setActiveTab('gpaToPercent')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'gpaToPercent'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>GPA to % Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('growth')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'growth'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Term Growth & Delta</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          {activeTab === 'marks' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <label className="text-xs text-slate-400 block font-medium">Marks Obtained / Scored</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={obtained}
                    onChange={(e) => setObtained(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-base font-mono bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  <span className="text-[11px] text-slate-500 block">Sum of marks from all subjects</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <label className="text-xs text-slate-400 block font-medium">Total Maximum Marks</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={total}
                    onChange={(e) => setTotal(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-base font-mono bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  <span className="text-[11px] text-slate-500 block">e.g., 500 for 5 subjects of 100 marks</span>
                </div>
              </div>

              {/* Marks Result Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/30 border border-emerald-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10">
                  <div className="sm:col-span-6 text-center sm:text-left">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Marks Percentage</span>
                    <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-1">
                      <span className="text-5xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                        {marksResult.percentage.toFixed(2)}
                      </span>
                      <span className="text-emerald-400 text-2xl font-bold font-mono">%</span>
                    </div>

                    <div className="mt-2 text-xs text-slate-300">
                      Formula: ({obtained} ÷ {total}) × 100
                    </div>
                  </div>

                  <div className="sm:col-span-6 grid grid-cols-2 gap-4 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6 text-left">
                    <div>
                      <div className="text-xs text-slate-400">Grade Letter</div>
                      <div className="text-2xl font-bold text-emerald-300 font-mono mt-0.5">
                        {marksResult.letterGrade}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">4.0 Scale GPA</div>
                      <div className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5">
                        {marksResult.equivalentGPA4.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-slate-400">10.0 Scale CGPA (CBSE / 9.5):</span>
                      <span className="text-white font-mono font-bold">{marksResult.equivalentGPA10.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gpaToPercent' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <label className="text-xs text-slate-400 block font-medium">Input GPA / CGPA Value</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={gpaScale === '10.0' ? 10 : 4.0}
                    value={inputGPA}
                    onChange={(e) => setInputGPA(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-base font-mono bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setGpaScale('4.0');
                        setInputGPA(3.8);
                      }}
                      className={`px-2.5 py-1 text-xs rounded-md ${
                        gpaScale === '4.0' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      4.0 Scale
                    </button>
                    <button
                      onClick={() => {
                        setGpaScale('10.0');
                        setInputGPA(8.8);
                      }}
                      className={`px-2.5 py-1 text-xs rounded-md ${
                        gpaScale === '10.0' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      10.0 Scale
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <label className="text-xs text-slate-400 block font-medium">Conversion Standard</label>
                  <div className="space-y-2 text-xs text-slate-300">
                    {gpaScale === '4.0' ? (
                      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 leading-relaxed">
                        Standard US College Board scale alignment: 4.0 ≈ 95%, 3.7 ≈ 91%, 3.0 ≈ 85%, 2.0 ≈ 75%.
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 leading-relaxed">
                        CBSE & AICTE standard formula: <strong className="text-emerald-400 font-mono">Percentage = CGPA × 9.5</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Conversion Result Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/30 border border-emerald-500/30 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Equivalent Percentage</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-5xl font-extrabold text-white font-mono tabular-nums">
                      {gpaToPercentResult.toFixed(2)}
                    </span>
                    <span className="text-emerald-400 text-2xl font-bold font-mono">%</span>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-400">
                  Based on {inputGPA.toFixed(2)} / {gpaScale === '10.0' ? '10.0' : '4.0'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'growth' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <label className="text-xs text-slate-400 block font-medium">Term 1 / Midterm Marks (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={term1Marks}
                    onChange={(e) => setTerm1Marks(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-base font-mono bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <label className="text-xs text-slate-400 block font-medium">Term 2 / Final Marks (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={term2Marks}
                    onChange={(e) => setTerm2Marks(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-base font-mono bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Growth Result Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/30 border border-emerald-500/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Performance Shift</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-5xl font-extrabold font-mono tabular-nums ${growthPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {growthPct >= 0 ? '+' : ''}{growthPct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Absolute delta: {term2Marks - term1Marks >= 0 ? '+' : ''}{(term2Marks - term1Marks).toFixed(1)} percentage points
                  </div>
                </div>

                <div className="text-xs text-slate-300 max-w-xs bg-white/[0.03] p-3 rounded-xl border border-white/5">
                  {growthPct >= 0
                    ? `Great progression! You improved your marks by ${growthPct.toFixed(1)}% compared to Term 1.`
                    : `Your score dropped by ${Math.abs(growthPct).toFixed(1)}%. Review weak topics for the next evaluation.`}
                </div>
              </div>
            </div>
          )}

          {/* Recent Calculations Section (Last 5) */}
          <RecentCalculationsPanel<PercentageHistoryData>
            items={history}
            onRestore={handleRestoreFromHistory}
            onClear={handleClearHistory}
            onSaveCurrent={handleSaveToHistory}
            accentColor="text-emerald-400"
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
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
