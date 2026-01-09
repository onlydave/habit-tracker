import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { useHabits } from '../hooks/useHabits';
import { HabitRow } from '../components/HabitRow';
import { DateHeader } from '../components/DateHeader';
import { HabitModal } from '../components/HabitModal';
import { getHistoryRange, formatDate, getDaysUntilNextDue } from '../utils/dateUtils';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Reorder } from 'framer-motion';
import type { Habit } from '../types';

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { habits, completions, toggleCompletion, addHabit, updateHabit, deleteHabit, reorderHabits } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [historyDays] = useState(45); // Support longer history
  const [dates, setDates] = useState<Date[]>(() => getHistoryRange(45));

  // Auto-scroll to Today
  useEffect(() => {
    const scrollToToday = () => {
      // Find the today column by inspecting DateHeader elements
      // Since we don't have a direct ref to the specific DOM element inside DateHeader easily without forwardRef,
      // we can try to select by class name if we add one, or use the "today-anchor" we added.
      const todayAnchor = document.querySelector('.today-anchor');
      if (todayAnchor) {
        todayAnchor.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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

  const handleEdit = (habit: Habit) => {
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
    if (editingHabit && editingHabit.id) {
      deleteHabit(editingHabit.id);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="p-8 border-b border-[var(--border-color)] flex justify-between items-baseline">
        <div className="flex items-baseline gap-6">
          <h1 className="text-[3.5rem] font-black m-0 tracking-[-0.04em]">
            {format(new Date(), 'HH:mm')}
          </h1>
          <p className="text-[1.2rem] text-[var(--text-secondary)] font-medium m-0">
            {format(new Date(), 'EEEE, MMMM do')}
          </p>
        </div>
        <p className={`text-[1.2rem] font-semibold m-0 ${habitsDueToday > 0 ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'}`}>
          {habitsDueToday === 0
            ? 'All caught up'
            : `${habitsDueToday} habit${habitsDueToday === 1 ? '' : 's'} left`}
        </p>
      </header>

      <div className="flex-1 overflow-auto relative">
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
        <div className="flex items-center border-none w-max min-w-full">
          <div style={{
            width: `${(dates.length - 1) * 60 + 90}px`, // Match the width calculation of DateHeader
          }} className="shrink-0 h-[60px]"></div>

          <div
            className="w-[250px] h-[60px] flex flex-col justify-center px-8 sticky right-0 bg-[var(--bg-color)] z-10 shrink-0 border-l border-[var(--border-color)] cursor-pointer"
            onClick={() => {
              setEditingHabit(null);
              setIsModalOpen(true);
            }}
          >
            <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)] py-2 px-4 border border-dashed border-[var(--border-color)] rounded-lg w-full font-semibold group hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <Plus size={18} />
              <span>Add Habit</span>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <HabitModal
          initialData={editingHabit || undefined}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={editingHabit ? handleDelete : undefined}
        />
      )}
    </div>
  );
}
