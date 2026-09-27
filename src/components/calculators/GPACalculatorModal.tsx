import { useState, useId, useEffect } from 'react';
import { X, Plus, Trash2, RotateCcw, Copy, Check, Sparkles, Award } from 'lucide-react';
import { CourseRow, GradingScale } from '../../types';
import { calculateGPA, GRADE_SCALES } from '../../utils/calculators';
import {
  getRecentCalculations,
  saveRecentCalculation,
  clearRecentCalculations,
  RecentCalculation,
} from '../../utils/recentCalculations';
import { RecentCalculationsPanel } from './RecentCalculationsPanel';
import confetti from 'canvas-confetti';

interface GPACalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GPAHistoryData {
  scale: GradingScale;
  courses: CourseRow[];
}

const DEFAULT_COURSES: CourseRow[] = [
  { id: '1', name: 'Data Structures & Algorithms', gradePoint: 4.0, gradeLetter: 'A', credits: 4 },
  { id: '2', name: 'Calculus III', gradePoint: 3.7, gradeLetter: 'A-', credits: 4 },
  { id: '3', name: 'Computer Systems', gradePoint: 3.3, gradeLetter: 'B+', credits: 3 },
  { id: '4', name: 'Technical Writing', gradePoint: 4.0, gradeLetter: 'A', credits: 3 },
  { id: '5', name: 'Linear Algebra', gradePoint: 3.0, gradeLetter: 'B', credits: 3 },
];

export function GPACalculatorModal({ isOpen, onClose }: GPACalculatorModalProps) {
  const [scale, setScale] = useState<GradingScale>('4.0');
  const [courses, setCourses] = useState<CourseRow[]>(DEFAULT_COURSES);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<RecentCalculation<GPAHistoryData>[]>([]);
  const baseId = useId();

  // Load history on mount
  useEffect(() => {
    if (isOpen) {
      setHistory(getRecentCalculations<GPAHistoryData>('gpa'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentScaleConfig = GRADE_SCALES[scale];
  const result = calculateGPA(courses, scale);

  const handleSaveToHistory = () => {
    if (result.totalCredits <= 0) return;
    const summary = `GPA ${result.gpa.toFixed(2)} (${result.totalCredits} cr)`;
    const badge = `${scale} Scale`;
    const updated = saveRecentCalculation<GPAHistoryData>('gpa', summary, badge, {
      scale,
      courses,
    });
    setHistory(updated);
  };

  const handleRestoreFromHistory = (data: GPAHistoryData) => {
    if (data.scale && GRADE_SCALES[data.scale]) {
      setScale(data.scale);
    }
    if (Array.isArray(data.courses) && data.courses.length > 0) {
      setCourses(data.courses);
    }
  };

  const handleClearHistory = () => {
    clearRecentCalculations('gpa');
    setHistory([]);
  };

  const handleGradeChange = (id: string, gradeLetter: string) => {
    const matched = currentScaleConfig.grades.find((g) => g.letter === gradeLetter);
    const gradePoint = matched ? matched.points : 0;
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, gradeLetter, gradePoint } : c))
    );
  };

  const handleCreditsChange = (id: string, credits: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, credits: Math.max(0, credits) } : c))
    );
  };

  const handleNameChange = (id: string, name: string) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  };

  const handleAddCourse = () => {
    const newCourse: CourseRow = {
      id: `${baseId}-${Date.now()}`,
      name: `Course ${courses.length + 1}`,
      gradePoint: currentScaleConfig.grades[0].points,
      gradeLetter: currentScaleConfig.grades[0].letter,
      credits: 3,
    };
    setCourses([...courses, newCourse]);
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((c) => c.id !== id));
  };

  const handleReset = () => {
    setCourses([
      { id: '1', name: 'Course 1', gradePoint: 4.0, gradeLetter: 'A', credits: 3 },
      { id: '2', name: 'Course 2', gradePoint: 3.7, gradeLetter: 'A-', credits: 3 },
      { id: '3', name: 'Course 3', gradePoint: 3.3, gradeLetter: 'B+', credits: 3 },
    ]);
  };

  const handleTriggerCelebration = () => {
    if (result.gpa >= 3.5) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#34d399', '#818cf8', '#fbbf24'],
      });
    }
  };

  const handleCopySummary = () => {
    const summary = `Academic GPA Summary\nScale: ${scale}\nCalculated GPA: ${result.gpa.toFixed(2)} / ${currentScaleConfig.max.toFixed(2)}\nTotal Credits: ${result.totalCredits}\nQuality Points: ${result.totalQualityPoints}\nStanding: ${result.academicStanding}\nCalculated via Student Tools Hub`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gpa-modal-title"
    >
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-cyan-400 font-mono tracking-wider">CALCULATOR</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Semester Grade Point Average</span>
            </div>
            <h2 id="gpa-modal-title" className="text-2xl font-bold text-white font-display mt-0.5">
              GPA Calculator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          {/* Controls: Scale Selection & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Grading Scale:</span>
              {(['4.0', '4.33', '5.0', '10.0'] as GradingScale[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setScale(s);
                    // normalize grades to new scale
                    const newConfig = GRADE_SCALES[s];
                    setCourses((prev) =>
                      prev.map((c) => ({
                        ...c,
                        gradeLetter: newConfig.grades[0].letter,
                        gradePoint: newConfig.grades[0].points,
                      }))
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    scale === s
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-white/5'
                  }`}
                >
                  {s} Scale
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleAddCourse}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Course</span>
              </button>
            </div>
          </div>

          {/* Courses Table / List */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-slate-400 px-3 pb-1">
              <div className="col-span-5 sm:col-span-5">Course Title (Optional)</div>
              <div className="col-span-4 sm:col-span-4">Grade & Equivalent</div>
              <div className="col-span-2 sm:col-span-2">Credits</div>
              <div className="col-span-1 text-right">Del</div>
            </div>

            {courses.map((course, index) => (
              <div
                key={course.id}
                className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
              >
                <div className="col-span-5 sm:col-span-5">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => handleNameChange(course.id, e.target.value)}
                    placeholder={`Course ${index + 1}`}
                    className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div className="col-span-4 sm:col-span-4">
                  <select
                    value={course.gradeLetter}
                    onChange={(e) => handleGradeChange(course.id, e.target.value)}
                    aria-label={`Grade for ${course.name || `Course ${index + 1}`}`}
                    className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                  >
                    {currentScaleConfig.grades.map((g) => (
                      <option key={g.letter} value={g.letter} className="bg-slate-900 text-white">
                        {g.letter} ({g.points} pts · {g.percentRange})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-2">
                  <input
                    type="number"
                    min="0"
                    max="12"
                    step="0.5"
                    value={course.credits}
                    onChange={(e) => handleCreditsChange(course.id, parseFloat(e.target.value) || 0)}
                    aria-label={`Credits for ${course.name || `Course ${index + 1}`}`}
                    className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white font-mono tabular-nums text-center focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div className="col-span-1 text-right">
                  <button
                    onClick={() => handleRemoveCourse(course.id)}
                    disabled={courses.length <= 1}
                    className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-slate-500 rounded-lg hover:bg-white/5 transition-colors"
                    title="Remove course"
                    aria-label="Remove course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Results Display Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/30 border border-cyan-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
              <div className="md:col-span-5 text-center md:text-left">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Calculated GPA</span>
                <div className="flex items-baseline justify-center md:justify-start gap-2 mt-1">
                  <span className="text-5xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                    {result.gpa.toFixed(2)}
                  </span>
                  <span className="text-slate-400 text-sm font-mono">/ {currentScaleConfig.max.toFixed(2)}</span>
                </div>

                <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
                  <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className={`text-xs font-semibold ${result.standingColor}`}>
                    {result.academicStanding}
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 text-left">
                <div>
                  <div className="text-xs text-slate-400">Total Credits</div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
                    {result.totalCredits}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400">Quality Points</div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
                    {result.totalQualityPoints.toFixed(2)}
                  </div>
                </div>

                <div className="col-span-2 text-xs text-slate-300 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/5">
                  {result.standingDescription}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Calculations Section (Last 5) */}
          <RecentCalculationsPanel<GPAHistoryData>
            items={history}
            onRestore={handleRestoreFromHistory}
            onClear={handleClearHistory}
            onSaveCurrent={handleSaveToHistory}
            accentColor="text-cyan-400"
          />
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
            </button>

            {result.gpa >= 3.5 && (
              <button
                onClick={handleTriggerCelebration}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Celebrate</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
