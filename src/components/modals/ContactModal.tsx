import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback / Suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 font-mono">
              <span>GET IN TOUCH</span>
            </div>
            <h2 id="contact-modal-title" className="text-2xl font-bold text-white font-display mt-0.5">
              Contact Us
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

        <div className="overflow-y-auto py-5 flex-1 pr-1">
          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white font-display">Message Received!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thank you, {name}. Your note has been dispatched to our engineering team. We typically respond within 24 hours.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@university.edu"
                  className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Topic / Inquiring About</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Feedback / Suggestion" className="bg-slate-900">Feedback / Calculator Suggestion</option>
                  <option value="Report Calculation Discrepancy" className="bg-slate-900">Report a Calculation Issue</option>
                  <option value="Request Regional Grading Scale" className="bg-slate-900">Request Custom University Scale</option>
                  <option value="General Question" className="bg-slate-900">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what tool or feature you'd like to see, or any questions you have..."
                  className="w-full px-3 py-2 text-sm bg-slate-900/60 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
