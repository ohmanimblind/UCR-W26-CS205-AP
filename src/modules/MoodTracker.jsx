import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function MoodTracker() {
  const { runEntries, addRunEntry, deleteRunEntry } = useHealthData();
  const [selectedHours, setSelectedHours] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!selectedMinutes || !selectedDistance) return;

    const now = new Date();
    const totalMinutes = parseInt(selectedHours, 10) * 60 + parseInt(selectedMinutes, 10);

    const newEntry = {
      id: Date.now(),
      time: `${selectedHours ? selectedHours : '0'}:${selectedMinutes}`,
      distance: selectedDistance,
      date: now.toISOString().split('T')[0],
      pace: totalMinutes / selectedDistance,
    };

    addRunEntry(newEntry);
    setSelectedHours('');
    setSelectedMinutes('');
    setSelectedDistance('');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all run data? This cannot be undone.')) {
      deleteRunEntry();
      setSelectedHours('');
      setSelectedMinutes('');
      setSelectedDistance('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Log Run</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          <input
            type="number"
            placeholder="Hours"
            value={selectedHours}
            onChange={(e) => setSelectedHours(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Minutes"
            value={selectedMinutes}
            onChange={(e) => setSelectedMinutes(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <input
          type="number"
          placeholder="Distance (miles)"
          value={selectedDistance}
          onChange={(e) => setSelectedDistance(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Run
        </button>
        <button type="button" onClick={handleClear} className="bg-red-500 text-white p-2 rounded">
          Clear All Runs
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Run Entries</h3>
        <ul>
          {runEntries.map((entry) => (
            <li key={entry.id} className="flex justify-between items-center mb-2">
              <span>{entry.time}</span>
              <span>{entry.distance} miles</span>
              <span>{entry.pace.toFixed(2)} min/mile</span>
              <button
                onClick={() => deleteRunEntry(entry.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MoodTracker;
