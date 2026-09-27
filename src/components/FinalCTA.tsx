import { ArrowRight, Calculator } from 'lucide-react';

interface FinalCTAProps {
  onExploreTools: () => void;
  onOpenGPA: () => void;
}

export function FinalCTA({ onExploreTools, onOpenGPA }: FinalCTAProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* 3D-styled glowing ambient geometry */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle floating decorative ring in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[500px] h-[500px] rounded-full border border-cyan-400/40 animate-spin" style={{ animationDuration: '60s' }} />
        <div className="absolute w-[350px] h-[350px] rounded-full border border-dashed border-indigo-400/30 -rotate-45" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <span>INSTANT · PRIVATE · 100% FREE</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight [text-wrap:balance]">
          Ready to Make Student Life Easier?
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          Use our free academic tools and get your results in seconds.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreTools}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-slate-900 bg-cyan-400 rounded-xl hover:bg-cyan-300 transition-all duration-150 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenGPA}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>Calculate Your GPA Now</span>
          </button>
        </div>
      </div>
    </section>
  );
}
