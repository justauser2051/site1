import { useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Load saved theme from localStorage, default to dark if not found
    const savedTheme = localStorage.getItem('sleep-app-theme') as Theme;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const body = document.body;
    
    if (newTheme === 'light') {
      // Light theme with military-inspired gradient
      root.classList.remove('dark');
      root.classList.add('light');
      body.className = 'bg-gradient-to-br from-white via-emerald-50 to-emerald-100 transition-colors duration-300';
    } else {
      // Dark theme classes (default)
      root.classList.remove('light');
      root.classList.add('dark');
      body.className = 'bg-slate-950 transition-colors duration-300';
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('sleep-app-theme', newTheme);
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
};