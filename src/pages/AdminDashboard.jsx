import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { useLoans } from '../context/LoanContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatCurrency } from '../utils/currency.js';
import { formatDate } from '../utils/dateHelpers.js';
import ApproveModal from '../components/modals/ApproveModal.jsx';

const AdminDashboard = () => {
  const { pendingLoans, approveLoan, rejectLoan } = useLoans();
  const { user } = useAuth();
  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleApprove = (loanId) => {
    approveLoan(loanId, user.fullName);
    setSelectedLoan(null);
  };

  const handleReject = (loanId) => {
    rejectLoan(loanId, 'Rejected by admin');
    setSelectedLoan(null);
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={800}>
          Pending loan applications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review new submissions and move them forward. You can open each record for a quick decision.
        </Typography>
      </Stack>
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table size="small" aria-label="Pending loan applications">
          <TableHead sx={{ backgroundColor: 'action.hover' }}>
            <TableRow>
              <HeaderCell>Applicant</HeaderCell>
              <HeaderCell align="right">Amount</HeaderCell>
              <HeaderCell align="right">Tenure</HeaderCell>
              <HeaderCell align="right">Submitted</HeaderCell>
              <HeaderCell align="center">Actions</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingLoans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Stack spacing={1} alignItems="center">
                    <InfoRoundedIcon color="disabled" />
                    <Typography variant="body2" color="text.secondary">
                      Nothing to review. Approved applications will appear in the Approved tab.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              pendingLoans.map((loan) => (
                <TableRow key={loan.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar>{loan.applicantName[0]}</Avatar>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {loan.applicantName}
                        </Typography>
                        <Chip label={loan.purpose} size="small" color="primary" variant="outlined" />
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">{formatCurrency(loan.amount)}</TableCell>
                  <TableCell align="right">{loan.tenureMonths} months</TableCell>
                  <TableCell align="right">{formatDate(loan.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        aria-label="Reject application"
                        color="error"
                        onClick={() => handleReject(loan.id)}
                        size="small"
                      >
                        <CancelRoundedIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        aria-label="Approve application"
                        color="success"
                        onClick={() => handleApprove(loan.id)}
                        size="small"
                      >
                        <CheckCircleRoundedIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        aria-label="Open details"
                        onClick={() => setSelectedLoan(loan)}
                        size="small"
                        sx={{ zIndex: 60 }}
                      >
                        <InfoRoundedIcon fontSize="inherit" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
      <ApproveModal
        open={Boolean(selectedLoan)}
        loan={selectedLoan}
        onClose={() => setSelectedLoan(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
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

export default AdminDashboard;
