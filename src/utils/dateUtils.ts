import { format, subDays, eachDayOfInterval, parseISO, isSameDay } from 'date-fns';

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

    if (habitCompletions.length === 0) return null;

    const lastCompletion = habitCompletions.find(c => c.getTime() <= current.getTime());
    if (!lastCompletion) return null;

    if (isSameDay(lastCompletion, current)) return 0;

    const diffTime = current.getTime() - lastCompletion.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const remaining = (cadence - (diffDays % cadence)) % cadence;
    return remaining;
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
