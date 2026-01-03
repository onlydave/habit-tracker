import styles from './HabitSquare.module.css';
import { motion } from 'framer-motion';

interface HabitSquareProps {
    color: string;
    completed: boolean;
    inactive: boolean;
    offCadence: boolean;
    label?: string | number | null;
    opacity?: number;
    onClick: () => void;
}

export const HabitSquare = ({ color, completed, inactive, offCadence, label, opacity = 1, onClick }: HabitSquareProps) => {
    return (
        <motion.div
            className={`
                ${styles.square} 
                ${completed ? styles.completed : ''} 
                ${inactive ? styles.inactive : ''} 
                ${offCadence ? styles.offCadence : ''}
            `}
            style={{
                '--habit-color': color,
                opacity: completed ? opacity : undefined
            } as React.CSSProperties}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
        >
            {completed ? (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={styles.inner}
                />
            ) : (
                label !== null && label !== undefined && (
                    <span className={styles.label}>{label === 0 ? '★' : `+${label}`}</span>
                )
            )}
        </motion.div>
    );
};
