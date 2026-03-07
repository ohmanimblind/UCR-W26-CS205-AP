import React, { useState } from 'react';
import { HealthDataProvider } from './context/HealthDataContext';
import DailyGraph from './components/DailyGraph';
import MoodTracker from './modules/MoodTracker';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <HealthDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Run Tracker</h1>
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
            </nav>
          </header>
          <main>
            {activeTab === 'dashboard' && <DailyGraph />}
            {activeTab === 'log-run' && <MoodTracker />}
          </main>
        </div>
      </div>
    </HealthDataProvider>
  );
}

export default App;
