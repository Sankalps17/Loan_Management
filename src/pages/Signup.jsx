import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const defaultValues = {
  fullName: '',
  email: '',
  password: '',
  role: 'user'
};

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!formValues.fullName) nextErrors.fullName = 'Name is required.';
    if (!formValues.email) nextErrors.email = 'Email is required.';
    if (!formValues.password || formValues.password.length < 6)
      nextErrors.password = 'Password must be at least 6 characters.';
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

    const result = await signup(formValues);
    if (result.success) {
      const redirect = formValues.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirect);
    }
  };

  return (
    <Box maxWidth={460} mx="auto">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }} component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              Create your account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a role and follow the guided experience built for you.
            </Typography>
          </Stack>
          <TextField
            label="Full name"
            name="fullName"
            value={formValues.fullName}
            onChange={handleChange}
            error={Boolean(errors.fullName)}
            helperText={errors.fullName}
            autoComplete="name"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            autoComplete="email"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            autoComplete="new-password"
          />
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select labelId="role-label" label="Role" name="role" value={formValues.role} onChange={handleChange}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" startIcon={<PersonAddAltRoundedIcon />}>
            Sign Up
          </Button>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Already have an account?{' '}
            <RouterLink to="/login" className="text-brand-500">
              Login instead
            </RouterLink>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Signup;
