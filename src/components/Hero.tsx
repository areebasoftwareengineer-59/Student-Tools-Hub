import { ArrowRight, Calculator, CheckCircle2, Zap, ShieldCheck, Palette } from 'lucide-react';
import { ThreeHeroScene } from './ThreeHeroScene';
import { useTheme } from '../context/ThemeContext';
import { THEMES, ThemeId } from '../types/theme';

interface HeroProps {
  onExploreTools: () => void;
  onCalculateGPA: () => void;
}

export function Hero({ onExploreTools, onCalculateGPA }: HeroProps) {
  const { theme, themeId, setThemeId, setIsThemePickerOpen } = useTheme();

  return (
    <section id="hero" className="relative min-h-[94vh] flex items-center pt-28 pb-16 overflow-hidden">
      {/* Dynamic Ambient Background Glow reflecting selected theme */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full blur-[100px] pointer-events-none transition-all duration-700 opacity-60"
        style={{
          background: `radial-gradient(circle, ${theme.glowRgba} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-16 right-10 w-96 h-96 rounded-full blur-[90px] pointer-events-none transition-all duration-700 opacity-40"
        style={{
          background: `radial-gradient(circle, ${theme.previewColors[1]}33 0%, transparent 75%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & Controls */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Quick Interactive Theme Bar ("Choose your theme") */}
            <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setIsThemePickerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white hover:bg-white/10 transition-colors"
              >
                <Palette className="w-3.5 h-3.5" style={{ color: theme.previewColors[0] }} />
                <span>Select Theme:</span>
              </button>

              <div className="flex items-center gap-1.5 pr-1.5">
                {(Object.keys(THEMES) as ThemeId[]).map((id) => {
                  const t = THEMES[id];
                  const isCurrent = themeId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setThemeId(id)}
                      className={`relative p-1 rounded-full transition-transform ${
                        isCurrent ? 'scale-110 ring-2 ring-white/60' : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                      title={t.name}
                      aria-label={`Switch to ${t.name} theme`}
                    >
                      <span
                        className="block w-4 h-4 rounded-full border border-black/50"
                        style={{ backgroundColor: t.previewColors[0] }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] font-display [text-wrap:balance]">
              Smart Tools for{' '}
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r transition-all duration-500"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme.previewColors[0]}, ${theme.previewColors[1]}, #ffffff)`,
                }}
              >
                Smarter Students
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
              Calculate your GPA, CGPA, percentage, grades and attendance instantly with simple, accurate and free student tools.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreTools}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 shadow-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                style={{
                  backgroundColor: theme.previewColors[0],
                  boxShadow: `0 8px 24px -4px ${theme.previewColors[0]}66`,
                }}
              >
                <span>Explore Tools</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onCalculateGPA}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl hover:border-white/20 transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <Calculator className="w-4 h-4" style={{ color: theme.previewColors[0] }} />
                <span>Calculate GPA</span>
              </button>
            </div>

            {/* Trust-style message: Free • Fast • Easy to Use */}
            <div className="pt-4 flex items-center gap-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-medium">Free</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 shrink-0" style={{ color: theme.previewColors[0] }} />
                <span className="text-slate-300 font-medium">Fast</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-300 font-medium">Easy to Use</span>
              </div>
            </div>

            {/* Micro-Metrics strip with theme touch */}
            <div className="pt-6 border-t border-white/[0.08] grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-2xl font-bold text-white font-mono tabular-nums">5+</div>
                <div className="text-xs text-slate-400">Core Calculators</div>
              </div>
              <div>
                <div
                  className="text-2xl font-bold font-mono tabular-nums"
                  style={{ color: theme.previewColors[0] }}
                >
                  100%
                </div>
                <div className="text-xs text-slate-400">Mathematical Precision</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">0s</div>
                <div className="text-xs text-slate-400">Sign-up Required</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Visual with sculpted rings matching user image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient halo behind 3D */}
            <div
              className="absolute inset-0 rounded-full blur-[80px] pointer-events-none transition-all duration-700"
              style={{
                background: `radial-gradient(circle, ${theme.previewColors[0]}33 0%, transparent 70%)`,
              }}
            />

            <div className="w-full relative aspect-square max-w-[460px] lg:max-w-none">
              <ThreeHeroScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
