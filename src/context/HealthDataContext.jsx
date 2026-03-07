import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { createFile, openFile, writeFile, readFile } from '../utils/fileOperations';
import { loadData, saveData, saveFileHandleInfo, getFileHandleInfo } from '../utils/storage';

const HealthDataContext = createContext();

export function HealthDataProvider({ children }) {
  const [runEntries, setRunEntries] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fileHandle, setFileHandle] = useState(null);
  const [fileStatus, setFileStatus] = useState('none'); // 'none', 'saving', 'saved', 'error'
  const fileHandleRef = useRef(null);

  // Load data on startup
  useEffect(() => {
    async function initialize() {
      // Load from localStorage first
      const loaded = loadData();
      console.log('Loaded data:', loaded);
      setRunEntries(loaded.runEntries);
      setMonthlyGoal(loaded.monthlyGoal || 0);
      setIsLoaded(true);

      // Try to set up file auto-save
      const handleInfo = getFileHandleInfo();
      if (handleInfo && 'showOpenFilePicker' in window) {
        const handle = await openFile();
        if (handle) {
          fileHandleRef.current = handle;
          setFileHandle(handle);
          saveFileHandleInfo(handle);
          await saveToFile();
        }
      }
    }

    initialize();
  }, []);

  // Save data to file
  async function saveToFile() {
    const handle = fileHandleRef.current;
    if (!handle) return;

    setFileStatus('saving');
    const success = await writeFile(handle, {
      runEntries,
      monthlyGoal,
      lastSaved: new Date().toISOString()
    });

    if (success) {
      setFileStatus('saved');
    } else {
      setFileStatus('error');
    }
  }

  // Setup file handle
  async function setupFileHandle() {
    const handle = await createFile();
    if (handle) {
      fileHandleRef.current = handle;
      setFileHandle(handle);
      saveFileHandleInfo(handle);
      await saveToFile();
      return true;
    }
    return false;
  }

  // Load data from file
  async function loadFromFile() {
    const handle = await openFile();
    if (handle) {
      fileHandleRef.current = handle;
      setFileHandle(handle);
      saveFileHandleInfo(handle);

      const data = await readFile(handle);
      console.log('Data read from file:', data);
      if (data?.runEntries) {
        setRunEntries(data.runEntries);
      }
      if (data?.monthlyGoal) {
        setMonthlyGoal(data.monthlyGoal);
      }
    }
  }

  // Add a new run entry
  const addRunEntry = (entry) => {
    console.log('Adding run entry:', entry);
    setRunEntries([...runEntries, entry]);
  };

  // Delete a run entry
  const deleteRunEntry = (id) => {
    console.log('Deleting run entry with id:', id);
    setRunEntries(runEntries.filter(entry => entry.id !== id));
  };

  // Set all data
  const setAllData = (runEntries) => {
    console.log('Setting all data:', runEntries);
    setRunEntries(runEntries);
  };

  // Export data
  const exportData = () => {
    const data = {
      runEntries,
      monthlyGoal,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  // Import data
  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      console.log('Importing data:', data);
      if (data.runEntries && Array.isArray(data.runEntries)) {
        setAllData(data.runEntries);
      }
      if (data.monthlyGoal) {
        setMonthlyGoal(data.monthlyGoal);
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  // Calculate total distance for the current month
  const totalDistanceThisMonth = useMemo(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const total = runEntries.reduce((total, entry) => {
      const entryDate = new Date(entry.date);
      if (entryDate >= firstDayOfMonth && entryDate <= lastDayOfMonth) {
        return total + parseFloat(entry.distance);
      }
      return total;
    }, 0);

    console.log('Total distance this month:', total);
    return total;
  }, [runEntries]);

  return (
    <HealthDataContext.Provider
      value={{
        runEntries,
        monthlyGoal,
        isLoaded,
        fileHandle,
        fileStatus,
        addRunEntry,
        deleteRunEntry,
        setAllData,
        exportData,
        importData,
        setupFileHandle,
        loadFromFile,
        totalDistanceThisMonth,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
}

export function useHealthData() {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within HealthDataProvider');
  }
  return context;
}
