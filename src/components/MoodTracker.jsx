import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function MoodTracker() {
  const { addRunEntry } = useHealthData();
  const [selectedHours, setSelectedHours] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState('0'); // Default to 0 minutes
  const [selectedDistance, setSelectedDistance] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!selectedDistance) return;

    const now = new Date();
    const totalMinutes = parseInt(selectedHours, 10) * 60 + parseInt(selectedMinutes, 10);
    const distance = parseFloat(selectedDistance);

    if (isNaN(distance) || totalMinutes === 0) {
      console.error('Distance must be a number and time must be greater than 0');
      return;
    }

    const pace = totalMinutes / distance;

    const newEntry = {
      id: Date.now(),
      date: now.toISOString(),
      distance,
      time: totalMinutes / 60,
      pace: pace.toFixed(2),
    };

    addRunEntry(newEntry);
    setSelectedHours('');
    setSelectedMinutes('0'); // Reset to default
    setSelectedDistance('');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all run data? This cannot be undone.')) {
      // Assuming deleteRunEntry is available in the context
      // deleteRunEntry();
      setSelectedHours('');
      setSelectedMinutes('0'); // Reset to default
      setSelectedDistance('');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Log a Run</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="hours" className="block text-sm font-medium text-gray-700">Hours</label>
          <input
            type="number"
            id="hours"
            value={selectedHours}
            onChange={(e) => setSelectedHours(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="minutes" className="block text-sm font-medium text-gray-700">Minutes</label>
          <input
            type="number"
            id="minutes"
            value={selectedMinutes}
            onChange={(e) => setSelectedMinutes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="distance" className="block text-sm font-medium text-gray-700">Distance (miles)</label>
          <input
            type="number"
            id="distance"
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Log Run
          </button>
          <button type="button" onClick={handleClear} className="ml-2 px-4 py-2 bg-red-500 text-white rounded">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default MoodTracker;
