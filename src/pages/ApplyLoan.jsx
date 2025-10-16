import { useState } from 'react';
import { Box, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { useNavigate } from 'react-router-dom';
import { useLoans } from '../context/LoanContext.jsx';

const defaults = {
  amount: '',
  tenureMonths: '',
  interestRate: '',
  purpose: ''
};

const ApplyLoan = () => {
  const { applyLoan } = useLoans();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(defaults);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!formValues.amount || Number(formValues.amount) <= 0) nextErrors.amount = 'Enter a valid amount.';
    if (!formValues.tenureMonths || Number(formValues.tenureMonths) <= 0)
      nextErrors.tenureMonths = 'Tenure is required.';
    if (!formValues.interestRate || Number(formValues.interestRate) <= 0)
      nextErrors.interestRate = 'Interest rate is required.';
    if (!formValues.purpose) nextErrors.purpose = 'Purpose is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const result = applyLoan({
      amount: Number(formValues.amount),
      tenureMonths: Number(formValues.tenureMonths),
      interestRate: Number(formValues.interestRate),
      purpose: formValues.purpose
    });

    if (result.success) {
      setFormValues(defaults);
      navigate('/dashboard');
    }
  };

  return (
    <Box maxWidth={720} mx="auto">
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }} component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              Submit a new loan application
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Provide the basic loan details. Admins can review and approve your request shortly after submission.
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Loan amount"
                name="amount"
                type="number"
                value={formValues.amount}
                onChange={handleChange}
                error={Boolean(errors.amount)}
                helperText={errors.amount}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tenure (months)"
                name="tenureMonths"
                type="number"
                value={formValues.tenureMonths}
                onChange={handleChange}
                error={Boolean(errors.tenureMonths)}
                helperText={errors.tenureMonths}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Interest rate (%)"
                name="interestRate"
                type="number"
                value={formValues.interestRate}
                onChange={handleChange}
                error={Boolean(errors.interestRate)}
                helperText={errors.interestRate}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Purpose"
                name="purpose"
                value={formValues.purpose}
                onChange={handleChange}
                error={Boolean(errors.purpose)}
                helperText={errors.purpose}
                fullWidth
                multiline
                minRows={3}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" startIcon={<DescriptionRoundedIcon />}>
            Submit application
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ApplyLoan;
