import PropTypes from 'prop-types';
import {
  Avatar,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { useLoans } from '../context/LoanContext.jsx';
import { formatCurrency } from '../utils/currency.js';
import { formatDate } from '../utils/dateHelpers.js';

const ApprovedLoans = () => {
  const { approvedLoans } = useLoans();

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={800}>
          Approved loans overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track loans that are active and have cleared the approval workflow.
        </Typography>
      </Stack>
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: 'action.hover' }}>
            <TableRow>
              <HeaderCell>Applicant</HeaderCell>
              <HeaderCell align="right">Amount</HeaderCell>
              <HeaderCell align="right">Approved on</HeaderCell>
              <HeaderCell align="right">Next EMI</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvedLoans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <Stack spacing={1} alignItems="center">
                    <TaskAltRoundedIcon color="disabled" />
                    <Typography variant="body2" color="text.secondary">
                      No approved loans yet. Approved applications will appear here automatically.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              approvedLoans.map((loan) => (
                <TableRow key={loan.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar>{loan.applicantName[0]}</Avatar>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {loan.applicantName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Approved by {loan.approvedBy ?? 'N/A'}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">{formatCurrency(loan.amount)}</TableCell>
                  <TableCell align="right">{loan.approvedAt ? formatDate(loan.approvedAt) : '—'}</TableCell>
                  <TableCell align="right">
                    {loan.nextEmiDate ? formatDate(loan.nextEmiDate) : 'Schedule completed'}
                  </TableCell>
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

export default ApprovedLoans;
