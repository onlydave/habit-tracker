import { useState, useEffect } from 'react';
import type { Habit, Completion } from '../types';

const STORAGE_KEY_HABITS = 'habit_tracker_habits';
const STORAGE_KEY_COMPLETIONS = 'habit_tracker_completions';
const API_URL = '/api/data';

// Fallback for crypto.randomUUID in non-secure (HTTP) contexts
const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const useHabits = () => {
    const [habits, setHabits] = useState<Habit[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_HABITS);
        return saved ? JSON.parse(saved) : [];
    });
    const [completions, setCompletions] = useState<Completion[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_COMPLETIONS);
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoading, setIsLoading] = useState(true);

    // Initial fetch from server, fallback to localStorage
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    if (data.habits) setHabits(data.habits);
                    if (data.completions) setCompletions(data.completions);
                }
            } catch (error) {
                console.warn('Server fetch failed, using local data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Sync to localStorage and Server
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
        localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(completions));

        const sync = async () => {
            try {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ habits, completions }),
                });
            } catch (error) {
                console.warn('Server sync failed, saved locally:', error);
            }
        };
        if (!isLoading) sync();
    }, [habits, completions, isLoading]);

    const addHabit = (name: string, color: string, cadence: number) => {
        const newHabit: Habit = {
            id: generateUUID(),
            name,
            color,
            cadence,
            createdAt: Date.now(),
        };
        setHabits(prev => [...prev, newHabit]);
    };

    const deleteHabit = (id: string) => {
        if (window.confirm('Are you sure you want to delete this habit and all its history?')) {
            setHabits(prev => prev.filter(h => h.id !== id));
            setCompletions(prev => prev.filter(c => c.habitId !== id));
        }
    };

    const updateHabit = (id: string, name: string, color: string, cadence: number) => {
        setHabits(prev => prev.map(h => h.id === id ? { ...h, name, color, cadence } : h));
    };

    const toggleCompletion = (habitId: string, date: string) => {
        setCompletions(prev => {
            const exists = prev.find(c => c.habitId === habitId && c.date === date);
            return exists
                ? prev.filter(c => !(c.habitId === habitId && c.date === date))
                : [...prev, { habitId, date }];
        });
    };

    const reorderHabits = (newHabits: Habit[]) => {
        setHabits(newHabits);
    };

    return {
        habits,
        completions,
        isLoading,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
        reorderHabits,
    };
};
