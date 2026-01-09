import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { HABIT_COLORS } from '../types';
import type { HabitColor, Habit } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-[4px]">
            <div className="bg-[var(--panel-bg)] p-8 rounded-xl w-full max-w-[400px] border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Habit' : 'New Habit'}</h2>
                    <button onClick={onClose} className="bg-transparent border-none p-0 text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem]">Name</label>
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Morning Yoga"
                            required
                            className="w-full p-[0.8rem] bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem]">Cadence (Every X days)</label>
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={cadence}
                            onChange={(e) => setCadence(parseInt(e.target.value) || 1)}
                            className="w-full p-[0.8rem] bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-base focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-[var(--text-secondary)] text-[0.9rem]">Color</label>
                        <div className="grid grid-cols-5 gap-3">
                            {Object.keys(HABIT_COLORS).map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={cn(
                                        "w-8 h-8 border-2 border-transparent p-0 cursor-pointer transition-transform duration-100 rounded-md",
                                        color === c && "border-white scale-110 z-[1]"
                                    )}
                                    style={{ backgroundColor: HABIT_COLORS[c as HabitColor] }}
                                    onClick={() => setColor(c as HabitColor)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 mt-8">
                        {initialData && onDelete && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="bg-[var(--panel-bg)] border border-[var(--habit-red)] text-[var(--habit-red)] p-4 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-[var(--habit-red)] hover:text-white cursor-pointer"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                        <button type="submit" className="flex-1 bg-[var(--accent-color)] text-white p-4 font-semibold rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                            {initialData ? 'Save Changes' : 'Create Habit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
