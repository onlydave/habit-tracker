import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface HabitSquareProps {
    color: string;
    completed: boolean;
    inactive: boolean;
    offCadence: boolean;
    label?: string | number | null;
    opacity?: number;
    onClick: () => void;
    isToday?: boolean;
}

export const HabitSquare = ({
    color,
    completed,
    inactive,
    offCadence,
    label,
    opacity = 1,
    onClick,
    isToday = false
}: HabitSquareProps) => {
    return (
        <motion.div
            className={cn(
                "w-[60px] h-[60px]",
                "bg-[var(--square-empty)]", // We will need to define this variable or use a Tailwind color
                "cursor-pointer flex items-center justify-center",
                "transition-[background-color,transform,opacity,width] duration-200",
                "border border-white/5",
                "shrink-0 relative",
                // Hover state
                "hover:border-[var(--text-secondary)] hover:z-[5]",
                // Completed state
                completed && "bg-[var(--habit-color)] border-white/10 opacity-100",
                // Inactive state (overridden by other states if needed, but CSS had it)
                inactive && "opacity-20",
                // Off-cadence (countdown) - not completed
                offCadence && !completed && "opacity-15 bg-[var(--habit-color)]",
                // Off-cadence star - not completed (specific override)
                offCadence && !completed && label === 0 && "bg-[var(--square-empty)] opacity-60",
                // Today state
                isToday && "w-[90px]"
            )}
            style={{
                '--habit-color': color,
                opacity: completed ? opacity : undefined,
                backgroundColor: completed || (offCadence && !completed && label !== 0) ? color : undefined
            } as React.CSSProperties}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
        >
            {completed ? (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                        "bg-white/5 rounded-[2px]",
                        "transition-[width,height] duration-200"
                    )}
                    style={{
                        width: isToday ? '54px' : '36px', // 60% of width
                        height: isToday ? '54px' : '36px' // 60% of height
                    }}
                />
            ) : (
                label !== null && label !== undefined && (
                    <span className={cn(
                        "text-xs font-bold text-[var(--text-secondary)] opacity-50",
                        offCadence && "text-white opacity-80"
                    )}>
                        {label === 0 ? '★' : `${label}`}
                    </span>
                )
            )}
        </motion.div>
    );
};
