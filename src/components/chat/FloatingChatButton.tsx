import { Bot, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FloatingChatButtonProps {
  onClick: () => void;
}

export function FloatingChatButton({ onClick }: FloatingChatButtonProps) {
  const { theme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full text-white font-medium shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(20, 10, 36, 0.85)',
          boxShadow: `0 8px 30px -4px ${theme.previewColors[0]}66`,
        }}
        aria-label="Open Gemini AI Chatbot"
      >
        {/* Ambient pulsing ring */}
        <span
          className="absolute -inset-0.5 rounded-full blur-xs opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ backgroundColor: theme.previewColors[0] }}
        />

        <div className="relative flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center border shadow-xs"
            style={{
              backgroundColor: theme.previewColors[0],
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <Bot className="w-4 h-4 text-white" />
          </div>

          <span className="text-xs font-semibold tracking-wide font-display hidden sm:inline">
            Ask AI Advisor
          </span>

          <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
        </div>
      </button>
    </div>
  );
}
