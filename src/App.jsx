import React, { useState } from 'react';
import { HealthDataProvider } from './context/HealthDataContext';
import DailyGraph from './components/DailyGraph';
import FileManager from './components/FileManager';
import HistoryView from './components/HistoryView';
import WeeklyGraph from './components/WeeklyGraph';

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      setHasError(true);
      console.error('Error:', error, errorInfo);
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return <div>Error: Something went wrong. Please try reloading the page.</div>;
  }

  return children;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <HealthDataProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Run Tracker
              </h1>
            </header>
            <nav className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded bg-blue-500 text-white ${
                  activeTab === 'dashboard' ? 'bg-blue-700' : ''
                }`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`px-4 py-2 rounded bg-blue-500 text-white ${
                  activeTab === 'history' ? 'bg-blue-700' : ''
                }`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
              <button
                className={`px-4 py-2 rounded bg-blue-500 text-white ${
                  activeTab === 'file' ? 'bg-blue-700' : ''
                }`}
                onClick={() => setActiveTab('file')}
              >
                File
              </button>
            </nav>
            <div className="mt-8">
              {activeTab === 'dashboard' && <DailyGraph />}
              {activeTab === 'history' && <HistoryView />}
              {activeTab === 'file' && <FileManager />}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </HealthDataProvider>
  );
}

export default App;
