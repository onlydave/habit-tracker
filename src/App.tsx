import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { useHabits } from './hooks/useHabits';
import { getHistoryRange, getDaysUntilNextDue } from './utils/dateUtils';
import { HabitRow } from './components/HabitRow';
import { DateHeader } from './components/DateHeader';
import { HabitModal } from './components/HabitModal';
import { Plus } from 'lucide-react';
import { Reorder } from 'framer-motion';
import type { Habit } from './types';

function App() {
  const { habits, completions, toggleCompletion, addHabit, updateHabit, deleteHabit, reorderHabits } = useHabits();
  const [historyDays] = useState(30);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const dates = getHistoryRange(historyDays);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToToday = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const todayIndex = dates.findIndex(d =>
        format(d, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      );

      if (todayIndex !== -1) {
        setTimeout(() => {
          const scrollPos = 250 + (todayIndex * 60) - (container.clientWidth / 2) + 30;
          container.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }, 100);
      }
    }
  };

  useEffect(() => {
    scrollToToday();
  }, [dates.length]);

  const [, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
      scrollToToday();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const habitsDueToday = habits.filter(h => {
    const isDue = (getDaysUntilNextDue(h.id, h.cadence, todayStr, completions) ?? 0) === 0;
    const isCompleted = completions.some(c => c.habitId === h.id && c.date === todayStr);
    return isDue && !isCompleted;
  }).length;

  return (
    <div className="app-container">
      <header style={{
        padding: '2rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.04em' }}>
            {format(new Date(), 'HH:mm')}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>
            {format(new Date(), 'EEEE, MMMM do')}
          </p>
        </div>
        <p style={{
          fontSize: '1.2rem',
          fontWeight: 600,
          color: habitsDueToday > 0 ? 'var(--accent-color)' : 'var(--text-secondary)',
          margin: 0
        }}>
          {habitsDueToday === 0
            ? 'All caught up'
            : `${habitsDueToday} habit${habitsDueToday === 1 ? '' : 's'} left`}
        </p>
      </header>

      <div className="habit-grid-container" style={{
        flex: 1,
        overflow: 'auto',
        position: 'relative'
      }} ref={scrollContainerRef}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 'max-content', minWidth: '100%' }}>
          <DateHeader dates={dates} />

          <Reorder.Group axis="y" values={habits} onReorder={reorderHabits}>
            {habits.map((habit) => (
              <Reorder.Item key={habit.id} value={habit} style={{ listStyle: 'none' }}>
                <HabitRow
                  habit={habit}
                  dates={dates}
                  completions={completions}
                  onToggle={toggleCompletion}
                  onEdit={(h) => {
                    setEditingHabit(h);
                    setIsModalOpen(true);
                  }}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <div style={{ display: 'flex', alignItems: 'center', minWidth: '100%' }}>
            <div style={{
              width: 250,
              padding: '1rem 2rem',
              position: 'sticky',
              left: 0,
              backgroundColor: 'var(--bg-color)',
              zIndex: 10,
              borderRight: '1px solid var(--border-color)'
            }}>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: '1px dashed var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              >
                <Plus size={16} />
                Add Habit
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <HabitModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingHabit(undefined);
          }}
          onSave={(name, color, cadence) => {
            if (editingHabit) {
              updateHabit(editingHabit.id, name, color, cadence);
            } else {
              addHabit(name, color, cadence);
            }
          }}
          onDelete={editingHabit ? () => {
            deleteHabit(editingHabit.id);
            setIsModalOpen(false);
            setEditingHabit(undefined);
          } : undefined}
          initialData={editingHabit}
        />
      )}
    </div>
  );
}

export default App;
