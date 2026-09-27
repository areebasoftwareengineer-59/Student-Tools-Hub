import { Calculator, Award, Percent, CalendarCheck, Target, ArrowRight } from 'lucide-react';
import { CalculatorType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PopularToolsProps {
  onOpenTool: (tool: NonNullable<CalculatorType>) => void;
}

export function PopularTools({ onOpenTool }: PopularToolsProps) {
  const { theme } = useTheme();

  const tools = [
    {
      id: 'gpa' as const,
      title: 'GPA Calculator',
      description: 'Calculate your semester GPA quickly and accurately across standard 4.0, 4.33, 5.0, or 10.0 scale.',
      buttonText: 'Calculate GPA',
      icon: Award,
      accentColor: 'from-purple-500/20 to-purple-500/5',
      borderColor: 'group-hover:border-purple-400/40',
      iconColor: 'text-purple-400',
      glowColor: 'group-hover:shadow-purple-500/15',
      tag: 'Semester Analysis',
    },
    {
      id: 'cgpa' as const,
      title: 'CGPA Calculator',
      description: 'Calculate your cumulative GPA across multiple semesters and forecast required grades for graduation honors.',
      buttonText: 'Calculate CGPA',
      icon: Calculator,
      accentColor: 'from-fuchsia-500/20 to-fuchsia-500/5',
      borderColor: 'group-hover:border-fuchsia-400/40',
      iconColor: 'text-fuchsia-400',
      glowColor: 'group-hover:shadow-fuchsia-500/15',
      tag: 'Cumulative Multi-Term',
    },
    {
      id: 'percentage' as const,
      title: 'Percentage Calculator',
      description: 'Calculate marks percentage instantly and convert between percentage scores and 4.0 or 10.0 GPA scales.',
      buttonText: 'Calculate Percentage',
      icon: Percent,
      accentColor: 'from-cyan-500/20 to-cyan-500/5',
      borderColor: 'group-hover:border-cyan-400/40',
      iconColor: 'text-cyan-400',
      glowColor: 'group-hover:shadow-cyan-500/15',
      tag: 'Marks & Conversions',
    },
    {
      id: 'attendance' as const,
      title: 'Attendance Calculator',
      description: 'Calculate attendance percentage and understand how many classes you can miss or need to attend.',
      buttonText: 'Calculate Attendance',
      icon: CalendarCheck,
      accentColor: 'from-teal-500/20 to-teal-500/5',
      borderColor: 'group-hover:border-teal-400/40',
      iconColor: 'text-teal-400',
      glowColor: 'group-hover:shadow-teal-500/15',
      tag: 'Safe Bunks & Minimum %',
    },
    {
      id: 'grade' as const,
      title: 'Grade Calculator',
      description: 'Calculate your final grade from assignments, quizzes, midterms and exams, and target needed scores.',
      buttonText: 'Calculate Grade',
      icon: Target,
      accentColor: 'from-amber-500/20 to-amber-500/5',
      borderColor: 'group-hover:border-amber-400/40',
      iconColor: 'text-amber-400',
      glowColor: 'group-hover:shadow-amber-500/15',
      tag: 'Final Target Assessment',
    },
  ];

  return (
    <section id="popular-tools" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold font-mono tracking-wider">
            <span style={{ color: theme.previewColors[0] }}>CORE COMPUTATION SUITE</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">INSTANT CLIENT-SIDE EXECUTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight [text-wrap:balance]">
            Popular Academic Calculators
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Free, mathematically verified utilities built to keep your university and college milestones on track.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                className={`group relative rounded-2xl glass-panel p-6 sm:p-7 border border-white/[0.08] ${tool.borderColor} transition-all duration-300 hover:-translate-y-1 shadow-lg ${tool.glowColor} flex flex-col justify-between`}
              >
                {/* Subtle gradient card background */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.accentColor} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <IconComponent className={`w-6 h-6 ${tool.iconColor}`} />
                    </div>
                    <span className="text-xs font-mono text-slate-500">{tool.tag}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-display tracking-tight group-hover:text-slate-100 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 pt-6 mt-4 border-t border-white/[0.06]">
                  <button
                    onClick={() => onOpenTool(tool.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-white/[0.05] hover:bg-white/[0.15] border border-white/10 rounded-xl transition-all duration-200 active:scale-[0.98] whitespace-nowrap shadow-sm group-hover:border-white/30"
                  >
                    <span>{tool.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Quick Launchpad Teaser Card */}
          <div className="rounded-2xl glass-panel p-6 sm:p-7 border border-dashed border-white/15 flex flex-col justify-between text-left bg-white/[0.02]">
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-500">SUGGEST A TOOL</div>
              <h3 className="text-xl font-bold text-white font-display">Need Another Calculator?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Have a specific grading formula or curriculum rule at your institution? Let our engineering team know and we'll add it to the hub.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-white/[0.06]">
              <a
                href="#guides"
                className="inline-flex items-center gap-2 text-xs font-medium hover:underline transition-colors"
                style={{ color: theme.previewColors[0] }}
              >
                <span>Browse our calculation guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
