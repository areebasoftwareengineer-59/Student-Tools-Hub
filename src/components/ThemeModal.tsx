import { X, Check, Palette, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { THEMES, ThemeId } from '../types/theme';

export function ThemeModal() {
  const { themeId, setThemeId, isThemePickerOpen, setIsThemePickerOpen } = useTheme();

  if (!isThemePickerOpen) return null;

  const handleSelect = (id: ThemeId) => {
    setThemeId(id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
    >
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 font-mono tracking-wider">
              <Palette className="w-3.5 h-3.5" />
              <span>EXPERIENCE CUSTOMIZER</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Instant Switch</span>
            </div>
            <h2 id="theme-modal-title" className="text-2xl font-bold text-white font-display">
              Choose Your Theme
            </h2>
            <p className="text-xs text-slate-300">
              Personalize your workspace aesthetic. Automatically adjusts the 3D scene, neon glows, and interface components.
            </p>
          </div>
          <button
            onClick={() => setIsThemePickerOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="overflow-y-auto py-5 space-y-3 flex-1 pr-1">
          {Object.values(THEMES).map((t) => {
            const isSelected = themeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 border flex items-center justify-between group ${
                  isSelected
                    ? 'bg-white/[0.08] border-white/40 shadow-lg ring-1 ring-white/20'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Swatch circle preview */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center p-0.5 border border-white/20 shadow-md relative overflow-hidden"
                    style={{ backgroundColor: t.bgBase }}
                  >
                    <div
                      className="w-full h-full rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${t.previewColors[0]}, ${t.previewColors[1]})`,
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-40 blur-xs"
                      style={{ backgroundColor: t.previewColors[0] }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white font-display">
                        {t.name}
                      </span>
                      {t.id === 'violet' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{t.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    {t.previewColors.map((color, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-purple-500 border-purple-400 text-white'
                        : 'border-white/20 text-transparent group-hover:border-white/40'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Saved automatically for your future visits.</span>
          </div>
          <button
            onClick={() => setIsThemePickerOpen(false)}
            className="px-6 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-200 rounded-lg transition-colors shadow-md"
          >
            Apply & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
