import { CheckCircle2, Zap, LayoutDashboard, Sparkles } from 'lucide-react';

export function WhyStudentTools() {
  const benefits = [
    {
      title: 'Accurate',
      description: 'Designed around clear academic calculations.',
      icon: CheckCircle2,
      accent: 'text-emerald-400',
      borderGlow: 'hover:border-emerald-500/40',
      badge: 'Zero Rounding Errors',
      detail: 'Standardized university formulas with support for multiple regional scales.',
    },
    {
      title: 'Fast',
      description: 'Get results instantly without unnecessary steps.',
      icon: Zap,
      accent: 'text-cyan-400',
      borderGlow: 'hover:border-cyan-500/40',
      badge: 'Immediate Execution',
      detail: 'Computes client-side with zero latency. No reload, no waiting.',
    },
    {
      title: 'Simple',
      description: 'Easy interfaces designed for students.',
      icon: LayoutDashboard,
      accent: 'text-indigo-400',
      borderGlow: 'hover:border-indigo-500/40',
      badge: 'Intuitive Workflow',
      detail: 'Built with keyboard shortcuts, instant resets, and clean tabular inputs.',
    },
    {
      title: 'Free',
      description: 'Core student tools are available without payment.',
      icon: Sparkles,
      accent: 'text-amber-400',
      borderGlow: 'hover:border-amber-500/40',
      badge: 'No Paywalls or Ads',
      detail: 'Accessible to all university and college students worldwide, forever.',
    },
  ];

  return (
    <section className="py-20 relative bg-white/[0.01] border-y border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-cyan-400 font-mono tracking-wider">
            <span>PLATFORM FOUNDATIONS</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>BUILT BY STUDENTS, FOR STUDENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight [text-wrap:balance]">
            Why Student Tools Hub
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Eliminate guesswork from your semester planning with utilities engineered for accuracy, speed, and peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className={`glass-panel rounded-2xl p-6 sm:p-7 border border-white/[0.08] ${b.borderGlow} transition-all duration-300 hover:-translate-y-1 space-y-4 text-left`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${b.accent}`} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-sm font-medium text-slate-200">
                    {b.description}
                  </p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/[0.06]">
                  {b.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
