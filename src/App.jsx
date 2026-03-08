import React, { useState } from 'react';
import { HealthDataProvider } from './context/HealthDataContext';
import DailyGraph from './components/DailyGraph';
import MoodTracker from './modules/MoodTracker';
import HistoryView from './components/HistoryView';
import FileManager from './components/FileManager';
import { useHealthData } from './context/HealthDataContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { monthlyGoal, fastestPace } = useHealthData();

  return (
    <HealthDataProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-blue-100 p-4 rounded">Your Pretty Derby!: Run Tacker</h1>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('log-run')}
                className={`px-4 py-2 rounded ${activeTab === 'log-run' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Log Run
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`px-4 py-2 rounded ${activeTab === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                File
              </button>
            </nav>
          </header>
          <main>
            {activeTab === 'dashboard' && (
              <div>
                <div className="monthly-goal bg-blue-100 p-4 rounded mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Monthly Goal</h2>
                  <p className="text-gray-600">Your monthly goal is {monthlyGoal} miles.</p>
                </div>
                <div className="fastest-pace bg-lavender p-4 rounded mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Fastest Pace of the Month</h2>
                  <p className="text-gray-600">Your fastest pace is {fastestPace} minutes per mile.</p>
                </div>
                <DailyGraph />
              </div>
            )}
            {activeTab === 'log-run' && <MoodTracker />}
            {activeTab === 'history' && <HistoryView />}
            {activeTab === 'file' && <FileManager />}
          </main>
        </div>
      </div>
    </HealthDataProvider>
  );
}

export default App;
