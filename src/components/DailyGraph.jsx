import React from 'react';
import { useHealthData } from '../context/HealthDataContext';

function DailyGraph() {
  const { monthlyGoal, totalDistanceThisMonth } = useHealthData();

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-2">Monthly Goal</h3>
      <p>Goal: {monthlyGoal} miles</p>
      <p>Progress: {(typeof totalDistanceThisMonth === 'number' ? totalDistanceThisMonth.toFixed(2) : '0.00')} miles</p>
      <p>Remaining: {(monthlyGoal - (typeof totalDistanceThisMonth === 'number' ? totalDistanceThisMonth : 0)).toFixed(2)} miles</p>
    </div>
  );
}

export default DailyGraph;
