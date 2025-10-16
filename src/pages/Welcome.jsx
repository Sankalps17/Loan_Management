import PropTypes from 'prop-types';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';

const Welcome = () => (
  <Box component="section" className="py-16">
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
            Smart Lending Simplified
          </Typography>
          <Typography variant="h3" fontWeight={800} lineHeight={1.2}>
            Manage loans, EMIs and approvals in one clean dashboard.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track repayments, approve applications faster, and stay aligned with your borrowers using our modular loan
            management platform.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
            <Button component={RouterLink} to="/signup" variant="contained" size="large">
              Get Started
            </Button>
            <Button component={RouterLink} to="/login" variant="outlined" size="large" startIcon={<PlayCircleOutlineRoundedIcon />}>
              View Demo
            </Button>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Highlights
          </Typography>
          <Stack spacing={2}>
            <HighlightItem title="Role-based dashboards" description="Tailored experiences for users and admins." />
            <HighlightItem title="EMI automation" description="Auto-calculated schedules with payment tracking." />
            <HighlightItem title="Real-time feedback" description="Actionable toasts, modals, and approvals flow." />
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

const HighlightItem = ({ title, description }) => (
  <Stack spacing={0.5}>
    <Typography variant="subtitle1" fontWeight={600}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Stack>
);

HighlightItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default Welcome;
