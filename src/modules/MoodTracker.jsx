import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function MoodTracker() {
  const { runEntries, addRunEntry, deleteRunEntry } = useHealthData();
  const [selectedHours, setSelectedHours] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('');

  const handleSubmit = () => {
    if (!selectedHours || !selectedMinutes || !selectedDistance) return;

    const now = new Date();
    const totalMinutes = parseInt(selectedHours, 10) * 60 + parseInt(selectedMinutes, 10);

    const newEntry = {
      id: Date.now(),
      time: `${selectedHours}:${selectedMinutes}`,
      distance: selectedDistance,
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0],
      totalMinutes,
      pace: totalMinutes / selectedDistance,
    };

    addRunEntry(newEntry);
    setSelectedHours('');
    setSelectedMinutes('');
    setSelectedDistance('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Run Tracker</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label htmlFor="hours" className="block text-gray-700">Hours:</label>
          <select
            id="hours"
            value={selectedHours}
            onChange={(e) => setSelectedHours(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {[...Array(24).keys()].map(hour => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="minutes" className="block text-gray-700">Minutes:</label>
          <select
            id="minutes"
            value={selectedMinutes}
            onChange={(e) => setSelectedMinutes(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {[...Array(60).keys()].map(minute => (
              <option key={minute} value={minute}>{minute}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="distance" className="block text-gray-700">Distance (miles):</label>
          <input
            type="text"
            id="distance"
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSubmit}
        >
          Add Run
        </button>
      </form>
      <ul>
        {runEntries.map((entry, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span>{entry.time}</span>
            <span>{entry.distance} miles</span>
            <span>{entry.pace.toFixed(2)} min/mile</span>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => deleteRunEntry(entry.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodTracker;
