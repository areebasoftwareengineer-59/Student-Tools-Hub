import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  RefreshCw,
  Zap,
  GraduationCap,
  BrainCircuit,
  MessageSquare,
  AlertCircle,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export type ChatRole = 'advisor' | 'speed_tutor' | 'stem_solver';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  modelUsed?: string;
}

interface GeminiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'student_tools_gemini_chat_history_v1';

const ROLE_CONFIGS: Record<
  ChatRole,
  {
    name: string;
    description: string;
    model: 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }
> = {
  advisor: {
    name: 'Academic Advisor',
    description: 'General student guidance, GPA targets & degree planning',
    model: 'gemini-3.5-flash',
    badge: 'General Tasks (gemini-3.5-flash)',
    icon: GraduationCap,
    accentColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  },
  speed_tutor: {
    name: 'Speed Tutor',
    description: 'Instant definitions, fast formulas & rapid Q&A',
    model: 'gemini-3.1-flash-lite',
    badge: 'Fast Tasks (gemini-3.1-flash-lite)',
    icon: Zap,
    accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  stem_solver: {
    name: 'STEM & Math Solver',
    description: 'Multi-step calculus, proofs, statistics & reasoning',
    model: 'gemini-3.1-pro-preview',
    badge: 'Complex Tasks (gemini-3.1-pro-preview)',
    icon: BrainCircuit,
    accentColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
};

const SUGGESTIONS = [
  'How is semester GPA calculated from credit hours?',
  'I have 32/40 attendance. Can I miss 2 more classes if 75% is required?',
  'How do I calculate what grade I need on a final exam worth 35%?',
  'Explain the difference between a 4.0 and a 10.0 grading scale.',
];

export function GeminiChatbotModal({ isOpen, onClose }: GeminiChatbotModalProps) {
  const { theme } = useTheme();
  const [selectedRole, setSelectedRole] = useState<ChatRole>('advisor');
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore parse error
    }
    return [
      {
        id: 'welcome-1',
        role: 'model',
        content:
          "👋 Hi! I'm your **Student Tools Hub AI Assistant**, powered by Gemini. You can ask me anything about your GPA, CGPA forecasting, attendance criteria, marks conversion, or step-by-step math calculations.\n\nChoose a role above to tailor my answers to your needs!",
        timestamp: Date.now(),
        modelUsed: 'gemini-3.5-flash',
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isSending]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentRoleConfig = ROLE_CONFIGS[selectedRole];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isSending) return;

    setErrorMessage(null);
    setInput('');

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsSending(true);

    try {
      // Send conversation history to server proxy endpoint
      const payload = {
        messages: newHistory.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        role: selectedRole,
        model: currentRoleConfig.model,
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const modelMessage: ChatMessage = {
        id: `${Date.now()}-model`,
        role: 'model',
        content: data.reply || 'No response generated.',
        timestamp: Date.now(),
        modelUsed: data.model || currentRoleConfig.model,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Chat send failed:', err);
      setErrorMessage(
        err.message || 'Unable to connect to the Gemini chatbot. Please verify the server setup.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleClearHistory = () => {
    const welcome: ChatMessage = {
      id: `${Date.now()}-welcome`,
      role: 'model',
      content:
        '✨ Conversation history cleared. How can I assist you with your academic goals today?',
      timestamp: Date.now(),
      modelUsed: currentRoleConfig.model,
    };
    setMessages([welcome]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chatbot-title"
    >
      <div
        className={`relative w-full glass-panel rounded-2xl border border-white/10 shadow-2xl flex flex-col transition-all duration-300 ${
          isExpanded ? 'max-w-5xl h-[92vh]' : 'max-w-3xl h-[85vh] max-h-[780px]'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border flex items-center justify-center shadow-md relative"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: theme.previewColors[0] + '66',
              }}
            >
              <Bot className="w-5 h-5" style={{ color: theme.previewColors[0] }} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 id="chatbot-title" className="text-lg font-bold text-white font-display">
                  Gemini Academic Assistant
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/5 border border-white/10 text-slate-300">
                  AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                Multi-turn conversation advisor powered by Google Gemini models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearHistory}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors"
              title="Clear conversation history"
              aria-label="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors hidden sm:block"
              title={isExpanded ? 'Collapse' : 'Expand'}
              aria-label={isExpanded ? 'Collapse dialog' : 'Expand dialog'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Selector Tabs with Model Badges */}
        <div className="p-3 border-b border-white/[0.06] bg-black/20 shrink-0">
          <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between px-1">
            <span>SELECT SPECIALIZED AI ROLE:</span>
            <span className="text-[10px] text-purple-400 font-semibold">
              Active: {currentRoleConfig.model}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(Object.keys(ROLE_CONFIGS) as ChatRole[]).map((roleKey) => {
              const cfg = ROLE_CONFIGS[roleKey];
              const isSelected = selectedRole === roleKey;
              const Icon = cfg.icon;

              return (
                <button
                  key={roleKey}
                  onClick={() => setSelectedRole(roleKey)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-white/[0.08] border-white/30 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected ? cfg.accentColor : 'border-white/10 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="overflow-hidden">
                    <div className="font-semibold text-white truncate">{cfg.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{cfg.model}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-left ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 shadow-sm"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: theme.previewColors[0] + '55',
                    }}
                  >
                    <Bot className="w-4 h-4" style={{ color: theme.previewColors[0] }} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-white/10 text-white border border-white/15 rounded-tr-xs'
                      : 'bg-slate-900/80 text-slate-200 border border-white/10 rounded-tl-xs'
                  }`}
                >
                  {/* Message body with Markdown style rendering */}
                  <div className="whitespace-pre-wrap break-words space-y-2">
                    {msg.content}
                  </div>

                  <div className="mt-2 pt-1 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {!isUser && msg.modelUsed && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-white mt-0.5">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {isSending && (
            <div className="flex gap-3 text-left justify-start animate-in fade-in duration-150">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: theme.previewColors[0] + '55',
                }}
              >
                <Bot className="w-4 h-4" style={{ color: theme.previewColors[0] }} />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 rounded-tl-xs flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {currentRoleConfig.name} is thinking...
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-rose-300">Chatbot Notice</div>
                <div>{errorMessage}</div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white text-xs underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-black/10 border-t border-white/[0.04] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 shrink-0">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-300 hover:text-white transition-colors shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-950/50 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${currentRoleConfig.name} about GPA, grading, calculus, or attendance...`}
                rows={2}
                disabled={isSending}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none transition-all disabled:opacity-50"
              />
              <span className="absolute bottom-2 right-2.5 text-[10px] font-mono text-slate-600 hidden sm:inline">
                Shift + Enter for new line
              </span>
            </div>

            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="p-3 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-40 disabled:hover:bg-purple-500 text-white font-medium transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              style={{
                backgroundColor: theme.previewColors[0],
              }}
              title="Send message"
              aria-label="Send message"
            >
              {isSending ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Multi-turn memory active</span>
            </span>
            <span className="font-mono text-[10px]">
              Role: {currentRoleConfig.name} ({currentRoleConfig.model})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
