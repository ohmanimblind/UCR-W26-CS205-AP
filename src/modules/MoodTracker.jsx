import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function MoodTracker() {
  const { runEntries, addRunEntry, deleteRunEntry } = useHealthData();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('');

  const handleSubmit = () => {
    if (!selectedTime || !selectedDistance) return;

    const now = new Date();

    const newEntry = {
      id: Date.now(),
      time: selectedTime,
      distance: selectedDistance,
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0],
    };

    addRunEntry(newEntry);
    setSelectedTime('');
    setSelectedDistance('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Run Tracker</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label htmlFor="time" className="block text-gray-700">Time:</label>
          <input
            type="text"
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
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
