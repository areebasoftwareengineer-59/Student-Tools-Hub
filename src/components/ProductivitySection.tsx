import { Timer, Clock, Calendar, CheckSquare } from 'lucide-react';

export function ProductivitySection() {
  const upcomingTools = [
    {
      title: 'Study Timer',
      description: 'Customizable Pomodoro cycles and deep focus sessions calibrated to student revision blocks.',
      icon: Timer,
      specs: '25/5 & 50/10 intervals · Ambient sound generator · Break notifications',
    },
    {
      title: 'Exam Countdown',
      description: 'Track days, hours, and remaining study preparation time for all your upcoming midterms and finals.',
      icon: Clock,
      specs: 'Syllabus chapter pacing · Priority alerts · Multi-course dashboard',
    },
    {
      title: 'Semester Planner',
      description: 'Organize course schedules, exam dates, lecture slots, and semester milestones in a unified timetable.',
      icon: Calendar,
      specs: 'Credit workload balancer · Weekly schedule view · Academic calendar sync',
    },
    {
      title: 'Assignment Tracker',
      description: 'Keep track of assignment deadlines, weighted project deliverables, and group submission statuses.',
      icon: CheckSquare,
      specs: 'Grade weight impact · Urgency sorting · Progress checklists',
    },
  ];

  return (
    <section className="py-20 relative bg-white/[0.015] border-y border-white/[0.05]">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-400 font-mono tracking-wider">
            <span>EXPANDING PRODUCTIVITY SUITE</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>NEXT GENERATION CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight [text-wrap:balance]">
            More Than Just Calculators
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            We're building a growing collection of tools designed to make student life simpler and more organized.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.title}
                className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/[0.08] hover:border-indigo-400/30 transition-all duration-300 space-y-4 text-left flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                      Coming Soon
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      {tool.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-400 leading-normal">
                  <strong className="text-slate-300 font-medium">Features planned:</strong> {tool.specs}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
