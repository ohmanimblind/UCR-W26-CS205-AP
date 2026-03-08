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
          {/* 1. Moved the gradient to the background box */}
          <div className="bg-gradient-to-r from-derby-green to-yellow-400 px-4 py-2 rounded-lg shadow-md mb-2 mr-4 w-max">
  
  {/* 2. Changed text to solid white and removed the clip-text classes */}
            <h1 className="text-4xl font-bold text-white whitespace-nowrap [-webkit-text-stroke:1px_gray]">
              <p className="italic">Your Pretty Derby! : Run Tracker</p>
            </h1>

            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-derby-green text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('log-run')}
                className={`px-4 py-2 rounded ${activeTab === 'log-run' ? 'bg-derby-green text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Log Run
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded ${activeTab === 'history' ? 'bg-derby-green text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`px-4 py-2 rounded  mr-4 ${activeTab === 'file' ? 'bg-derby-green text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                File
              </button>
            </nav>
            <img src="/Uma_Musume_Pretty_Derby_JP_Logo.png" alt="Uma Musume Pretty Derby Logo" className="h-20" />
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
