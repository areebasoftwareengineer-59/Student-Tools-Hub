import { MousePointerClick, SlidersHorizontal, CheckCheck } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Choose a Tool',
      description: 'Select the calculator you need.',
      detail: 'Pick from GPA, CGPA, Percentage, Attendance, or Final Grade Target calculators based on your current academic need.',
      icon: MousePointerClick,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
    },
    {
      number: '02',
      title: 'Enter Your Information',
      description: 'Add your marks, credits, grades or attendance information.',
      detail: 'Type in credit hours, course letter grades, or class counts with live feedback and instant error validation.',
      icon: SlidersHorizontal,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
    },
    {
      number: '03',
      title: 'Get Your Result',
      description: 'Receive your calculation instantly.',
      detail: 'View your calculated metrics, academic honors standing, safe bunk estimates, or copy full summaries in one click.',
      icon: CheckCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-cyan-400 font-mono tracking-wider">
            <span>THREE SIMPLE STEPS</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>FRICTIONLESS WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight [text-wrap:balance]">
            How It Works
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            No accounts to create, no ads to dismiss. Get mathematically accurate academic answers in under thirty seconds.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative">
          {/* Subtle connecting line across desktop */}
          <div className="hidden lg:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-emerald-500/20 -translate-y-6 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="glass-panel rounded-2xl p-7 border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 space-y-5 text-left flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${step.color}`} />
                      </div>
                      <span className="text-2xl font-extrabold font-mono text-slate-600">
                        {step.number}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white font-display">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        {step.description}
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Real-time calculation</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
