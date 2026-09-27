export interface RecentCalculation<T = unknown> {
  id: string;
  timestamp: number;
  dateFormatted: string;
  summary: string;
  badge: string;
  data: T;
}

const STORAGE_PREFIX = 'student_tools_history_';
const MAX_HISTORY = 5;

export function getRecentCalculations<T = unknown>(calcKey: string): RecentCalculation<T>[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${calcKey}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecentCalculation<T = unknown>(
  calcKey: string,
  summary: string,
  badge: string,
  data: T
): RecentCalculation<T>[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getRecentCalculations<T>(calcKey);

    // Format readable relative date or time
    const now = new Date();
    const dateFormatted = now.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newEntry: RecentCalculation<T> = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      dateFormatted,
      summary,
      badge,
      data,
    };

    // Filter out potential duplicate of exact same summary within 3 seconds
    const filtered = existing.filter((item) => item.summary !== summary || Date.now() - item.timestamp > 3000);

    const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(`${STORAGE_PREFIX}${calcKey}`, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearRecentCalculations(calcKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${calcKey}`);
  } catch {
    // Ignore storage errors
  }
}
