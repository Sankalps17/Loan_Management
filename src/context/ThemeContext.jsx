import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext(undefined);
const STORAGE_KEY = 'lms.theme-preference';

const buildTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#306fff' },
      secondary: { main: '#0b3db3' },
      background: {
        default: mode === 'dark' ? '#020817' : '#f8fafc',
        paper: mode === 'dark' ? '#0f172a' : '#ffffff'
      }
    },
    shape: { borderRadius: 12 }
  });

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem(STORAGE_KEY) ?? 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used inside ThemeProvider');
  }
  return context;
};
