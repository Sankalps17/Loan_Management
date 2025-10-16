import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useAuth } from '../context/AuthContext.jsx';
import { useLoans } from '../context/LoanContext.jsx';
import { formatCurrency } from '../utils/currency.js';
import { formatDate } from '../utils/dateHelpers.js';

const EMITracker = () => {
  const { user } = useAuth();
  const { getLoansByUser, markEmiPaid } = useLoans();
  const loans = getLoansByUser(user.id).filter((loan) => loan.status === 'approved');
  const [selectedLoanId, setSelectedLoanId] = useState(loans[0]?.id ?? '');

  const activeLoan = useMemo(() => loans.find((loan) => loan.id === selectedLoanId) ?? loans[0], [loans, selectedLoanId]);

  const handleChange = (event) => {
    setSelectedLoanId(event.target.value);
  };

  const handleMarkPaid = (installmentId) => {
    if (!activeLoan) return;
    markEmiPaid({ loanId: activeLoan.id, installmentId });
  };

  if (loans.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          No EMI schedules yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Once a loan is approved you can track and update EMI payments here in real time.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Typography variant="h5" fontWeight={700}>
          EMI tracker
        </Typography>
        <Box>
          <Select size="small" value={activeLoan?.id ?? ''} onChange={handleChange} displayEmpty>
            {loans.map((loan) => (
              <MenuItem key={loan.id} value={loan.id}>
                {loan.purpose} · {formatCurrency(loan.amount)}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Stack>
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: 'action.hover' }}>
            <TableRow>
              <HeaderCell>No.</HeaderCell>
              <HeaderCell>Due Date</HeaderCell>
              <HeaderCell align="right">Amount</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell align="right">Action</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeLoan?.emiSchedule.map((installment) => (
              <TableRow key={installment.id} hover>
                <TableCell>{installment.sequence}</TableCell>
                <TableCell>{formatDate(installment.dueDate)}</TableCell>
                <TableCell align="right">{formatCurrency(installment.amount)}</TableCell>
                <TableCell>{installment.status}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CheckRoundedIcon />}
                    disabled={installment.status === 'paid'}
                    onClick={() => handleMarkPaid(installment.id)}
                  >
                    Mark paid
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
};

const HeaderCell = ({ children, align }) => (
  <TableCell align={align} sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>
    {children}
  </TableCell>
);

HeaderCell.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center'])
};

HeaderCell.defaultProps = {
  align: 'left'
};

export default EMITracker;
