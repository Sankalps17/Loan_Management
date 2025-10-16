import { IconButton, Tooltip } from '@mui/material';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useThemeMode } from '../../context/ThemeContext.jsx';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}>
      <IconButton onClick={toggleTheme} color="primary" size="small">
        {mode === 'light' ? <DarkModeRoundedIcon fontSize="inherit" /> : <LightModeRoundedIcon fontSize="inherit" />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
