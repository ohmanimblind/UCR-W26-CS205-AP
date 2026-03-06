import React, { useMemo } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function DailyGraph() {
  const { runEntries, monthlyGoal } = useHealthData();

  const dailyData = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    const todayRuns = runEntries
      .filter(entry => entry.date === todayStr)
      .map(entry => ({
        time: entry.time,
        distance: entry.distance,
        pace: entry.pace,
      }));

    return todayRuns;
  }, [runEntries]);

  const totalDistanceThisMonth = useMemo(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyRuns = runEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= firstDayOfMonth && entryDate <= lastDayOfMonth;
    });

    return monthlyRuns.reduce((total, entry) => total + entry.distance, 0);
  }, [runEntries]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Daily Run Data</h2>
      <ul>
        {dailyData.map((entry, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span>{entry.time}</span>
            <span>{entry.distance} miles</span>
            <span>{entry.pace.toFixed(2)} min/mile</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Monthly Goal</h3>
        <p>Goal: {monthlyGoal} miles</p>
        <p>Progress: {totalDistanceThisMonth.toFixed(2)} miles</p>
        <p>Remaining: {(monthlyGoal - totalDistanceThisMonth).toFixed(2)} miles</p>
      </div>
    </div>
  );
}

export default DailyGraph;
