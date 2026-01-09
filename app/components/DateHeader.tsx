import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface DateHeaderProps {
    dates: Date[];
}

export const DateHeader = ({ dates }: DateHeaderProps) => {
    return (
        <div className="flex sticky top-0 bg-[var(--bg-color)] z-20 border-b border-[var(--border-color)] w-max h-[70px]">
            {dates.map((date) => {
                const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                return (
                    <div
                        key={date.toISOString()}
                        className={cn(
                            "w-[60px] flex flex-col items-center justify-center shrink-0 gap-0.5",
                            isToday && "w-[90px] bg-[#58a6ff1a] border-b-2 border-[var(--accent-color)]"
                        )}
                    >
                        <span className="text-[0.7rem] uppercase text-[var(--text-secondary)] font-semibold">{format(date, 'EEE')}</span>
                        <span className={cn(
                            "text-base font-bold text-[var(--text-primary)]",
                            isToday && "text-[var(--accent-color)]"
                        )}>{format(date, 'd')}</span>

                        {/* Hidden anchor element for easier scrolling to today */}
                        {isToday && <div className="today-anchor absolute top-0" />}
                    </div>
                );
            })}
            <div className="w-[250px] shrink-0 sticky right-0 bg-[var(--bg-color)] z-30 flex items-center px-8 border-l border-[var(--border-color)]">
                <span className="font-bold text-[var(--text-secondary)] uppercase tracking-[0.05em] text-[0.9rem]">
                    {/* {format(dates[Math.floor(dates.length / 2)], 'MMMM yyyy')} */}
                </span>
            </div>
        </div>
    );
};
