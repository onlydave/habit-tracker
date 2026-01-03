export interface Habit {
  id: string;
  name: string;
  color: string; // CSS variable name or hex
  cadence: number; // Every X days
  createdAt: number; // Timestamp
}

export interface Completion {
  habitId: string;
  date: string; // YYYY-MM-DD
}

export type HabitColor =
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'slate' | 'silver' | 'brown';

export const HABIT_COLORS: Record<HabitColor, string> = {
  blue: 'var(--habit-blue)',
  indigo: 'var(--habit-indigo)',
  violet: 'var(--habit-violet)',
  purple: 'var(--habit-purple)',
  fuchsia: 'var(--habit-fuchsia)',
  pink: 'var(--habit-pink)',
  rose: 'var(--habit-rose)',
  red: 'var(--habit-red)',
  orange: 'var(--habit-orange)',
  amber: 'var(--habit-amber)',
  yellow: 'var(--habit-yellow)',
  lime: 'var(--habit-lime)',
  green: 'var(--habit-green)',
  emerald: 'var(--habit-emerald)',
  teal: 'var(--habit-teal)',
  cyan: 'var(--habit-cyan)',
  sky: 'var(--habit-sky)',
  slate: 'var(--habit-slate)',
  silver: 'var(--habit-silver)',
  brown: 'var(--habit-brown)',
};
