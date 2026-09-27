import { Sparkles, Heart } from 'lucide-react';
import { CalculatorType } from '../types';

interface FooterProps {
  onOpenTool: (tool: NonNullable<CalculatorType>) => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
  onScrollTo: (id: string) => void;
}

export function Footer({
  onOpenTool,
  onOpenAbout,
  onOpenContact,
  onOpenLegal,
  onScrollTo,
}: FooterProps) {
  return (
    <footer className="bg-[#05070a] border-t border-white/[0.08] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Student Tools Hub
              </span>
            </div>

            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
              Free academic calculators and productivity tools for students. Built with mathematical precision and client-side privacy.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
              <span>for collegiate scholars worldwide</span>
            </div>
          </div>

          {/* Tools Column */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Tools
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onOpenTool('gpa')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  GPA Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenTool('cgpa')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  CGPA Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenTool('percentage')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Percentage Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenTool('attendance')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Attendance Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenTool('grade')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Grade Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Company Column */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onScrollTo('guides')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Student Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('faq')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  FAQ
                </button>
              </li>
            </ul>

            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono pt-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Terms
                </button>
              </li>
            </ul>

            <div className="pt-6">
              <div className="text-xs text-slate-500 font-mono">
                System Status
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Calculators Functional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Student Tools Hub. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Free Academic Suite</span>
            <span aria-hidden="true">·</span>
            <span>Version 2026.1</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-400"
            >
              No Ads · No Tracking
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
