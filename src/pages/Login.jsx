import { useState } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!formValues.email) nextErrors.email = 'Email is required.';
    if (!formValues.password) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const result = await login(formValues.email, formValues.password);
    if (result.success) {
      const redirectPath = location.state?.from?.pathname ?? '/dashboard';
      navigate(redirectPath);
    }
  };

  return (
    <Box maxWidth={420} mx="auto">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }} component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your personalized dashboard.
            </Typography>
          </Stack>
          <TextField
            variant="outlined"
            label="Email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            autoComplete="email"
          />
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" startIcon={<LoginRoundedIcon />}>
            Login
          </Button>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Need an account?{' '}
            <RouterLink to="/signup" className="text-brand-500">
              Create one
            </RouterLink>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
