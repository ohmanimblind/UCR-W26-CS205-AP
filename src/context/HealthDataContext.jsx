import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createFile, openFile, writeFile, readFile } from '../utils/fileOperations';
import { loadData, saveData, saveFileHandleInfo, getFileHandleInfo } from '../utils/storage';

const HealthDataContext = createContext();

export function HealthDataProvider({ children }) {
  const [runEntries, setRunEntries] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fileHandle, setFileHandle] = useState(null);
  const [fileStatus, setFileStatus] = useState('none'); // 'none', 'saving', 'saved', 'error'
  const fileHandleRef = useRef(null);

  // Load data on startup
  useEffect(() => {
    async function initialize() {
      // Load from localStorage first
      const loaded = loadData();
      setRunEntries(loaded.runEntries);
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
      if (data?.runEntries) {
        setRunEntries(data.runEntries);
      }
    }
  }

  // Add a new run entry
  const addRunEntry = (entry) => {
    setRunEntries([...runEntries, entry]);
  };

  // Delete a run entry
  const deleteRunEntry = (id) => {
    setRunEntries(runEntries.filter(entry => entry.id !== id));
  };

  // Set all data
  const setAllData = (runEntries) => {
    setRunEntries(runEntries);
  };

  // Export data
  const exportData = () => {
    const data = {
      runEntries,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  // Import data
  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.runEntries && Array.isArray(data.runEntries)) {
        setAllData(data.runEntries);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  return (
    <HealthDataContext.Provider
      value={{
        runEntries,
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
