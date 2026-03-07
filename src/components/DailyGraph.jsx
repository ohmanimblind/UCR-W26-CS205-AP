import React, { useState, useMemo } from 'react';
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

    if (filteredEntries.length === 0) return 'No runs this month';

    const initialMinPace = Infinity;
    const fastestPace = filteredEntries.reduce((minPace, entry) => {
      const pace = entry.pace;
      return pace < minPace ? pace : minPace;
    }, initialMinPace);

    return fastestPace !== Infinity ? fastestPace.toFixed(2) : 'No runs this month';
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

    if (filteredEntries.length === 0) return 'No runs this month';

    const longestRun = filteredEntries.reduce((maxDistance, entry) => {
      const distance = parseFloat(entry.distance);
      return distance > maxDistance ? distance : maxDistance;
    }, 0);

    return typeof longestRun === 'number' && !isNaN(longestRun) ? longestRun.toFixed(2) : 'No runs this month';
  }, [runEntries]);

  // Calculate fastest pace of the week
  const fastestPaceThisWeek = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);

    const filteredEntries = runEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek && entryDate <= endOfWeek;
    });

    if (filteredEntries.length === 0) return 'No runs this week';

    const initialMinPace = Infinity;
    const fastestPace = filteredEntries.reduce((minPace, entry) => {
      const pace = entry.pace;
      return pace < minPace ? pace : minPace;
    }, initialMinPace);

    return fastestPace !== Infinity ? fastestPace.toFixed(2) : 'No runs this week';
  }, [runEntries]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-2">Monthly Goal</h3>
      <p>Goal: {monthlyGoal} miles</p>
      <p>Progress: {(typeof totalDistanceThisMonth === 'number' ? totalDistanceThisMonth.toFixed(2) : '0.00')} miles</p>
      <p>Remaining: {(monthlyGoal - (typeof totalDistanceThisMonth === 'number' ? totalDistanceThisMonth : 0)).toFixed(2)} miles</p>
      <progress
        value={totalDistanceThisMonth}
        max={monthlyGoal}
        className="w-full h-2 bg-gray-200 rounded overflow-hidden mt-2"
      >
        <div
          className="h-full bg-blue-500"
          style={{ width: `${(totalDistanceThisMonth / monthlyGoal) * 100}%` }}
        ></div>
      </progress>
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
        <p>{fastestPaceThisMonth} miles per hour</p>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Longest Run of the Month</h3>
        <p>{longestRunThisMonth} miles</p>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Fastest Pace of the Week</h3>
        <p>{fastestPaceThisWeek} miles per hour</p>
      </div>
    </div>
  );
}

export default DailyGraph;
