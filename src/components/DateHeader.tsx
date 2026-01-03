import { format } from 'date-fns';
import styles from './DateHeader.module.css';

interface DateHeaderProps {
    dates: Date[];
}

export const DateHeader = ({ dates }: DateHeaderProps) => {
    return (
        <div className={styles.header}>
            {dates.map((date) => {
                const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                return (
                    <div
                        key={date.toISOString()}
                        className={`${styles.dateItem} ${isToday ? styles.today : ''}`}
                    >
                        <span className={styles.dayName}>{format(date, 'EEE')}</span>
                        <span className={styles.dayNumber}>{format(date, 'd')}</span>
                    </div>
                );
            })}
            <div className={styles.stickySpacer}>
                <span className={styles.monthLabel}>
                    {/* {format(dates[Math.floor(dates.length / 2)], 'MMMM yyyy')} */}
                </span>
            </div>
        </div>
    );
};
