import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function DailyGraph() {
  const { monthlyGoal, totalDistanceThisMonth, setMonthlyGoal, runEntries } = useHealthData();
  const [newMonthlyGoal, setNewMonthlyGoal] = useState(monthlyGoal);

  const handleMonthlyGoalChange = (e) => {
    setNewMonthlyGoal(e.target.value);
  };

  const handleSaveMonthlyGoal = () => {
    const parsedGoal = parseFloat(newMonthlyGoal);
    if (!isNaN(parsedGoal)) {
      setMonthlyGoal(parsedGoal);
    }
  };

  // Calculate fastest pace of the month
  const fastestPaceThisMonth = useMemo(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const filteredEntries = runEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= firstDayOfMonth && entryDate <= lastDayOfMonth;
    });

    if (filteredEntries.length === 0) return null;

    const fastestPace = filteredEntries.reduce((minPace, entry) => {
      const pace = entry.distance / entry.time;
      return pace < minPace ? pace : minPace;
    }, Infinity);

    return fastestPace.toFixed(2);
  }, [runEntries]);

  // Calculate longest run of the month
  const longestRunThisMonth = useMemo(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const filteredEntries = runEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= firstDayOfMonth && entryDate <= lastDayOfMonth;
    });

    if (filteredEntries.length === 0) return null;

    const longestRun = filteredEntries.reduce((maxDistance, entry) => {
      return entry.distance > maxDistance ? entry.distance : maxDistance;
    }, 0);

    return longestRun.toFixed(2);
  }, [runEntries]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-2">Monthly Goal</h3>
      <p>Goal: {monthlyGoal} miles</p>
      <p>Progress: {(typeof totalDistanceThisMonth === 'number' ? totalDistanceThisMonth.toFixed(2) : '0.00')} miles</p>
      <p>Remaining: {(monthlyGoal - (typeof totalDistanceThisMonth === 'number' ? totalDistanceThisMonth : 0)).toFixed(2)} miles</p>
      <div className="mt-4">
        <input
          type="number"
          value={newMonthlyGoal}
          onChange={handleMonthlyGoalChange}
          className="border p-2"
        />
        <button onClick={handleSaveMonthlyGoal} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Save Goal
        </button>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Fastest Pace of the Month</h3>
        <p>{fastestPaceThisMonth ? `${fastestPaceThisMonth} miles per hour` : 'No runs this month'}</p>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Longest Run of the Month</h3>
        <p>{longestRunThisMonth ? `${longestRunThisMonth} miles` : 'No runs this month'}</p>
      </div>
    </div>
  );
}

export default DailyGraph;
