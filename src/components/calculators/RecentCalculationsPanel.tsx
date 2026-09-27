import { History, RotateCcw, Trash2, ArrowUpRight } from 'lucide-react';
import { RecentCalculation } from '../../utils/recentCalculations';

interface RecentCalculationsPanelProps<T> {
  items: RecentCalculation<T>[];
  onRestore: (data: T) => void;
  onClear: () => void;
  onSaveCurrent?: () => void;
  accentColor?: string;
}

export function RecentCalculationsPanel<T>({
  items,
  onRestore,
  onClear,
  onSaveCurrent,
  accentColor = 'text-purple-400',
}: RecentCalculationsPanelProps<T>) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className={`w-4 h-4 ${accentColor}`} />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Recent Calculations ({items.length}/5)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {onSaveCurrent && (
            <button
              onClick={onSaveCurrent}
              className="text-[11px] font-medium px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              title="Save current calculation to history"
            >
              + Save Current
            </button>
          )}

          {items.length > 0 && (
            <button
              onClick={onClear}
              className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Clear calculation history"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-xs text-slate-500 italic py-2 text-center bg-white/[0.01] rounded-lg border border-white/5">
          No previous calculations saved yet.
        </div>
      ) : (
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all text-xs group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="font-mono text-[10px] text-slate-500 shrink-0">
                  {item.dateFormatted}
                </span>
                <span className="font-medium text-slate-200 truncate">
                  {item.summary}
                </span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-400 shrink-0">
                    {item.badge}
                  </span>
                )}
              </div>

              <button
                onClick={() => onRestore(item.data)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white font-medium text-[11px] transition-colors shrink-0 group-hover:bg-purple-500/20 group-hover:text-purple-300"
                title="Restore this calculation"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restore</span>
                <ArrowUpRight className="w-2.5 h-2.5 opacity-70" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
