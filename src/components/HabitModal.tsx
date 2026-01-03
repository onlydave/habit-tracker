import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { HABIT_COLORS } from '../types';
import type { HabitColor, Habit } from '../types';
import styles from './HabitModal.module.css';

interface HabitModalProps {
    onClose: () => void;
    onSave: (name: string, color: string, cadence: number) => void;
    onDelete?: () => void;
    initialData?: Habit;
}

export const HabitModal = ({ onClose, onSave, onDelete, initialData }: HabitModalProps) => {
    const [name, setName] = useState(initialData?.name || '');
    const [color, setColor] = useState<HabitColor>((initialData?.color as HabitColor) || 'blue');
    const [cadence, setCadence] = useState(initialData?.cadence || 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name, color, cadence);
            onClose();
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{initialData ? 'Edit Habit' : 'New Habit'}</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label>Name</label>
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Morning Yoga"
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Cadence (Every X days)</label>
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={cadence}
                            onChange={(e) => setCadence(parseInt(e.target.value) || 1)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Color</label>
                        <div className={styles.colorPicker}>
                            {Object.keys(HABIT_COLORS).map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`${styles.colorSquare} ${color === c ? styles.selected : ''}`}
                                    style={{ backgroundColor: HABIT_COLORS[c as HabitColor] }}
                                    onClick={() => setColor(c as HabitColor)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className={styles.actions}>
                        {initialData && onDelete && (
                            <button type="button" onClick={onDelete} className={styles.deleteBtn}>
                                <Trash2 size={20} />
                            </button>
                        )}
                        <button type="submit" className={styles.submitBtn}>
                            {initialData ? 'Save Changes' : 'Create Habit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
