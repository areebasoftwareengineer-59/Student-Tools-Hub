import { X, BookOpen, CheckCircle, Lightbulb, Calculator } from 'lucide-react';
import { GuideArticle } from '../../types';

interface GuideModalProps {
  guide: GuideArticle | null;
  onClose: () => void;
  onOpenCalculator?: () => void;
}

export function GuideModal({ guide, onClose, onOpenCalculator }: GuideModalProps) {
  if (!guide) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 font-mono tracking-wider">
              <span>{guide.category.toUpperCase()}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{guide.readTime}</span>
            </div>
            <h2 id="guide-modal-title" className="text-2xl font-bold text-white font-display">
              {guide.title}
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

        {/* Content */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1 text-slate-300 text-sm leading-relaxed">
          {/* Overview */}
          <div>
            <h3 className="text-base font-bold text-white font-display mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Overview</span>
            </h3>
            <p>{guide.content.overview}</p>
          </div>

          {/* Formula box */}
          {guide.content.formula && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
              <div className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                Official Mathematical Formula
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-white bg-slate-900/60 p-3 rounded-lg border border-white/5 overflow-x-auto">
                {guide.content.formula}
              </div>
              {guide.content.formulaExplanation && (
                <p className="text-xs text-slate-300">{guide.content.formulaExplanation}</p>
              )}
            </div>
          )}

          {/* Step-by-Step */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white font-display">Calculation Steps</h3>
            <ol className="space-y-2 pl-4 list-decimal marker:text-cyan-400 marker:font-bold">
              {guide.content.stepByStep.map((step, idx) => (
                <li key={idx} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Example Case */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Practical Example Case
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <strong className="text-slate-200">Scenario:</strong> {guide.content.exampleCase.scenario}
              </div>
              <div>
                <strong className="text-slate-200">Working:</strong>{' '}
                <span className="font-mono text-cyan-300">{guide.content.exampleCase.calculation}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold font-mono">
                Result: {guide.content.exampleCase.result}
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Pro Tips & Academic Advice</span>
            </h3>
            <div className="space-y-2">
              {guide.content.proTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          {onOpenCalculator && (
            <button
              onClick={() => {
                onClose();
                onOpenCalculator();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Open Relevant Calculator</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors ml-auto"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
