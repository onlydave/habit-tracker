import { useState, useEffect } from 'react';
import { useHabits } from './hooks/useHabits';
import { HabitRow } from './components/HabitRow';
import { DateHeader } from './components/DateHeader';
import { HabitModal } from './components/HabitModal';
import { getHistoryRange, formatDate, getDaysUntilNextDue } from './utils/dateUtils';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Reorder } from 'framer-motion';
import styles from './components/HabitRow.module.css'; // Reuse habit row styles for the add button row

function App() {
  const { habits, completions, toggleCompletion, addHabit, updateHabit, deleteHabit, reorderHabits } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [historyDays] = useState(45); // Support longer history
  const [dates, setDates] = useState<Date[]>(getHistoryRange(historyDays));

  // Auto-scroll to Today
  useEffect(() => {
    const scrollToToday = () => {
      // Find the today column in the DateHeader
      const todayElement = document.querySelector(`.${styles.today}`);
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    };

    // Initial scroll
    setTimeout(scrollToToday, 500);

    // Refresh dates and scroll on date change
    const interval = setInterval(() => {
      const newDates = getHistoryRange(historyDays);
      setDates(newDates);
      scrollToToday();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [historyDays]);

  const habitsDueToday = habits.filter(h => {
    const todayStr = formatDate(new Date());
    const isCompletedToday = completions.some(c => c.habitId === h.id && c.date === todayStr);

    if (isCompletedToday) return false;

    // For cadence 1, it's always "due" if not completed
    if (h.cadence <= 1) return true;

    const daysUntilDue = getDaysUntilNextDue(h.id, h.cadence, todayStr, completions);
    // Due today (0) or Overdue (null) should be counted
    return daysUntilDue === 0 || daysUntilDue === null;
  }).length;

  const handleEdit = (habit: any) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSave = (name: string, color: string, cadence: number) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, { name, color, cadence });
    } else {
      addHabit(name, color, cadence);
    }
  };

  const handleDelete = () => {
    if (editingHabit && window.confirm(`Delete "${editingHabit.name}"? This cannot be undone.`)) {
      deleteHabit(editingHabit.id);
      setIsModalOpen(false);
    }
  };

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

      <div className="habit-grid-container" style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <DateHeader dates={dates} />

        <Reorder.Group axis="y" values={habits} onReorder={reorderHabits}>
          {habits.map((habit) => (
            <Reorder.Item key={habit.id} value={habit} style={{ listStyle: 'none' }}>
              <HabitRow
                habit={habit}
                dates={dates}
                completions={completions}
                onToggle={toggleCompletion}
                onEdit={handleEdit}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Add Habit row at the bottom */}
        <div className={styles.row} style={{ borderBottom: 'none' }}>
          <div style={{
            width: `${(dates.length - 1) * 60 + 90}px`,
            flexShrink: 0
          }}></div>
          <div
            className={styles.habitInfo}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              borderLeft: 'none',
              backgroundColor: 'var(--bg-color)'
            }}
            onClick={() => {
              setEditingHabit(null);
              setIsModalOpen(true);
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              padding: '0.5rem 1rem',
              border: '1px dashed var(--border-color)',
              borderRadius: '8px',
              width: '100%',
              justifyContent: 'center'
            }}>
              <Plus size={18} />
              <span style={{ fontWeight: 600 }}>Add Habit</span>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <HabitModal
          initialData={editingHabit}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
