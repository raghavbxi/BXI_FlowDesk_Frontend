import { create } from 'zustand';

// Simple localStorage-based theme store
const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem('theme-mode');
    return stored === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

const useThemeStore = create((set) => ({
  mode: getStoredTheme(),
  toggleTheme: () => {
    set((state) => {
      const newMode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme-mode', newMode);
      return { mode: newMode };
    });
  },
  setTheme: (mode) => {
    localStorage.setItem('theme-mode', mode);
    set({ mode });
  },
}));

export default useThemeStore;

