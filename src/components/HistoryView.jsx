import React, { useMemo } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function HistoryView() {
  const { runEntries } = useHealthData();

  const sortedEntries = useMemo(() => {
    return [...runEntries].sort((a, b) => b.id - a.id);
  }, [runEntries]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Run History</h2>
      <ul>
        {sortedEntries.map((entry, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span>{entry.date}</span>
            <span>{entry.time}</span>
            <span>{entry.distance} miles</span>
            <span>{entry.pace.toFixed(2)} min/mile</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryView;
