import PropTypes from 'prop-types';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import { useAuth } from '../context/AuthContext.jsx';
import { useLoans } from '../context/LoanContext.jsx';
import LoanCard from '../components/cards/LoanCard.jsx';
import { formatCurrency } from '../utils/currency.js';

const UserDashboard = () => {
  const { user } = useAuth();
  const { getLoansByUser } = useLoans();

  const userLoans = getLoansByUser(user.id);
  const approvedLoans = userLoans.filter((loan) => loan.status === 'approved');
  const pendingLoans = userLoans.filter((loan) => loan.status === 'pending');

  const outstandingBalance = approvedLoans.reduce((total, loan) => {
    const pending = loan.emiSchedule.filter((installment) => installment.status !== 'paid');
    return total + pending.reduce((acc, installment) => acc + installment.amount, 0);
  }, 0);

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight={800}>
        Hi {user.fullName.split(' ')[0]}, here is the latest on your loans.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Active Loans"
            value={approvedLoans.length}
            icon={<ChecklistRoundedIcon color="primary" />}
            subtitle="Approved and running"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Pending Approvals"
            value={pendingLoans.length}
            icon={<PendingActionsRoundedIcon color="warning" />}
            subtitle="Submitted & awaiting review"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Outstanding Balance"
            value={formatCurrency(outstandingBalance)}
            icon={<PaidRoundedIcon color="success" />}
            subtitle="Across approved loans"
          />
        </Grid>
      </Grid>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          Loan portfolio
        </Typography>
        {userLoans.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              You have no loans yet.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submit a new application to see your loan progress here.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {userLoans.map((loan) => (
              <Grid item xs={12} md={6} key={loan.id}>
                <LoanCard loan={loan} />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Stack>
  );
};

const StatCard = ({ title, value, subtitle, icon }) => (
  <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        {icon}
        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="h4" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Stack>
  </Paper>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired
};

export default UserDashboard;
