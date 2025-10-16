import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../theme/ThemeToggle.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const baseLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <DashboardCustomizeRoundedIcon fontSize="small" />
    },
    {
      to: '/apply',
      label: 'Apply Loan',
      icon: <SummarizeRoundedIcon fontSize="small" />,
      roles: ['user']
    },
    {
      to: '/emi-tracker',
      label: 'EMI Tracker',
      icon: <PaymentsRoundedIcon fontSize="small" />,
      roles: ['user']
    },
    {
      to: '/repayment',
      label: 'Repayment Table',
      icon: <ReceiptLongRoundedIcon fontSize="small" />,
      roles: ['user']
    },
    {
      to: '/admin',
      label: 'Admin Board',
      icon: <AdminPanelSettingsRoundedIcon fontSize="small" />,
      roles: ['admin']
    },
    {
      to: '/admin/approved',
      label: 'Approved Loans',
      icon: <SummarizeRoundedIcon fontSize="small" />,
      roles: ['admin']
    }
  ];

  const filteredLinks = baseLinks.filter((link) => !link.roles || link.roles.includes(user.role));

  return (
    <AppBar position="sticky" className="z-50" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Loan Manager
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
          {filteredLinks.map((link) => (
            <NavLink key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <Button
                  color="inherit"
                  startIcon={link.icon}
                  size="small"
                  sx={{
                    color: isActive ? 'primary.main' : 'text.primary',
                    fontWeight: isActive ? 600 : 500
                  }}
                >
                  {link.label}
                </Button>
              )}
            </NavLink>
          ))}
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: { xs: 2, sm: 4 } }}>
          <ThemeToggle />
          <Button color="inherit" startIcon={<LogoutRoundedIcon />} onClick={handleLogout} size="small">
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
