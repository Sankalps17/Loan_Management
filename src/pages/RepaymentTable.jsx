import PropTypes from 'prop-types';
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';
import { useLoans } from '../context/LoanContext.jsx';
import { formatCurrency } from '../utils/currency.js';
import { formatDate } from '../utils/dateHelpers.js';

const RepaymentTable = () => {
  const { user } = useAuth();
  const { getLoansByUser } = useLoans();
  const loans = getLoansByUser(user.id);

  const rows = loans.flatMap((loan) =>
    loan.emiSchedule.map((installment) => ({
      id: installment.id,
      loanId: loan.id,
      purpose: loan.purpose,
      dueDate: installment.dueDate,
      amount: installment.amount,
      status: installment.status,
      transactionId: installment.transactionId
    }))
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Repayment history
      </Typography>
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: 'action.hover' }}>
            <TableRow>
              <HeaderCell>Loan</HeaderCell>
              <HeaderCell>Due Date</HeaderCell>
              <HeaderCell align="right">Amount</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Transaction ID</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No repayment records yet. Once you have an active loan, repayments will be tracked here.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.purpose}</TableCell>
                  <TableCell>{formatDate(row.dueDate)}</TableCell>
                  <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.transactionId ?? '—'}</TableCell>
                </TableRow>
              ))
            )}
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

export default RepaymentTable;
