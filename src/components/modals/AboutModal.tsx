import { X, Sparkles, Shield, Cpu, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 font-mono">
              <span>COMPANY & MISSION</span>
            </div>
            <h2 id="about-modal-title" className="text-2xl font-bold text-white font-display mt-0.5">
              About Student Tools Hub
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1 text-slate-300 text-sm leading-relaxed">
          <p>
            <strong className="text-white">Student Tools Hub</strong> was founded with a singular focus: to replace slow, ad-ridden, outdated educational calculators with a fast, modern, privacy-respecting technology platform for college and university students.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">Client-Side Tech</h3>
              <p className="text-xs text-slate-400">
                All computations run in your browser engine. Zero latency, instant results, and works smoothly even on weak campus Wi-Fi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">Absolute Privacy</h3>
              <p className="text-xs text-slate-400">
                Your grades, GPA numbers, and attendance records are never stored on external tracking servers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <Heart className="w-5 h-5 text-rose-400" />
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">100% Free</h3>
              <p className="text-xs text-slate-400">
                Maintained as a public academic utility. No subscriptions, popups, or paid walls.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineering Standards</span>
            </div>
            <p>
              We implement verified mathematical formulas calibrated against AACRAO (American Association of Collegiate Registrars and Admissions Officers), WES, and international higher education standards.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
