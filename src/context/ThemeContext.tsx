import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeId, THEMES, ThemeConfig } from '../types/theme';

interface ThemeContextType {
  themeId: ThemeId;
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
  isThemePickerOpen: boolean;
  setIsThemePickerOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'student_tools_theme_v2';
const FIRST_VISIT_KEY = 'student_tools_theme_selected';

function getInitialTheme(): ThemeId {
  if (typeof window === 'undefined') return 'violet';

  // 1. Check if user already has a saved manual preference from previous visits
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId;
    if (saved && THEMES[saved]) {
      return saved;
    }
  } catch {
    // localStorage might be unavailable in restricted environments
  }

  // 2. First visit: detect system preference using window.matchMedia('(prefers-color-scheme: dark)')
  try {
    if (window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      // If dark mode is preferred, default to 'violet' (flagship dark cyber-purple); otherwise 'cyan'
      return prefersDark ? 'violet' : 'cyan';
    }
  } catch {
    // Fallback if matchMedia is not supported
  }

  return 'violet';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(getInitialTheme);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  // Automatically track live system preference changes on first visit IF no manual selection has been saved
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    try {
      const hasManualChoice = !!localStorage.getItem(STORAGE_KEY);
      if (hasManualChoice) return;

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        const stillNoManualChoice = !localStorage.getItem(STORAGE_KEY);
        if (stillNoManualChoice) {
          setThemeIdState(e.matches ? 'violet' : 'cyan');
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else if ('addListener' in mediaQuery) {
        // Fallback for older Safari browsers
        const mqWithListener = mediaQuery as unknown as {
          addListener: (cb: (e: MediaQueryListEvent) => void) => void;
          removeListener: (cb: (e: MediaQueryListEvent) => void) => void;
        };
        mqWithListener.addListener(handleSystemThemeChange);
        return () => mqWithListener.removeListener(handleSystemThemeChange);
      }
    } catch {
      // Ignore if matchMedia listener fails
    }
  }, []);

  // Check if first visit to prompt theme selection if desired
  useEffect(() => {
    try {
      const hasChosen = localStorage.getItem(FIRST_VISIT_KEY);
      if (!hasChosen) {
        // Delay slightly after initial load so user can decide their theme
        const timer = setTimeout(() => {
          setIsThemePickerOpen(true);
        }, 900);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
      localStorage.setItem(FIRST_VISIT_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
  };

  const currentTheme = THEMES[themeId] || THEMES.violet;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeId);
    root.style.setProperty('--color-bg-base', currentTheme.bgBase);
    root.style.setProperty('--color-glow-primary', currentTheme.glowRgba);
    document.body.style.backgroundColor = currentTheme.bgBase;
  }, [themeId, currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme: currentTheme,
        setThemeId,
        isThemePickerOpen,
        setIsThemePickerOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
