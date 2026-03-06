const STORAGE_KEY = 'runTrackerData';
const FILE_HANDLE_KEY = 'runTrackerFileHandle';

export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        runEntries: data.runEntries || [],
        monthlyGoal: data.monthlyGoal || 0,
      };
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return { runEntries: [], monthlyGoal: 0 };
}

export function saveData(runEntries, monthlyGoal) {
  try {
    const data = { runEntries, monthlyGoal };
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
