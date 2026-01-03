import { format, subDays, eachDayOfInterval, parseISO } from 'date-fns';

export const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
};

export const getHistoryRange = (days: number): Date[] => {
    const end = new Date();
    const start = subDays(end, days - 1);
    return eachDayOfInterval({ start, end });
};

export const isHabitCompletedOnDate = (
    habitId: string,
    date: string,
    completions: { habitId: string; date: string }[]
): boolean => {
    return completions.some(c => c.habitId === habitId && c.date === date);
};

export const shouldHabitBeActive = (
    habitCreatedAt: number,
    checkDate: string
): boolean => {
    const start = new Date(habitCreatedAt);
    start.setHours(0, 0, 0, 0);
    const current = parseISO(checkDate);
    current.setHours(0, 0, 0, 0);

    return current.getTime() >= start.getTime();
};

export const getDaysUntilNextDue = (
    habitId: string,
    cadence: number,
    checkDate: string,
    completions: { habitId: string; date: string }[]
): number | null => {
    if (cadence <= 1) return null;

    const current = parseISO(checkDate);
    const habitCompletions = completions
        .filter(c => c.habitId === habitId)
        .map(c => parseISO(c.date))
        .sort((a, b) => b.getTime() - a.getTime());

    // Only show countdown/star if the habit has been completed at least once in the past
    const lastCompletion = habitCompletions.find(c => c.getTime() < current.getTime());
    if (!lastCompletion) return null;

    const diffTime = current.getTime() - lastCompletion.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If it's the exact day it's due, return 0 (Star)
    if (diffDays === cadence) return 0;

    // If it's PAST the due day, show nothing (unselected)
    if (diffDays > cadence) return null;

    // Otherwise show countdown
    return cadence - diffDays;
};

export const getStreakForDate = (
    habitId: string,
    checkDate: string,
    completions: { habitId: string; date: string }[]
): number => {
    const habitCompletions = completions
        .filter(c => c.habitId === habitId)
        .map(c => c.date)
        .sort((a, b) => b.localeCompare(a)); // Newest first

    if (habitCompletions.length === 0) return 0;

    let streak = 0;
    let current = parseISO(checkDate);

    // If the checkDate itself is completed, start counting
    const isCompleted = (d: string) => habitCompletions.includes(d);

    while (isCompleted(formatDate(current))) {
        streak++;
        current = subDays(current, 1);
    }

    return streak;
};
