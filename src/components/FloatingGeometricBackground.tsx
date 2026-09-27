import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface ShapeConfig {
  id: string;
  type: 'circle' | 'square' | 'triangle' | 'hexagon';
  size: number;
  initialX: number; // percentage of viewport width
  initialY: number; // percentage of viewport height
  targetXDelta: number; // pixels to float
  targetYDelta: number;
  rotateDelta: number;
  duration: number;
  delay: number;
  opacity: number;
  colorIndex: 0 | 1 | 2;
}

export function FloatingGeometricBackground() {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  // Curated, performance-optimized set of 12 subtle floating shapes
  const shapes: ShapeConfig[] = useMemo(
    () => [
      {
        id: 'shape-1',
        type: 'hexagon',
        size: 56,
        initialX: 8,
        initialY: 14,
        targetXDelta: 24,
        targetYDelta: -30,
        rotateDelta: 45,
        duration: 18,
        delay: 0,
        opacity: 0.16,
        colorIndex: 0,
      },
      {
        id: 'shape-2',
        type: 'circle',
        size: 72,
        initialX: 88,
        initialY: 18,
        targetXDelta: -28,
        targetYDelta: 35,
        rotateDelta: 0,
        duration: 22,
        delay: 1,
        opacity: 0.14,
        colorIndex: 1,
      },
      {
        id: 'shape-3',
        type: 'triangle',
        size: 44,
        initialX: 20,
        initialY: 38,
        targetXDelta: -20,
        targetYDelta: 25,
        rotateDelta: -60,
        duration: 16,
        delay: 2,
        opacity: 0.15,
        colorIndex: 0,
      },
      {
        id: 'shape-4',
        type: 'square',
        size: 40,
        initialX: 82,
        initialY: 45,
        targetXDelta: 30,
        targetYDelta: -22,
        rotateDelta: 90,
        duration: 20,
        delay: 0.5,
        opacity: 0.18,
        colorIndex: 1,
      },
      {
        id: 'shape-5',
        type: 'circle',
        size: 36,
        initialX: 12,
        initialY: 62,
        targetXDelta: 18,
        targetYDelta: -20,
        rotateDelta: 0,
        duration: 15,
        delay: 1.5,
        opacity: 0.14,
        colorIndex: 2,
      },
      {
        id: 'shape-6',
        type: 'triangle',
        size: 52,
        initialX: 92,
        initialY: 72,
        targetXDelta: -25,
        targetYDelta: -30,
        rotateDelta: 120,
        duration: 24,
        delay: 3,
        opacity: 0.15,
        colorIndex: 0,
      },
      {
        id: 'shape-7',
        type: 'square',
        size: 48,
        initialX: 32,
        initialY: 82,
        targetXDelta: -20,
        targetYDelta: 20,
        rotateDelta: -45,
        duration: 19,
        delay: 2.2,
        opacity: 0.12,
        colorIndex: 1,
      },
      {
        id: 'shape-8',
        type: 'hexagon',
        size: 64,
        initialX: 74,
        initialY: 88,
        targetXDelta: 22,
        targetYDelta: -25,
        rotateDelta: 60,
        duration: 21,
        delay: 0.8,
        opacity: 0.14,
        colorIndex: 0,
      },
      {
        id: 'shape-9',
        type: 'triangle',
        size: 38,
        initialX: 48,
        initialY: 24,
        targetXDelta: 15,
        targetYDelta: 18,
        rotateDelta: 40,
        duration: 17,
        delay: 1.2,
        opacity: 0.12,
        colorIndex: 2,
      },
      {
        id: 'shape-10',
        type: 'circle',
        size: 80,
        initialX: 4,
        initialY: 88,
        targetXDelta: 20,
        targetYDelta: -18,
        rotateDelta: 0,
        duration: 25,
        delay: 0.3,
        opacity: 0.1,
        colorIndex: 0,
      },
      {
        id: 'shape-11',
        type: 'square',
        size: 32,
        initialX: 62,
        initialY: 10,
        targetXDelta: -16,
        targetYDelta: 22,
        rotateDelta: 75,
        duration: 16,
        delay: 2.5,
        opacity: 0.16,
        colorIndex: 1,
      },
      {
        id: 'shape-12',
        type: 'hexagon',
        size: 42,
        initialX: 55,
        initialY: 70,
        targetXDelta: 18,
        targetYDelta: -15,
        rotateDelta: -30,
        duration: 20,
        delay: 1.8,
        opacity: 0.12,
        colorIndex: 0,
      },
    ],
    []
  );

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {shapes.map((s) => {
        const color = theme.previewColors[s.colorIndex] || theme.previewColors[0];

        return (
          <motion.div
            key={s.id}
            className="absolute will-change-transform"
            style={{
              left: `${s.initialX}%`,
              top: `${s.initialY}%`,
              width: s.size,
              height: s.size,
            }}
            initial={{
              x: 0,
              y: 0,
              rotate: 0,
              opacity: s.opacity,
            }}
            animate={
              shouldReduceMotion
                ? { opacity: s.opacity }
                : {
                    x: [0, s.targetXDelta, 0],
                    y: [0, s.targetYDelta, 0],
                    rotate: [0, s.rotateDelta, 0],
                    opacity: [s.opacity, s.opacity * 1.5, s.opacity],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: s.duration,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: s.delay,
                  }
            }
          >
            {s.type === 'circle' && (
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  stroke={color}
                  strokeWidth="1.5"
                  fill={`${color}15`}
                />
              </svg>
            )}

            {s.type === 'square' && (
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                <rect
                  x="15"
                  y="15"
                  width="70"
                  height="70"
                  rx="14"
                  stroke={color}
                  strokeWidth="2"
                  fill={`${color}12`}
                />
                <rect
                  x="32"
                  y="32"
                  width="36"
                  height="36"
                  rx="6"
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.6"
                />
              </svg>
            )}

            {s.type === 'triangle' && (
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                <polygon
                  points="50,10 90,85 10,85"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  fill={`${color}10`}
                />
                <polygon
                  points="50,35 72,75 28,75"
                  stroke={color}
                  strokeWidth="1"
                  strokeLinejoin="round"
                  opacity="0.5"
                />
              </svg>
            )}

            {s.type === 'hexagon' && (
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                <polygon
                  points="50,5 89,27 89,73 50,95 11,73 11,27"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  fill={`${color}0e`}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="12"
                  fill={color}
                  opacity="0.4"
                />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
