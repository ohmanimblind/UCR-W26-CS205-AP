import React, { useState, useMemo, useEffect } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function DailyGraph() {
  const { monthlyGoal, totalDistanceThisMonth, setMonthlyGoal, runEntries, streak, calculateGrade } = useHealthData();
  const [newMonthlyGoal, setNewMonthlyGoal] = useState(monthlyGoal);
  const [recommendedRun, setRecommendedRun] = useState(null);

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

  // Calculate baseline distance and tempo pace
  const baselineDistance = useMemo(() => monthlyGoal / 20, [monthlyGoal]);
  const averagePace = useMemo(() => {
    if (runEntries.length === 0) return 9; // Default to 9 minutes per mile if no runs
    const totalPace = runEntries.reduce((sum, entry) => sum + parseFloat(entry.pace), 0);
    return (totalPace / runEntries.length) - 0.5; // Subtract 30 seconds (0.5 minutes)
  }, [runEntries]);

  const tempoPace = useMemo(() => Math.min(9, averagePace), [averagePace]);

  // Check for runs in the past 3 days
  useEffect(() => {
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);

    const recentEntries = runEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= threeDaysAgo;
    });

    if (recentEntries.length === 0) {
      // Step 2: Evaluate the 3-Day Inactivity Rule
      setRecommendedRun({
        distance: baselineDistance,
        pace: 9,
        message: 'Ease back into your routine with a base-building run.'
      });
    } else {
      const yesterdayEntry = recentEntries[0];
      const yesterdayDate = new Date(yesterdayEntry.date);
      const isYesterday = yesterdayDate.toDateString() === now.toDateString();

      if (isYesterday) {
        // Step 3: Evaluate Yesterday's Run for Recovery
        if (parseFloat(yesterdayEntry.distance) >= baselineDistance && parseFloat(yesterdayEntry.pace) <= tempoPace) {
          setRecommendedRun({
            distance: baselineDistance * 0.75,
            pace: 10, // Slower pace than 9 minutes per mile
            message: 'Take it easy today to recover from yesterday\'s hard effort.'
          });
        } else {
          // Step 4: Evaluate Yesterday's Run for Tempo
          setRecommendedRun({
            distance: baselineDistance,
            pace: tempoPace,
            message: 'Push your pace today with a tempo run.'
          });
        }
      } else {
        // Step 5: Fallback Condition
        setRecommendedRun({
          distance: baselineDistance,
          pace: 9,
          message: 'Keep your momentum going with a standard run.'
        });
      }
    }
  }, [runEntries, monthlyGoal, baselineDistance, tempoPace]);

  return (
    <div className="mt-8 flex">
      <div className="w-3/4">
        <h3 className="text-xl font-bold mb-2">Monthly Goal</h3>
        <p>Goal: {monthlyGoal} miles</p>
        <p>Progress: {(typeof totalDistanceThisMonth === 'number' ? totalDistanceThisMonth.toFixed(2) : '0.00')} miles</p>
        <p>Remaining: {(monthlyGoal - (typeof totalDistanceThisMonth === 'number' ? totalDistanceThisMonth : 0)).toFixed(2)} miles</p>
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 p-4 bg-derby-green shadow-lg">
          <div className="w-full mt-2 relative">
    
            {/* 1. The Background Track (Gray) */}
            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
      
              {/* 2. The Yellow Progress Fill */}
              <div
                className="h-full bg-yellow-400"
                style={{ width: `${(totalDistanceThisMonth / monthlyGoal) * 100}%` }}
              ></div>

            </div>

    {/* 3. Your Agnes Icon Slider */}
            <div
              className="absolute top-0 w-7 h-7 rounded-full transform -translate-x-1/2 -translate-y-2.5" 
              style={{ 
                left: `${(totalDistanceThisMonth / monthlyGoal) * 100}%`, 
                backgroundImage: 'url(/agnes.png)', 
                backgroundSize: 'cover' 
              }}
            ></div>

    {/* 4. The Percentage Text */}
            <p className="mt-1 text-sm text-white font-bold">
              {((totalDistanceThisMonth / monthlyGoal) * 100).toFixed(2)}% complete
            </p>
          </div>
          {/* 5. The Finish Line Icon */}
          <div
            className="absolute top-0 right-0 w-12 h-12 rounded-full transform -translate-y-5 translate-x-1/2"
            style={{ backgroundImage: 'url(/finish_line.png)', backgroundSize: 'cover' }}
          ></div> 
        </div>
        <div className="mt-4">
          <input
            type="number"
            value={newMonthlyGoal}
            onChange={handleMonthlyGoalChange}
            className="border p-2"
          />
          <button onClick={handleSaveMonthlyGoal} className="ml-2 px-4 py-2 bg-derby-green text-white rounded">
            Save Goal
          </button>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Fastest Pace of the Month</h3>
          {fastestPaceThisMonth !== 'No runs this month' && (
            <p>{fastestPaceThisMonth} miles per hour</p>
          )}
          {fastestPaceThisMonth === 'No runs this month' && (
            <p>{fastestPaceThisMonth}</p>
          )}
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Longest Run of the Month</h3>
          {longestRunThisMonth !== 'No runs this month' && (
            <p>{longestRunThisMonth} miles</p>
          )}
          {longestRunThisMonth === 'No runs this month' && (
            <p>{longestRunThisMonth}</p>
          )}
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Fastest Pace of the Week</h3>
          {fastestPaceThisWeek !== 'No runs this week' && (
            <p>{fastestPaceThisWeek} miles per hour</p>
          )}
          {fastestPaceThisWeek === 'No runs this week' && (
            <p>{fastestPaceThisWeek}</p>
          )}
        </div>
      </div>
      <div className="w-1/4">
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Running Streak</h3>
          <p>Streak: {streak} weeks</p>
          <p>Grade: {calculateGrade}</p>
        </div>
        {recommendedRun && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">Recommended Run</h3>
            <p>Distance: {recommendedRun.distance.toFixed(2)} miles</p>
            <p>Pace: {recommendedRun.pace} minutes per mile</p>
            <p>{recommendedRun.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyGraph;
