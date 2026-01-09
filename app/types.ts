export interface Habit {
    id: string;
    name: string;
    color: string;
    cadence: number;
    createdAt: number;
}

export interface Completion {
    habitId: string;
    date: string;
}

export const HABIT_COLORS = {
    red: '#FF5E57',
    orange: '#FF8c42',
    yellow: '#FFD93D',
    green: '#6BCB77',
    blue: '#4D96FF',
    purple: '#6F42C1',
    pink: '#FF6CB7'
} as const;

export type HabitColor = keyof typeof HABIT_COLORS;
