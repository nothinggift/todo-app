import { useState } from 'react';

type FilterStatus = 'all' | 'completed' | 'pending';

export function useFilteredTodos() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [completed, setCompleted] = useState<boolean | null>(null);

  const handleStatusChange = (value: FilterStatus) => {
    setFilterStatus(value);
    if (value === 'completed') {
      setCompleted(true);
    } else if (value === 'pending') {
      setCompleted(false);
    } else {
      setCompleted(null);
    }
  };

  return {
    filterStatus,
    completed,
    handleStatusChange,
  };
}