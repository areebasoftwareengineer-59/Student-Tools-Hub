import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast, crisp progress update: 0 to 100 in ~600ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 200);
          return 100;
        }
        const increment = Math.floor(Math.random() * 25) + 18;
        return Math.min(100, prev + increment);
      });
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07050e]"
      aria-live="polite"
      aria-busy={progress < 100}
    >
      {/* Background ambient glow */}
      <div className="absolute w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center text-center px-4 max-w-sm">
        {/* Subtle geometric emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-12 h-12 mb-6 rounded-xl border border-purple-500/30 bg-purple-950/30 flex items-center justify-center shadow-lg shadow-purple-500/10"
        >
          <svg className="w-6 h-6 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-xl md:text-2xl font-bold tracking-[0.2em] text-white uppercase font-display mb-4"
        >
          Student Tools Hub
        </motion.h1>

        <div className="w-48 h-1 bg-slate-800/80 rounded-full overflow-hidden border border-white/5 relative">
          <div
            className="h-full bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>INITIALIZING</span>
          <span className="text-purple-400 font-semibold">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}
