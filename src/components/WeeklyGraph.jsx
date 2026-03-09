import React, { useMemo } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function WeeklyGraph() {
  const { runEntries } = useHealthData();

  const weeklyData = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dailyRuns = runEntries
        .filter(entry => entry.date === dateStr)
        .map(entry => ({
          time: entry.time,
          distance: entry.distance,
          pace: entry.pace,
        }));

      days.push({
        date: dateStr,
        runs: dailyRuns,
      });
    }

    return days;
  }, [runEntries]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Weekly Run Data</h2>
      <ul>
        {weeklyData.map((day, index) => (
          <li key={index} className="mb-4">
            <h3 className="text-xl font-bold mb-2">{day.date}</h3>
            <ul>
              {day.runs.map((entry, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span>{entry.time}</span>
                  <span>{entry.distance} miles</span>
                  <span>{entry.pace.toFixed(2)} min/mile</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeeklyGraph;
