import PropTypes from 'prop-types';
import { Chip, Paper, Stack, Typography } from '@mui/material';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { formatDate } from '../../utils/dateHelpers.js';
import { formatCurrency } from '../../utils/currency.js';

const statusMap = {
  approved: { label: 'Approved', color: 'success', icon: <PaidRoundedIcon fontSize="inherit" /> },
  pending: { label: 'Pending', color: 'warning', icon: <PendingRoundedIcon fontSize="inherit" /> },
  rejected: { label: 'Rejected', color: 'error', icon: <CancelRoundedIcon fontSize="inherit" /> }
};

const LoanCard = ({ loan }) => {
  const status = statusMap[loan.status] ?? statusMap.pending;
  const nextEmi = loan.emiSchedule.find((item) => item.status === 'pending');

  return (
    <Paper elevation={1} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <div>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {loan.purpose}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tenure: {loan.tenureMonths} months @ {loan.interestRate}%
          </Typography>
        </div>
        <Chip
          icon={status.icon}
          label={status.label}
          color={status.color}
          variant="filled"
          size="small"
          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
        />
      </Stack>
      <Typography variant="h4" fontWeight={700} color="primary.main">
        {formatCurrency(loan.amount)}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <EventAvailableRoundedIcon fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          Next EMI {nextEmi ? formatDate(nextEmi.dueDate) : 'completed'}
        </Typography>
      </Stack>
    </Paper>
  );
};

LoanCard.propTypes = {
  loan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    purpose: PropTypes.string.isRequired,
    tenureMonths: PropTypes.number.isRequired,
    interestRate: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    emiSchedule: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        dueDate: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export default LoanCard;
