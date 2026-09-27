import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 font-mono">
              {isPrivacy ? <Shield className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              <span>LEGAL INFORMATION</span>
            </div>
            <h2 id="legal-modal-title" className="text-2xl font-bold text-white font-display mt-0.5">
              {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
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

        <div className="overflow-y-auto py-5 space-y-4 flex-1 pr-1 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {isPrivacy ? (
            <>
              <p>
                <strong>Last Updated: January 2026</strong>
              </p>
              <p>
                At <strong>Student Tools Hub</strong>, user privacy is not an afterthought—it is baked into our client-side software architecture.
              </p>
              <h3 className="text-sm font-bold text-white font-display pt-2">1. Zero Academic Data Collection</h3>
              <p>
                We do not collect, transmit, or store course names, grades, GPA scores, attendance logs, or university affiliations on external database servers. All math operations execute strictly within your local web browser session.
              </p>
              <h3 className="text-sm font-bold text-white font-display pt-2">2. Local Browser Storage</h3>
              <p>
                Any preferences (such as selected grading scales or calculation states) remain strictly in ephemeral memory or your browser session.
              </p>
              <h3 className="text-sm font-bold text-white font-display pt-2">3. Cookies and Trackers</h3>
              <p>
                We do not deploy third-party advertising cookies, cross-site trackers, or data-broker beacons.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Last Updated: January 2026</strong>
              </p>
              <p>
                By using <strong>Student Tools Hub</strong>, you agree to these standard conditions of use.
              </p>
              <h3 className="text-sm font-bold text-white font-display pt-2">1. Educational Use</h3>
              <p>
                Student Tools Hub provides academic calculation estimates and planning utilities. While our algorithms strictly follow standard registrar formulas (e.g. standard 4.0, 4.33, 5.0, and CBSE 9.5 scales), official graduation standing, honors designations, and academic probations are solely determined by your accredited institution’s registrar.
              </p>
              <h3 className="text-sm font-bold text-white font-display pt-2">2. Intellectual Property</h3>
              <p>
                All UI code, branding, and proprietary interface designs belong to Student Tools Hub. You may freely use the tools for personal, collegiate, and study-group purposes.
              </p>
              <h3 className="text-sm font-bold text-white font-display pt-2">3. Disclaimer</h3>
              <p>
                Services are provided on an "as is" and "as available" basis without warranties of any kind.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
