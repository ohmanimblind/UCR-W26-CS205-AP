const STORAGE_KEY = 'run-tracking-data';
const FILE_HANDLE_KEY = 'run-tracking-file-handle';

export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        runEntries: data.runEntries || [],
      };
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return { runEntries: [] };
}

export function saveData(runEntries) {
  try {
    const data = { runEntries };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

export function saveFileHandleInfo(fileHandle) {
  const info = { name: fileHandle.name, kind: fileHandle.kind };
  localStorage.setItem(FILE_HANDLE_KEY, JSON.stringify(info));
}

export function getFileHandleInfo() {
  try {
    const stored = localStorage.getItem(FILE_HANDLE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
}
