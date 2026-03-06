import React, { useMemo } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function DailyGraph() {
  const { runEntries } = useHealthData();

  const dailyData = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    const todayRuns = runEntries
      .filter(entry => entry.date === todayStr)
      .map(entry => ({
        time: entry.time,
        distance: entry.distance,
      }));

    return todayRuns;
  }, [runEntries]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Daily Run Data</h2>
      <ul>
        {dailyData.map((entry, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span>{entry.time}</span>
            <span>{entry.distance} miles</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DailyGraph;
