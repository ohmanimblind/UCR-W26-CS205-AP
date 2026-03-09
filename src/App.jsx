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
      <div className="min-h-screen bg-transparent relative">
        <div className="absolute left-0 top-0 z-0">
          <img src="/party_dash.gif" alt="Party Dash GIF" className="h-32" />
          <img src="/silence_suzuka.gif" alt="Silence Suzuka GIF" className="h-32 mt-4" />
          <img src="/fox.gif" alt="Fox GIF" className="h-32 mt-4" />
        </div>
        <div className="absolute right-0 top-0 z-0">
          <img src="/gold_ship.gif" alt="Gold Ship GIF" className="h-32" />
          <img src="/who.gif" alt="Who GIF" className="h-32 mt-4" />
          <img src="/super_creek.gif" alt="Super Creek GIF" className="h-32 mt-4" />
        </div>
        <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
          <header className="mb-8 flex justify-between items-center">
            <div className="bg-gradient-to-r from-derby-green to-yellow-400 px-4 py-2 rounded-lg shadow-md mb-2 mr-4 w-max">
              <h1 className="text-4xl font-bold text-white whitespace-nowrap [-webkit-text-stroke:1px_gray]">
                <p className="italic">Your Pretty Derby! : Run Tracker</p>
              </h1>
            </div>
            <nav className="flex space-x-4">
              {['dashboard', 'log-run', 'history', 'file'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-2 rounded-lg font-black italic tracking-tight uppercase transition-all duration-300 border-2 overflow-hidden
                    ${activeTab === tab 
                      ? 'text-white border-derby-green scale-105 shadow-lg' 
                      : 'text-gray-700 border-gray-300 opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                >
                  <div 
                    className={`absolute inset-0 z-0 
                      ${activeTab === tab 
                        ? '[background-image:conic-gradient(#fff_25%,#059669_0_50%,#fff_0_75%,#059669_0)]' 
                        : '[background-image:conic-gradient(#fff_25%,#000_0_50%,#fff_0_75%,#000_0)]'
                      } 
                      [background-size:10px_10px] 
                      [mask-image:linear-gradient(to_bottom,transparent_70%,black_100%)]
                      [-webkit-mask-image:linear-gradient(to_bottom,transparent_70%,black_100%)]`}
                  />
                  <span className="relative z-10 [text-shadow:_1px_1px_2px_#000]">
                    {tab.replace('-', ' ')}
                  </span>
                </button>
              ))}
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
        {activeTab !== 'dashboard' && (
          <div className="absolute bottom-0 left-0 right-0 z-0 flex justify-between">
            <img src="/log_run.gif" alt="Log Run GIF" className="h-32 border-2 border-gray-300" />
            <img src="/run_history.gif" alt="Run History GIF" className="h-32 border-2 border-gray-300" />
          </div>
        )}
      </div>
    </HealthDataProvider>
  );
}

export default App;
