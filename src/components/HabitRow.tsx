import type { Habit, Completion, HabitColor } from '../types';
import { HABIT_COLORS } from '../types';
import { HabitSquare } from './HabitSquare';
import { formatDate, shouldHabitBeActive, getDaysUntilNextDue, getStreakForDate } from '../utils/dateUtils';
import { Edit2 } from 'lucide-react';
import styles from './HabitRow.module.css';

interface HabitRowProps {
    habit: Habit;
    dates: Date[];
    completions: Completion[];
    onToggle: (habitId: string, date: string) => void;
    onEdit: (habit: Habit) => void;
}

export const HabitRow = ({ habit, dates, completions, onToggle, onEdit }: HabitRowProps) => {
    const habitColor = HABIT_COLORS[habit.color as HabitColor] || habit.color;

    return (
        <div className={styles.row}>
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
                        className={`${styles.squareWrapper} ${isToday ? styles.today : ''}`}
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
                const completedToday = completions.some(
                    c => c.habitId === habit.id && c.date === formatDate(new Date())
                );
                return (
                    <div className={`${styles.habitInfo} ${completedToday ? styles.completedToday : ''}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span className={styles.habitName}>{habit.name}</span>
                            <button
                                onClick={() => onEdit(habit)}
                                className={styles.editBtn}
                            >
                                <Edit2 size={14} />
                            </button>
                        </div>
                        {habit.cadence > 1 && (
                            <span className={styles.cadenceLabel}>Every {habit.cadence} days</span>
                        )}
                    </div>
                );
            })()}
        </div>
    );
};
