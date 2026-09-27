import { useEffect, useState } from 'react';
import { Menu, X, Sparkles, Palette, Bot } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenTool: (tool: 'gpa' | 'cgpa' | 'percentage' | 'attendance' | 'grade') => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onScrollTo: (id: string) => void;
  onOpenChat: () => void;
}

export function Navbar({ onOpenTool, onOpenAbout, onOpenContact, onScrollTo, onOpenChat }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setIsThemePickerOpen } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onScrollTo(sectionId);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/30 py-3'
          : 'bg-transparent py-4 border-b border-transparent'
      }`}
      style={{
        backgroundColor: scrolled ? 'rgba(12, 6, 23, 0.88)' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-md group"
          >
            <div
              className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors shadow-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: theme.previewColors[0] + '55',
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: theme.previewColors[0] }} />
            </div>
            <span className="text-lg font-bold tracking-tight text-white font-display group-hover:text-slate-200 transition-colors">
              Student Tools Hub
            </span>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('hero')}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('popular-tools')}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              Tools
            </button>
            <button
              onClick={() => handleNavClick('guides')}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              Guides
            </button>
            <button
              onClick={onOpenAbout}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              About
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions + Theme Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Interactive Theme Trigger button */}
            <button
              onClick={() => setIsThemePickerOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-lg transition-all duration-150 group"
              title="Click to change theme aesthetic"
            >
              <span
                className="w-3 h-3 rounded-full border border-black/40 shadow-xs"
                style={{ backgroundColor: theme.previewColors[0] }}
              />
              <Palette className="w-3.5 h-3.5 text-slate-300 group-hover:text-white" />
              <span>Theme: {theme.name}</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-all shadow-xs active:scale-[0.98]"
              title="Open Gemini AI Chatbot"
            >
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={() => handleNavClick('popular-tools')}
              className="px-4 py-2 text-xs font-semibold text-slate-950 rounded-lg transition-all shadow-md whitespace-nowrap active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{
                backgroundColor: theme.previewColors[0],
                color: '#ffffff',
                boxShadow: `0 4px 14px 0 ${theme.previewColors[0]}44`,
              }}
            >
              Explore Tools
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsThemePickerOpen(true)}
              className="p-2 text-slate-300 hover:text-white rounded-lg border border-white/10"
              aria-label="Change theme"
            >
              <Palette className="w-4 h-4" style={{ color: theme.previewColors[0] }} />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-4 pb-6 mt-2 space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <button
            onClick={() => handleNavClick('hero')}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-slate-200 hover:bg-white/5 rounded-md"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('popular-tools')}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-slate-200 hover:bg-white/5 rounded-md"
          >
            Tools
          </button>
          <button
            onClick={() => handleNavClick('guides')}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-slate-200 hover:bg-white/5 rounded-md"
          >
            Guides
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAbout();
            }}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-slate-200 hover:bg-white/5 rounded-md"
          >
            About
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenContact();
            }}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-slate-200 hover:bg-white/5 rounded-md"
          >
            Contact
          </button>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsThemePickerOpen(true);
              }}
              className="w-full py-2 px-3 text-xs font-medium text-slate-200 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" style={{ color: theme.previewColors[0] }} />
                <span>Theme: {theme.name}</span>
              </span>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: theme.previewColors[0] }}
              />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-purple-200 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Ask Gemini AI Assistant</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick('popular-tools');
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white rounded-lg text-center shadow-md transition-colors"
              style={{
                backgroundColor: theme.previewColors[0],
                boxShadow: `0 4px 14px 0 ${theme.previewColors[0]}44`,
              }}
            >
              Explore Tools
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTool('gpa');
              }}
              className="w-full py-2 px-4 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded-lg text-center hover:bg-white/10 transition-colors"
            >
              Quick Calculate GPA
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
