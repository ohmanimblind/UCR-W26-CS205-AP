import React, { useMemo } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function HistoryView() {
  const { runEntries } = useHealthData();

  const sortedEntries = useMemo(() => {
    return [...runEntries].sort((a, b) => b.id - a.id);
  }, [runEntries]);

  const groupedByDate = useMemo(() => {
    const grouped = {};
    sortedEntries.forEach(entry => {
      const date = entry.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(entry);
    });
    return grouped;
  }, [sortedEntries]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Run History</h2>
      {Object.keys(groupedByDate).map(date => (
        <div key={date} className="mb-4">
          <h3 className="text-xl font-bold mb-2">{date}</h3>
          <ul>
            {groupedByDate[date].map((entry, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{entry.time}</span>
                <span>{entry.distance} miles</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default HistoryView;
