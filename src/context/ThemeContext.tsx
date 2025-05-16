import React, { createContext, useCallback, useEffect, useState } from 'react';

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme');
      if (theme) return theme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') setIsDark(true);
    if (theme === 'light') setIsDark(false);
  }, []);

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export { ThemeContext };
