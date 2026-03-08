import React, { useState } from 'react';
import { HealthDataProvider } from './context/HealthDataContext';
import DailyGraph from './components/DailyGraph';
import MoodTracker from './modules/MoodTracker';
import HistoryView from './components/HistoryView';
import FileManager from './components/FileManager';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <HealthDataProvider>
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Pretty Derby! : Run Tracker</h1>
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
            <img src="/Uma_Musume_Pretty_Derby_JP_Logo.png" alt="Uma Musume Pretty Derby Logo" className="h-16" />
          </header>
          <main>
            {activeTab === 'dashboard' && <DailyGraph />}
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
