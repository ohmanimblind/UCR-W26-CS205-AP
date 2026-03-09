import React, { useState, useRef, useEffect } from 'react';
import { useHealthData } from '../context/HealthDataContext';

function FileManager() {
  const { exportData, importData, setupFileHandle, loadFromFile, fileHandle, fileStatus } = useHealthData();
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (fileStatus === 'saved') {
      setTimeout(() => setImportSuccess(false), 2000);
    }
  }, [fileStatus]);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `run-tracking-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setImportText(content);
        handleImport(content);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = (jsonString = importText) => {
    setImportError('');
    setImportSuccess(false);

    if (!jsonString.trim()) {
      setImportError('Please provide JSON data');
      return;
    }

    const success = importData(jsonString);
    if (success) {
      setImportSuccess(true);
    } else {
      setImportError('Error importing data');
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all run data? This cannot be undone.')) {
      importData(JSON.stringify({ runEntries: [] }));
      setImportText('');
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">File Management</h2>
      <div className="mb-4">
        <button onClick={handleExport} className="bg-derby-green text-white p-2 rounded">
          Export Data
        </button>
      </div>
      <div className="mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <button onClick={handleImport} className="bg-derby-green text-white p-2 rounded">
          Import Data
        </button>
      </div>
      {importError && <p className="text-red-500">{importError}</p>}
      {importSuccess && <p className="text-green-500">Data imported successfully!</p>}
    </div>
  );
}

export default FileManager;
