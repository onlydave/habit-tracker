import type { Habit, Completion } from '../types';
import { HabitSquare } from './HabitSquare';
import { formatDate, shouldHabitBeActive, getDaysUntilNextDue, getStreakForDate } from '../utils/dateUtils';
import { Edit2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Map color names to hex if needed, or pass through if already hex
// Assuming exact match with previous logic for now
const HABIT_COLORS: Record<string, string> = {
    red: '#FF5E57',
    orange: '#FF8c42',
    yellow: '#FFD93D',
    green: '#6BCB77',
    blue: '#4D96FF',
    purple: '#6F42C1',
    pink: '#FF6CB7'
};

interface HabitRowProps {
    habit: Habit;
    dates: Date[];
    completions: Completion[];
    onToggle: (habitId: string, date: string) => void;
    onEdit: (habit: Habit) => void;
}

export const HabitRow = ({ habit, dates, completions, onToggle, onEdit }: HabitRowProps) => {
    const habitColor = HABIT_COLORS[habit.color] || habit.color;

    return (
        <div className="flex items-center border-b border-[var(--border-color)] w-max min-w-full group hover:bg-[rgba(255,255,255,0.01)] transition-colors">
            {dates.map((date) => {
                const dateStr = formatDate(date);
                const completed = completions.some(
                    (c) => c.habitId === habit.id && c.date === dateStr
                );
                const active = shouldHabitBeActive(habit.createdAt, dateStr);
                const daysUntilDue = getDaysUntilNextDue(habit.id, habit.cadence, dateStr, completions);
                const isToday = dateStr === formatDate(new Date());

                // Streak calculation for visuals: start at 50% and increment by 10%
                const streak = completed ? getStreakForDate(habit.id, dateStr, completions) : 0;
                const visualOpacity = completed ? Math.min(0.5 + ((streak - 1) * 0.1), 1) : 1;

                const isOffCadence = !completed && daysUntilDue !== null;

                return (
                    <div
                        key={dateStr}
                        className={cn(
                            "w-[60px] h-[60px] flex items-center justify-center shrink-0 p-0",
                            isToday && "w-[90px] bg-[#58a6ff0d]"
                        )}
                    >
                        <HabitSquare
                            color={habitColor}
                            completed={completed}
                            inactive={!active}
                            offCadence={isOffCadence}
                            label={daysUntilDue}
                            opacity={visualOpacity}
                            onClick={() => onToggle(habit.id, dateStr)}
                            isToday={isToday}
                        />
                    </div>
                );
            })}

            {(() => {
                const todayStr = formatDate(new Date());
                const completedToday = completions.some(
                    c => c.habitId === habit.id && c.date === todayStr
                );
                const daysUntilDueToday = getDaysUntilNextDue(habit.id, habit.cadence, todayStr, completions);

                // Dim if already completed TODAY
                // OR if if it's a cadence habit and not yet due (daysUntilDueToday > 0)
                // Note: stars (0) and overdue (null) should NOT be dimmed.
                const isDoneOrNotDue = completedToday || (habit.cadence > 1 && daysUntilDueToday !== null && daysUntilDueToday > 0);

                return (
                    <div className={cn(
                        "w-[250px] h-[60px] flex flex-col justify-center px-8 sticky right-0 bg-[var(--bg-color)] z-10 shrink-0 border-l border-[var(--border-color)]",
                        isDoneOrNotDue && "opacity-40"
                    )}>
                        <div className="flex justify-between items-start">
                            <span className="font-semibold text-[1.1rem] text-[var(--text-primary)]">{habit.name}</span>
                            <button
                                onClick={() => onEdit(habit)}
                                className="bg-none border-none p-1 text-[var(--text-secondary)] opacity-0 transition-opacity duration-200 cursor-pointer rounded flex items-center justify-center group-hover:opacity-100 hover:bg-[var(--panel-bg)] hover:text-[var(--text-primary)]"
                            >
                                <Edit2 size={14} />
                            </button>
                        </div>
                        {habit.cadence > 1 && (
                            <span className="text-xs text-[var(--text-secondary)] leading-[1.2] mt-[2px]">Every {habit.cadence} days</span>
                        )}
                    </div>
                );
            })()}
        </div>
    );
};
