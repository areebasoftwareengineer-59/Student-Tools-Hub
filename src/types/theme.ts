export type ThemeId = 'violet' | 'cyan' | 'emerald' | 'amber' | 'crimson';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  bgBase: string;
  bgCard: string;
  accentHex: number;
  secondaryHex: number;
  coreOrbHex: number;
  coreEmissiveHex: number;
  rimHex: number;
  accentTailwind: string;
  borderTailwind: string;
  glowRgba: string;
  primaryGradient: string;
  previewColors: [string, string, string];
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  violet: {
    id: 'violet',
    name: 'Nebula Violet',
    subtitle: 'Cyberpunk Purple & Luminous Neon',
    bgBase: '#0c0517',
    bgCard: 'rgba(26, 11, 46, 0.65)',
    accentHex: 0xc084fc, // bright purple
    secondaryHex: 0x9333ea, // deep purple
    coreOrbHex: 0xf43f5e, // vibrant magenta
    coreEmissiveHex: 0xe879f9,
    rimHex: 0x7e22ce,
    accentTailwind: 'text-purple-400',
    borderTailwind: 'border-purple-500/30',
    glowRgba: 'rgba(192, 132, 252, 0.25)',
    primaryGradient: 'from-purple-500 via-fuchsia-400 to-pink-400',
    previewColors: ['#a855f7', '#ec4899', '#7e22ce'],
  },
  cyan: {
    id: 'cyan',
    name: 'Quantum Cyan',
    subtitle: 'Deep Space & Electric Teal',
    bgBase: '#050c16',
    bgCard: 'rgba(8, 28, 48, 0.65)',
    accentHex: 0x38bdf8,
    secondaryHex: 0x0284c7,
    coreOrbHex: 0x06b6d4,
    coreEmissiveHex: 0x38bdf8,
    rimHex: 0x0369a1,
    accentTailwind: 'text-cyan-400',
    borderTailwind: 'border-cyan-500/30',
    glowRgba: 'rgba(56, 189, 248, 0.25)',
    primaryGradient: 'from-cyan-400 via-sky-300 to-indigo-300',
    previewColors: ['#06b6d4', '#38bdf8', '#0284c7'],
  },
  emerald: {
    id: 'emerald',
    name: 'Matrix Emerald',
    subtitle: 'Bioluminescent Neon Mint',
    bgBase: '#04120c',
    bgCard: 'rgba(6, 36, 22, 0.65)',
    accentHex: 0x34d399,
    secondaryHex: 0x059669,
    coreOrbHex: 0x10b981,
    coreEmissiveHex: 0x6ee7b7,
    rimHex: 0x047857,
    accentTailwind: 'text-emerald-400',
    borderTailwind: 'border-emerald-500/30',
    glowRgba: 'rgba(52, 211, 153, 0.25)',
    primaryGradient: 'from-emerald-400 via-teal-300 to-cyan-300',
    previewColors: ['#10b981', '#34d399', '#059669'],
  },
  amber: {
    id: 'amber',
    name: 'Solar Flare',
    subtitle: 'Cosmic Gold & Warm Amber',
    bgBase: '#140c04',
    bgCard: 'rgba(38, 22, 8, 0.65)',
    accentHex: 0xfbbf24,
    secondaryHex: 0xd97706,
    coreOrbHex: 0xf59e0b,
    coreEmissiveHex: 0xfde68a,
    rimHex: 0xb45309,
    accentTailwind: 'text-amber-400',
    borderTailwind: 'border-amber-500/30',
    glowRgba: 'rgba(251, 191, 36, 0.25)',
    primaryGradient: 'from-amber-400 via-orange-300 to-rose-300',
    previewColors: ['#f59e0b', '#fbbf24', '#d97706'],
  },
  crimson: {
    id: 'crimson',
    name: 'Cyber Ruby',
    subtitle: 'High-Energy Crimson & Rose',
    bgBase: '#14040a',
    bgCard: 'rgba(40, 10, 20, 0.65)',
    accentHex: 0xf43f5e,
    secondaryHex: 0xe11d48,
    coreOrbHex: 0xfb7185,
    coreEmissiveHex: 0xfda4af,
    rimHex: 0xbe123c,
    accentTailwind: 'text-rose-400',
    borderTailwind: 'border-rose-500/30',
    glowRgba: 'rgba(244, 63, 94, 0.25)',
    primaryGradient: 'from-rose-400 via-pink-400 to-purple-400',
    previewColors: ['#f43f5e', '#fb7185', '#be123c'],
  },
};
